import { useBankConnection } from '@zero/react-api';
import { Link } from 'react-router';
import { IconLink } from '@tabler/icons-react';
import { IconLinkOff } from '@tabler/icons-react';

export const BankConnectionIcon = () => {
  const connection = useBankConnection();
  return (
    <Link to="/bank-connection" viewTransition>
      {connection.connectionStatus?.status === 'connected' ? (
        <IconLink color="green" />
      ) : (
        <IconLinkOff stroke={1} />
      )}
    </Link>
  );
};
