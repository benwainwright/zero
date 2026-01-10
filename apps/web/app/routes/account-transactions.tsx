import {
  Currency,
  DateLabel,
  Loader,
  NewTransactionRow,
  Page,
} from '@components';
import { Table, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAccount, useCommand, useTransactions } from '@zero/react-api';
import { useState } from 'react';
import { useParams } from 'react-router';

const AccountTransactions = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { account } = useAccount(accountId);
  const maybeResponse = useTransactions(accountId, 0, 30);
  const [creatingNewTx, setCreatingNewTx] = useState(false);
  const { execute } = useCommand('CreateTransactionCommand');
  const form = useForm({
    initialValues: {
      payee: '',
      date: new Date(),
      amount: '',
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
        <Button
          onClick={() => setCreatingNewTx(true)}
          size="compact-sm"
          variant="outline"
        >
          Create
        </Button>
      }
    >
      <Loader data={maybeResponse}>
        {(response) => {
          return (
            <form
              method="post"
              onSubmit={form.onSubmit(async (values) => {
                await execute({
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
