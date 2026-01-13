import { EditTransactionRow } from '@components';
import type { ITransaction } from '@zero/domain';
import { useCommand } from '@zero/react-api';
import { useState } from 'react';

interface TransactionRowProps {
  transaction: Omit<ITransaction, 'ownerId'>;
}

export const TransactionRow = ({ transaction }: TransactionRowProps) => {
  const [transactionRowValue, setTransactionRowValue] =
    useState<Omit<ITransaction, 'id' | 'ownerId'>>(transaction);
  const { execute: updateTransaction } = useCommand('UpdateTransactionCommand');

  return (
    <EditTransactionRow
      currentValue={transactionRowValue}
      onChange={async (values) => {
        setTransactionRowValue(values);
        await updateTransaction({ ...values, id: transaction.id });
      }}
    />
  );
};
