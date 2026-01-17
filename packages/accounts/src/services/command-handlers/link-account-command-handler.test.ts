import { buildRequestHandler } from '@zero/test-helpers';
import { LinkAccountCommandHandler } from './link-account-command-handler.ts';
import { when } from 'vitest-when';
import { Account } from '@zero/domain';
import { mock } from 'vitest-mock-extended';
describe('link account command handler', () => {
  it('gets the account from the repo, calls link account and then saves it', async () => {
    const {
      handler,
      context,
      dependencies: [accountRepo, writer],
    } = await buildRequestHandler(
      LinkAccountCommandHandler,
      'LinkAccountCommand',
      { obAccountId: 'foo', localId: 'bar' },
      'ben'
    );

    const mockAccount = mock<Account>();

    when(accountRepo.require).calledWith('bar').thenResolve(mockAccount);

    await handler.tryHandle(context);

    expect(mockAccount.linkAccount).toHaveBeenCalledWith('foo');
    expect(writer.update).toHaveBeenCalledWith(mockAccount);
  });
});
