import { Page } from '@components';
import { useEvent, CurrentUserContext, useRequest } from '@zero/react-api';
import { useContext, useEffect, type ReactNode } from 'react';
import logo from './b6d650e8-988f-42a8-a8dd-4fdc4152a562.png';
import { useNavigate } from 'react-router';

import {
  Button,
  Flex,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Image,
} from '@mantine/core';
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
  const { execute: createUser } = useRequest('CreateUserCommand');

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
      <Flex justify={'center'}>
        <Image src={logo} fit={'contain'} style={{ width: '300px' }} />
      </Flex>
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
