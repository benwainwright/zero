import { Page } from '@components';
import { useRoles, useUser } from '@zero/react-api';
import { useParams } from 'react-router';
import { useForm } from '@mantine/form';
import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { type ReactNode, useEffect } from 'react';
import React from 'react';

interface FormValues {
  email: string;
  password: string;
  roles: string[];
  validatePassword: string;
}

export const EditUser = (): ReactNode => {
  const { userId } = useParams<{ userId: string }>();
  if (!userId) {
    throw new Error(`User id missing!`);
  }
  const { user, saveUser, isPending, updateUser } = useUser(userId);
  const roles = useRoles(0, 30);

  const form = useForm({
    initialValues: {
      email: user?.email ?? '',
      password: '',
      roles: user?.roles ?? [],
      validatePassword: '',
    } satisfies FormValues,

    onValuesChange: (values) => {
      updateUser({ username: userId, ...values });
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      validatePassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  useEffect(() => {
    if (!isPending && user && form) {
      form.setValues({
        email: user.email,
        roles: user.roles,
      });
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, JSON.stringify(user)]);

  const onSubmit = async () => {
    await saveUser();
  };

  return (
    <Page routeName="editUser" title="Edit User">
      <form method="post" onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            size="lg"
            label="Username"
            placeholder=""
            key={form.key('username')}
            value={userId}
            disabled
          />

          <TextInput
            label="Email"
            size="lg"
            type="email"
            placeholder=""
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <PasswordInput
            size="lg"
            label="Password"
            placeholder=""
            key={form.key('password')}
            {...form.getInputProps('password')}
          />

          <PasswordInput
            size="lg"
            label="Verify Password"
            placeholder=""
            key={form.key('validatePassword')}
            {...form.getInputProps('validatePassword')}
          />

          <Fieldset legend="Roles" mt="lg">
            <Stack>
              {roles &&
                roles?.map((role) => {
                  console.log(form.getValues());
                  return (
                    <Checkbox
                      size="lg"
                      checked={
                        form.getValues()?.roles?.includes(role.id) ?? false
                      }
                      onChange={(checked) => {
                        form.setValues((previous) => {
                          if (previous.roles) {
                            if (checked.target.checked) {
                              return {
                                ...previous,
                                roles: previous.roles.includes(role.id)
                                  ? previous.roles
                                  : [...previous.roles, role.id],
                              };
                            }
                            return {
                              ...previous,
                              roles: previous.roles.filter(
                                (theRole) => theRole !== role.id
                              ),
                            };
                          }
                          return previous;
                        });
                      }}
                      key={`role-checkbox-${role.id}`}
                      label={role.name}
                    ></Checkbox>
                  );
                })}
            </Stack>
          </Fieldset>
        </Stack>

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
