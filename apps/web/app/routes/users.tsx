import { Loader, Page, UsersTable } from '@components';
import { useUsers } from '@zero/react-api';
import type { ReactNode } from 'react';

export const Users = (): ReactNode => {
  const users = useUsers(0, 30);
  return (
    <Page routeName="users">
      <Loader data={users}>{(data) => <UsersTable users={data} />}</Loader>
    </Page>
  );
};

export default Users;
