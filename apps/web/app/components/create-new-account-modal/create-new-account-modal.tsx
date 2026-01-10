import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ApiContext } from '@zero/react-api';
import { useContext } from 'react';

interface ICreateNewAccountModal {
  opened: boolean;
  close: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

export const CreateNewAccountModal = ({
  close,
  opened,
}: ICreateNewAccountModal) => {
  const { api } = useContext(ApiContext);

  const create = async () => {
    await api?.executeCommand('CreateAccountCommand', form.values);
    close();
  };

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    } satisfies FormValues,
  });

  return (
    <Modal opened={opened} onClose={close} title="Create Account">
      <form method="post" onSubmit={form.onSubmit(create)}>
        <TextInput
          label="Account Name"
          placeholder=""
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Description"
          placeholder=""
          key={form.key('description')}
          {...form.getInputProps('description')}
        />
        <Group mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </Modal>
  );
};
