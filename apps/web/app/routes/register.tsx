import { Page } from '@components';
import { useEvent, CurrentUserContext, useCommand } from '@zero/react-api';
import { useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { Button, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface FormValues {
  username: string;
  email: string;
  password: string;
  validatePassword: string;
}

export const Register = (): ReactNode => {
  const navigate = useNavigate();
  const { user, reload } = useContext(CurrentUserContext);
  const { execute: createUser } = useCommand('CreateUserCommand');

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
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
    void (async () => {
      if (user) {
        await navigate('/');
      }
    })();
  }, [user, navigate]);

  useEvent('UserCreated', () => {
    reload?.();
  });

  return (
    <Page routeName="register">
      <form method="post" onSubmit={form.onSubmit(createUser)}>
        <Stack>
          <TextInput
            label="Username"
            placeholder=""
            key={form.key('username')}
            {...form.getInputProps('username')}
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

          <Group mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>
    </Page>
  );
};

export default Register;
