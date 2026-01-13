import { Table, Text } from '@mantine/core';
import type { Category } from '@zero/domain';
import { Link } from 'react-router';

interface CategoriesTableProps {
  categories: Category[];
}
export const CategoriesTable = ({ categories }: CategoriesTableProps) => {
  return (
    <Table verticalSpacing={'lg'}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {categories.map((category) => (
          <Table.Tr key={`${category.id}-category-row`}>
            <Table.Td>
              <Link viewTransition to={`/categories/${category.id}/edit`}>
                {category.name ? category.name : 'No name'}
              </Link>
            </Table.Td>
            <Table.Td>
              {category.description ? category.description : <Text>None</Text>}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
