import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRequest } from '@zero/react-api';

interface ICreateNewCategoryModal {
  opened: boolean;
  close: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

export const CreateNewCategoryModal = ({
  close,
  opened,
}: ICreateNewCategoryModal) => {
  const { execute: createCategory } = useRequest('CreateCategoryCommand');

  const create = async () => {
    await createCategory(form.values);
    close();
  };

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    } satisfies FormValues,
  });

  return (
    <Modal opened={opened} onClose={close} title="Create Category" p="xl">
      <form method="post" onSubmit={form.onSubmit(create)}>
        <Stack gap="lg" my="lg" mx="lg">
          <TextInput
            label="Category Name"
            size="lg"
            placeholder=""
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Description"
            size="lg"
            placeholder=""
            key={form.key('description')}
            {...form.getInputProps('description')}
          />
          <Group mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
