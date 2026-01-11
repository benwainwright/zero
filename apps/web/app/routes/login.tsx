import { Page } from '@components';
import { CurrentUserContext, useCommand, useEvent } from '@zero/react-api';
import logo from './b6d650e8-988f-42a8-a8dd-4fdc4152a562.png';
import {
  Button,
  Group,
  PasswordInput,
  TextInput,
  Text,
  Image,
  Anchor,
  Stack,
  Flex,
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
  }, [user, navigate]);

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
      <Flex justify={'center'}>
        <Image src={logo} fit={'contain'} style={{ width: '300px' }} />
      </Flex>
      <form method="post" onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
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
        </Stack>
      </form>
    </Page>
  );
};

export default Login;
