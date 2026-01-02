import { Page } from '@components';
import { useUser } from '@zero/react-api';
import { useParams } from 'react-router';
import { useForm } from '@mantine/form';
import { Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { type ReactNode, useEffect } from 'react';

interface FormValues {
  email: string;
  password: string;
  validatePassword: string;
}

export const EditUser = (): ReactNode => {
  const { userId } = useParams<{ userId: string }>();
  if (!userId) {
    throw new Error(`User id missing!`);
  }
  const { user, saveUser, isPending } = useUser(userId);

  const form = useForm({
    initialValues: {
      email: user?.email ?? '',
      password: '',
      validatePassword: '',
    } satisfies FormValues,

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      validatePassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  useEffect(() => {
    if (!isPending && user) {
      form.setValues({
        email: user.email,
      });
      form.resetDirty();
    }
  }, [isPending]);

  const onSubmit = async (values: FormValues) => {
    await saveUser({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Page routeName="editUser">
      <form method="post" onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="Username"
          placeholder=""
          key={form.key('username')}
          value={userId}
          disabled
        />

        <TextInput
          label="Email"
          type="email"
          placeholder=""
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          placeholder=""
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <PasswordInput
          label="Verify Password"
          placeholder=""
          key={form.key('validatePassword')}
          {...form.getInputProps('validatePassword')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" disabled={!form.isDirty()}>
            Update
          </Button>
        </Group>
      </form>
    </Page>
  );
};

export default EditUser;
