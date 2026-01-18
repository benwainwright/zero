import {
  LinkAccountButton,
  Loader,
  Page,
  TransactionsTable,
} from '@components';
import { Button, Text } from '@mantine/core';
import {
  useAccount,
  useBankConnection,
  useRequest,
  useTransactions,
} from '@zero/react-api';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { modals } from '@mantine/modals';

const AccountTransactions = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { account } = useAccount(accountId);
  const { execute: linkAccount } = useRequest('LinkAccountCommand');
  const { transactions, syncAccount } = useTransactions(accountId, 0, 30);
  const connection = useBankConnection();
  const { execute: deleteAccount } = useRequest('DeleteAccountCommand');
  const [creatingNewTx, setCreatingNewTx] = useState(false);
  const navigate = useNavigate();
  const confirmDeleteAccount = () =>
    modals.openConfirmModal({
      title: 'Are you sure?',
      children: (
        <Text size="sm">
          This action will delete this account along with all its associated
          transactions. Click 'confirm' if you are sure...
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: async () => {
        await deleteAccount({ account: accountId ?? '' });
        await navigate('/accounts');
      },
    });

  if (!accountId) {
    throw new Error(`Account id missing!`);
  }

  return (
    <Page
      routeName="accountTransactions"
      title={account?.name ?? ''}
      headerActions={
        <>
          {connection.connectionStatus?.status === 'connected' &&
          account.linkedOpenBankingAccount ? (
            <>
              <Button variant="subtle">Unlink</Button>
              <Button
                variant="subtle"
                onClick={async () => {
                  await syncAccount();
                }}
              >
                Sync
              </Button>
            </>
          ) : (
            <LinkAccountButton
              onPick={async (obAccount) => {
                await linkAccount({
                  obAccountId: obAccount,
                  localId: accountId,
                });
              }}
            />
          )}
          <Button onClick={() => setCreatingNewTx(true)} variant="subtle">
            New Transaction
          </Button>
          <Button
            variant="subtle"
            color="red"
            onClick={() => confirmDeleteAccount()}
          >
            Delete Account
          </Button>
        </>
      }
    >
      <Loader data={transactions}>
        {(response) => {
          return response.transactions.length > 0 || creatingNewTx ? (
            <TransactionsTable
              onTransactionCreated={() => setCreatingNewTx(false)}
              creatingNewTransaction={creatingNewTx}
              transactions={response.transactions}
              accountId={accountId}
            />
          ) : (
            <Text>
              This account has no transactions. Click the button above to create
              one!
            </Text>
          );
        }}
      </Loader>
    </Page>
  );
};

export default AccountTransactions;
