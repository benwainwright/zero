import {
  Button,
  FocusTrap,
  Group,
  Input,
  NumberInput,
  Table,
} from '@mantine/core';
import { DateInput, DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

interface RawTx {
  payee: string;
  date: Date;
  amount: string;
}

interface NewTransactionRowProps {
  open: boolean;
  form: ReturnType<typeof useForm<RawTx>>;
}

export const NewTransactionRow = ({ open, form }: NewTransactionRowProps) => {
  return (
    open && (
      <FocusTrap active={open}>
        <Table.Tr>
          <Table.Td>
            <DateInput
              style={{
                minHeight: '1rem',
                height: '1rem',
                display: 'flex',
                alignItems: 'center',
              }}
              placeholder="Pick date"
              variant="unstyled"
              {...form.getInputProps('date')}
            />
          </Table.Td>
          <Table.Td>
            <Input
              variant="unstyled"
              style={{
                minHeight: '1rem',
                height: '1rem',
                display: 'flex',
                alignItems: 'center',
              }}
              placeholder="Enter payee"
              {...form.getInputProps('payee')}
            ></Input>
          </Table.Td>
          <Table.Td>
            <Group>
              <NumberInput
                style={{
                  flexGrow: 2,
                  minHeight: '1rem',
                  height: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                styles={{
                  wrapper: {
                    flexGrow: 2,
                  },
                }}
                variant="unstyled"
                placeholder="Enter amount"
                prefix="£"
                {...form.getInputProps('amount')}
              />
              <Button size="compact-sm" type="submit" variant="subtle">
                Save
              </Button>
            </Group>
          </Table.Td>
        </Table.Tr>
      </FocusTrap>
    )
  );
};
