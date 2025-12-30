import { Page } from '@components';
import { useEvent, CurrentUserContext, ApiContext } from '@data';
// import { command, useEvent } from "@data";
import { useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

export const Logout = (): ReactNode => {
  const navigate = useNavigate();
  const { user, reload } = useContext(CurrentUserContext);
  const { api } = useContext(ApiContext);

  useEffect(() => {
    void (async () => {
      if (user && api) {
        await api.executeCommand({
          key: 'LogoutCommand',
          params: undefined,
        });
      } else {
        await navigate('/login');
      }
    })();
  }, [user, api]);

  useEvent('LogoutSuccessfulEvent', () => {
    reload?.();
  });

  return (
    <Page routeName="logout">
      <p>Logging out...</p>
    </Page>
  );
};

export default Logout;
