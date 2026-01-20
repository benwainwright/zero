import { BankConnectedCard, InstitutionSelector } from '@components';
import type { AccountsCommands, IPossbileInstitution } from '@zero/accounts';
import { Text } from '@mantine/core';
import type { IPickRequest } from '@zero/application-core';

interface ConnectionStatusOptionsProps {
  status: IPickRequest<
    AccountsCommands,
    'CheckBankConnectionStatusCommand'
  >['response'];
  onSelectBank: (possibleInstitution: IPossbileInstitution) => void;
  onDisconnect: () => void;
}

export const ConnectionStatusOptions = ({
  onSelectBank,
  onDisconnect,
  status,
}: ConnectionStatusOptionsProps) => {
  switch (status.status) {
    case 'not_connected':
      return (
        <InstitutionSelector
          institutions={status.banks}
          onSelectInstitution={onSelectBank}
        />
      );

    case 'authorizing':
      return <Text>Redirecting you to your bank...</Text>;

    case 'connected':
      return <BankConnectedCard {...status} onDisconnect={onDisconnect} />;

    case 'expired':
      return <Text>Your connection has expired</Text>;

    default:
      return (
        <Text>
          Your bank rejected your connection for some reason. You&apos;ll need
          to get in touch with them to understand why...
        </Text>
      );
  }
};
