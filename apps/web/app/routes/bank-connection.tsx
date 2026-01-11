import { BankConnectedCard, InstitutionSelector, Page } from '@components';
import { Stack } from '@mantine/core';
import { useBankConnection } from '@zero/react-api';

export const BankConnection = () => {
  const connection = useBankConnection();
  console.log(connection);
  const { loaded } = connection;

  return (
    <Page routeName="bankConnection" title="Bank Integration">
      {loaded && (
        <Stack align="start">
          {connection.isConnected ? (
            <BankConnectedCard details={connection.details} />
          ) : (
            <InstitutionSelector
              institutions={connection.institutionList}
              onSelectInstitution={async (institution) => {
                const { createConnection } = connection;
                await createConnection(institution);
              }}
            />
          )}
        </Stack>
      )}
    </Page>
  );
};

export default BankConnection;
