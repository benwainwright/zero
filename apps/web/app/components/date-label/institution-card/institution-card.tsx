import { Text, Card, Group, Image } from '@mantine/core';
import type { BankConnection } from '@zero/domain';

interface InstitutionCardProps {
  institution: BankConnection;
  onClick: (institition: BankConnection) => void;
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
        <Image src={institution.logo} height={60} alt={institution.bankName} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{institution.bankName}</Text>
      </Group>
    </Card>
  );
};
