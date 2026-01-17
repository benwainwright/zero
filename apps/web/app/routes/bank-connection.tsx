import { ConnectionStatusOptions, Page } from '@components';
import { Stack } from '@mantine/core';
import { useBankConnection } from '@zero/react-api';

export const BankConnection = () => {
  const connection = useBankConnection();

  const { authorise } = connection;

  return (
    <Page routeName="bankConnection" title="Bank Integration">
      {connection && connection.connectionStatus && (
        <Stack align="start">
          <ConnectionStatusOptions
            status={connection.connectionStatus}
            onSelectBank={async (institution) => {
              await authorise(institution);
            }}
          />
        </Stack>
      )}
    </Page>
  );
};

export default BankConnection;
