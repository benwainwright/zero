import { CategoriesComboBox } from '@components';
import { Group, Input, NumberInput, Table } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { ITransaction } from '@zero/domain';

interface EditTransactionRowProps {
  currentValue: Omit<ITransaction, 'id' | 'ownerId'>;
  onChange: (value: Omit<ITransaction, 'id' | 'ownerId'>) => void;
}

export const EditTransactionRow = ({
  onChange,
  currentValue,
}: EditTransactionRowProps) => {
  return (
    <Table.Tr>
      <Table.Td>
        <DateInput
          size="sm"
          style={{
            minHeight: '1rem',
            height: '1rem',
            display: 'flex',
            alignItems: 'center',
          }}
          value={currentValue.date}
          onChange={(value) => {
            const date = value ? new Date(value) : currentValue.date;
            console.log({ date });
            onChange({
              ...currentValue,
              date,
            });
          }}
          placeholder="Pick date"
          variant="unstyled"
        />
      </Table.Td>
      <Table.Td>
        <Input
          size="sm"
          variant="unstyled"
          value={currentValue.payee}
          style={{
            minHeight: '1rem',
            height: '1rem',
            display: 'flex',
            alignItems: 'center',
          }}
          placeholder="Enter payee"
          onChange={(value) => {
            onChange({
              ...currentValue,
              payee: value.target.value,
            });
          }}
        ></Input>
      </Table.Td>
      <Table.Td>
        <CategoriesComboBox
          currentValue={currentValue.category}
          onChange={(newValue) => {
            return onChange({
              ...currentValue,
              category: newValue,
            });
          }}
        />
      </Table.Td>
      <Table.Td>
        <Group>
          <NumberInput
            size="sm"
            style={{
              minHeight: '1rem',
              height: '1rem',
              display: 'flex',
              alignItems: 'center',
            }}
            variant="unstyled"
            value={currentValue.amount}
            placeholder="Enter amount"
            prefix="£"
            onChange={(value) => {
              onChange({
                ...currentValue,
                amount: value ? Number(value) : currentValue.amount,
              });
            }}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};
