import { EditTransactionRow, TransactionRow } from '@components';
import { Table } from '@mantine/core';
import { Transaction, type ITransaction } from '@zero/domain';
import { useRequest } from '@zero/react-api';
import { useEffect, useState } from 'react';

interface TransactionsTableProps {
  transactions: Transaction[];
  accountId: string;
  creatingNewTransaction: boolean;
  onTransactionCreated: () => void;
}

const getDefaultTransaction = (accountId: string) => ({
  date: new Date(),
  accountId,
  payee: '',
  amount: 0,
});

export const TransactionsTable = ({
  transactions,
  creatingNewTransaction,
  onTransactionCreated,
  accountId,
}: TransactionsTableProps) => {
  const [newTransaction, setNewTransaction] = useState<
    Omit<ITransaction, 'id' | 'ownerId'>
  >(getDefaultTransaction(accountId));
  const { execute: createTransaction } = useRequest('CreateTransactionCommand');

  useEffect(() => {
    if (!creatingNewTransaction) {
      setNewTransaction(getDefaultTransaction(accountId));
    }
  }, [creatingNewTransaction, accountId]);

  return (
    <Table
      onKeyDown={async (event) => {
        if (event.key === 'Enter') {
          await createTransaction(newTransaction);
          onTransactionCreated();
        }
      }}
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
          <Table.Th>Category</Table.Th>
          <Table.Th>Amount</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {creatingNewTransaction && (
          <EditTransactionRow
            currentValue={newTransaction}
            onChange={(newValue) => {
              console.log({ newValue });
              setNewTransaction(newValue);
            }}
          />
        )}
        {transactions.map((tx) => {
          return (
            <TransactionRow
              transaction={tx.toObject()}
              key={`${tx.id}-tx-row`}
            />
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
