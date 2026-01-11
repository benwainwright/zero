import { Currency, DateLabel, NewTransactionRow } from '@components';
import { Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Transaction } from '@zero/domain';
import { useCommand } from '@zero/react-api';

interface TransactionsTableProps {
  transactions: Transaction[];
  accountId: string;
  creatingNewTransaction: boolean;
  onTransactionCreated: () => void;
}

export const TransactionsTable = ({
  transactions,
  creatingNewTransaction,
  onTransactionCreated,
  accountId,
}: TransactionsTableProps) => {
  const { execute: createTrnsaction } = useCommand('CreateTransactionCommand');

  const form = useForm({
    initialValues: {
      payee: '',
      date: new Date(),
      amount: '',
    },
  });

  return (
    <form
      method="post"
      onSubmit={form.onSubmit(async (values) => {
        await createTrnsaction({
          accountId,
          ...values,
          amount: Number(values.amount) * 1000,
        });
        onTransactionCreated();
      })}
    >
      <Table
        layout="fixed"
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
          <NewTransactionRow open={creatingNewTransaction} form={form} />
          {transactions.map((tx) => {
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
};
