import { Text, Card, Group, Image } from '@mantine/core';
import type { IPossbileInstitution } from '@zero/accounts';

interface InstitutionCardProps {
  institution: IPossbileInstitution;
  onClick: (institition: IPossbileInstitution) => void;
}

export const InstitutionCard = ({
  institution,
  onClick,
}: InstitutionCardProps) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={() => onClick(institution)}
      style={{ cursor: 'pointer' }}
    >
      <Card.Section m="lg">
        <Image src={institution.logo} height={170} alt={institution.bankName} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{institution.bankName}</Text>
      </Group>
    </Card>
  );
};
