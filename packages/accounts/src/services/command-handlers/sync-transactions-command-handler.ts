import { inject, type AccountsEvents } from '@core';
import type {
  IAccountRepository,
  IOpenBankingClient,
  ITransactionRepository,
} from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractRequestHandler,
  AppError,
  type IAllEvents,
  type IEventBus,
  type IRequestContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import { Transaction, type IOpenBankingTransaction } from '@zero/domain';

export class SyncTransactionsCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'SyncTransactionsCommandHandler'
> {
  public constructor(
    @inject('OpenBankingClient')
    private readonly bank: IOpenBankingClient,

    @inject('OpenBankingTokenManager')
    private readonly tokens: OpenBankingTokenManager,

    @inject('AccountRepository')
    private readonly accounts: IAccountRepository,

    @inject('TransactionRepository')
    private readonly tansactions: ITransactionRepository,

    @inject('TransactionWriter')
    private readonly transactionWriter: IWriteRepository<Transaction>,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('EventBus')
    private readonly events: IEventBus<IAllEvents & AccountsEvents>,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
    params: { accountId },
  }: IRequestContext<{
    id: string;
    key: 'SyncTransactionsCommandHandler';
    params: { accountId: string };
    response: undefined;
  }>): Promise<undefined> {
    this.events.emit('SyncAccountStarted', { accountId });
    try {
      this.grants.assertLogin(authContext);
      this.grants.requiresNoPermissions();
      const tokenPromise = this.tokens.getToken(authContext.id);
      const account = await this.accounts.require(accountId);

      if (!account.linkedOpenBankingAccount) {
        throw new AppError(`Account is not linked!`);
      }

      const { booked, pending } = await this.bank.getAccountTransactions(
        await tokenPromise,
        account.linkedOpenBankingAccount
      );

      const allFetchedBankTransactions = [
        ...booked.map((transaction) => ({ ...transaction, pending: false })),
        ...pending.map((transaction) => ({ ...transaction, pending: true })),
      ];

      const existingTransactions = await this.tansactions.getMany(
        allFetchedBankTransactions
          .map((transaction) => transaction.transactionId)
          .flatMap((id) => (id ? [id] : []))
      );

      const allBankTransactionEntries = allFetchedBankTransactions.map(
        (transaction) => [transaction.transactionId ?? '', transaction] as const
      );

      const fetchedTransactionsMap = new Map<
        string,
        IOpenBankingTransaction & { pending: boolean }
      >(allBankTransactionEntries);

      const existingTransactionMap = new Map<string, Transaction>(
        existingTransactions.map((transaction) => [transaction.id, transaction])
      );

      const newTransactions = allFetchedBankTransactions
        .filter(
          (transaction) =>
            transaction.transactionId &&
            !existingTransactionMap.has(transaction.transactionId)
        )
        .map((newTransaction) => {
          const { pending, ...fetchedTx } = newTransaction;
          return Transaction.createFromObTransaction(
            fetchedTx,
            pending,
            accountId,
            authContext.id
          );
        });

      existingTransactionMap.values().forEach((transaction) => {
        const found = fetchedTransactionsMap.get(transaction.id);
        if (!found) {
          return undefined;
        }
        const { pending, ...fetchedTx } = found;
        return transaction.updateFromObTransaction(fetchedTx, pending);
      });

      await this.transactionWriter.updateAll(
        Array.from(existingTransactionMap.values())
      );

      await this.transactionWriter.saveAll(newTransactions);
    } finally {
      this.events.emit('SyncAccountFinished', { accountId });
    }
  }

  public override readonly name = 'SyncTransactionsCommandHandler';
}
