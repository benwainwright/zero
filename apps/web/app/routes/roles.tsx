import { Loader, Page, RolesTable } from '@components';
import { useRoles } from '@zero/react-api';

export const Roles = () => {
  const roles = useRoles(0, 30);
  return (
    <Page routeName="roles">
      <Loader data={roles}>{(data) => <RolesTable roles={data} />}</Loader>
    </Page>
  );
};

export default Roles;
