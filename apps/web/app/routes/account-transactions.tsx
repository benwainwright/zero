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
  useCommand,
  useTransactions,
} from '@zero/react-api';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { modals } from '@mantine/modals';

const AccountTransactions = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { account } = useAccount(accountId);
  const { execute: linkAccount } = useCommand('LinkAccountCommand');
  const maybeResponse = useTransactions(accountId, 0, 30);
  const connection = useBankConnection();
  const { execute: deleteAccount } = useCommand('DeleteAccountCommand');
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
          {connection.loaded &&
            connection.isConnected &&
            !account.linkedOpenBankingAccount && (
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
      <Loader data={maybeResponse}>
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
