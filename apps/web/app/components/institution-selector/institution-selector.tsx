import { InstitutionCard } from '@components';
import { Text, SimpleGrid, TextInput, Stack } from '@mantine/core';
import { useFilteredInstitutions } from './use-filtered-institutions.ts';
import type { IPossbileInstitution } from '@zero/accounts';

interface InstitutionSelectorProps {
  institutions: IPossbileInstitution[];
  onSelectInstitution: (connection: IPossbileInstitution) => void;
}

const sandbox =
  process.env['NODE_ENV'] !== 'production'
    ? [
        {
          bankName: 'Gocardless Sandbox Institution',
          id: 'SANDBOXFINANCE_SFIN0000',
          logo: 'https://cdn-logos.gocardless.com/ais/SANDBOXFINANCE_SFIN0000.png',
        },
      ]
    : [];

export const InstitutionSelector = ({
  institutions,
  onSelectInstitution,
}: InstitutionSelectorProps) => {
  const { filteredInstitutions, setFilter } = useFilteredInstitutions([
    ...institutions,
    ...sandbox,
  ]);

  return (
    <Stack>
      <Text>
        Find your bank in the list below and click on it to be redirected to
        your bank.
      </Text>
      <TextInput
        placeholder="Enter the name of your bank to filter"
        size="lg"
        onChange={(event) => {
          setFilter(event.target.value);
        }}
      />
      <SimpleGrid cols={3}>
        {filteredInstitutions.map((institution) => (
          <InstitutionCard
            onClick={onSelectInstitution}
            key={`institution-card-${institution.id}`}
            institution={institution}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};
