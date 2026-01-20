import { ConnectionStatusOptions, Loader, Page } from '@components';
import { Stack } from '@mantine/core';
import { useBankConnection } from '@zero/react-api';

export const BankConnection = () => {
  const { authorise, disconnect, connectionStatus } = useBankConnection();

  return (
    <Page routeName="bankConnection" title="Bank Integration">
      <Loader data={connectionStatus}>
        {(loadedConnection) => (
          <Stack align="start">
            <ConnectionStatusOptions
              onDisconnect={() => disconnect()}
              status={loadedConnection}
              onSelectBank={async (institution) => {
                await authorise(institution);
              }}
            />
          </Stack>
        )}
      </Loader>
    </Page>
  );
};

export default BankConnection;
