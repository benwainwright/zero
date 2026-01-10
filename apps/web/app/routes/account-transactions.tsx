import {
  Currency,
  DateLabel,
  Loader,
  NewTransactionRow,
  Page,
} from '@components';
import { Table, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAccount, useCommand, useTransactions } from '@zero/react-api';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { modals } from '@mantine/modals';

const AccountTransactions = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { account } = useAccount(accountId);
  const maybeResponse = useTransactions(accountId, 0, 30);
  const [creatingNewTx, setCreatingNewTx] = useState(false);
  const { execute: createAccount } = useCommand('CreateTransactionCommand');
  const { execute: deleteAccount } = useCommand('DeleteAccountCommand');
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      payee: '',
      date: new Date(),
      amount: '',
    },
  });

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
          return (
            <form
              method="post"
              onSubmit={form.onSubmit(async (values) => {
                await createAccount({
                  accountId,
                  ...values,
                  amount: Number(values.amount) * 1000,
                });
                setCreatingNewTx(false);
              })}
            >
              <Table
                highlightOnHover
                tabularNums
                verticalSpacing={'sm'}
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Payee</Table.Th>
                    <Table.Th>Amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <NewTransactionRow open={creatingNewTx} form={form} />
                  {response.transactions.map((tx) => {
                    return (
                      <Table.Tr key={`${tx.id}-tx-row`}>
                        <Table.Td>
                          <DateLabel date={tx.date} />
                        </Table.Td>
                        <Table.Td>{tx.payee}</Table.Td>
                        <Table.Td>
                          <Currency>{tx.amount}</Currency>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </form>
          );
        }}
      </Loader>
    </Page>
  );
};

export default AccountTransactions;
