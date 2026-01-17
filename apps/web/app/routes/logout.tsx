import { Page } from '@components';
import {
  useEvent,
  CurrentUserContext,
  ApiContext,
  useRequest,
} from '@zero/react-api';
import { useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

export const Logout = (): ReactNode => {
  const navigate = useNavigate();
  const { user, reload } = useContext(CurrentUserContext);
  const { execute: logout } = useRequest('LogoutCommand');
  const { api } = useContext(ApiContext);

  useEffect(() => {
    void (async () => {
      if (user && api) {
        await logout();
      } else {
        await navigate('/login');
      }
    })();
  }, [user, api, navigate, logout]);

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
