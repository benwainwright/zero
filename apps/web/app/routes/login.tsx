import { Page } from '@components';
import { CurrentUserContext, useCommand, useEvent } from '@zero/react-api';
import {
  Button,
  Group,
  PasswordInput,
  TextInput,
  Text,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useContext, useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';

interface FormValues {
  username: string;
  password: string;
}

export const Login = (): ReactNode => {
  const { user, reload } = useContext(CurrentUserContext);
  const { execute: login } = useCommand('LoginCommand');

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    } satisfies FormValues,
  });

  useEffect(() => {
    void (async () => {
      if (user) {
        await navigate('/');
      }
    })();
  }, [user]);

  const onSubmit = async (values: FormValues) => {
    await login({
      username: values.username,
      password: values.password,
    });
  };

  useEvent('LoginSuccessfulEvent', () => {
    reload?.();
  });

  return (
    <Page routeName="login">
      <form method="post" onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="Username"
          placeholder=""
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label="Password"
          placeholder=""
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <Group mt="md" mb="md">
          <Button type="submit">Login</Button>
        </Group>
        <Text>
          Or you can{' '}
          <Anchor to="/register" component={Link}>
            register
          </Anchor>{' '}
          a new account...
        </Text>
      </form>
    </Page>
  );
};

export default Login;
