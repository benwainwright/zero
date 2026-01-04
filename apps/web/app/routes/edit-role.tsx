import { Page, Permission } from '@components';
import {
  Card,
  Chip,
  Fieldset,
  Group,
  Stack,
  TextInput,
  Text,
  SimpleGrid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { IRole } from '@zero/domain';
import { useRole } from '@zero/react-api';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { routes } from '@zero/domain';

export const EditRole = () => {
  const { roleId } = useParams<{ roleId: string }>();
  if (!roleId) {
    throw new Error(`User id missing!`);
  }

  const { role, updateRole, isPending, saveRole } = useRole(roleId);

  const form = useForm<IRole>({
    onValuesChange: (values) => {
      updateRole(values);
    },
  });

  useEffect(() => {
    if (!isPending && role) {
      form.setValues(role);
      form.resetDirty();
    }
  }, [isPending]);

  const onSubmit = async () => {
    await saveRole();
  };

  return (
    <Page routeName="editRole" title="Edit Role">
      <form method="post" onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="Name"
          placeholder=""
          key={form.key('name')}
          {...form.getInputProps('name')}
        />

        <Fieldset legend="Permissions" mt="lg">
          <Stack>
            {role?.permissions.map((perm) => (
              <Permission
                permission={perm}
                key={`role-perm-${JSON.stringify(perm)}`}
              />
            ))}
          </Stack>
        </Fieldset>

        <Fieldset mt="md" legend="Visible Routes" pt="md">
          <Group>
            {routes.map((route) => (
              <Chip
                checked={form.values.routes?.includes(route)}
                onChange={(checked) => {
                  form.setValues((previous) => {
                    if (checked && !previous.routes?.includes(route)) {
                      return {
                        ...previous,
                        routes: [...(previous.routes ?? []), route],
                      };
                    } else if (!checked) {
                      return {
                        ...previous,
                        routes:
                          previous.routes?.filter(
                            (theRoute) => theRoute !== route
                          ) ?? [],
                      };
                    }

                    return previous;
                  });
                }}
              >
                {route}
              </Chip>
            ))}
          </Group>
        </Fieldset>
      </form>
    </Page>
  );
};
export default EditRole;
