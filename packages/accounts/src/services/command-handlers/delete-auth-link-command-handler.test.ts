import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import { DeleteAuthLinkCommandHandler } from './delete-auth-link-command-handler.ts';
import type { AccountsCommands } from '@services';
import { BANK_AUTH_LINK_STORAGE_KEY } from '@constants';

const getContext = getCommandContextBuilder<AccountsCommands>();

describe('delete auth link command handler', () => {
  it('deletes the auth link', async () => {
    const [handler, objectStore] = await buildInstance(
      DeleteAuthLinkCommandHandler
    );

    const context = getContext('DeleteAuthLinkCommand', undefined, 'ben');

    await handler.tryHandle(context);

    expect(objectStore.set).toHaveBeenCalledWith(
      BANK_AUTH_LINK_STORAGE_KEY,
      'ben',
      undefined
    );
  });
});
