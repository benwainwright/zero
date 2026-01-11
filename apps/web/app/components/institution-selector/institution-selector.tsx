import { InstitutionCard } from '@components';
import { Text, SimpleGrid, TextInput, Stack } from '@mantine/core';
import type { BankConnection } from '@zero/domain';
import { useFilteredInstitutions } from './use-filtered-institutions.ts';

interface InstitutionSelectorProps {
  institutions: BankConnection[];
  onSelectInstitution: (connection: BankConnection) => void;
}

export const InstitutionSelector = ({
  institutions,
  onSelectInstitution,
}: InstitutionSelectorProps) => {
  const { filteredInstitutions, setFilter } =
    useFilteredInstitutions(institutions);

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
