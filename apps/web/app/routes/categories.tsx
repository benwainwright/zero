import {
  CategoriesTable,
  Page,
  Loader,
  CreateNewCategoryModal,
} from '@components';
import { Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCategories } from '@zero/react-api';

export const Categories = () => {
  const categories = useCategories(0, 30);
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Page
      routeName="categories"
      headerActions={
        <Button onClick={open} variant="subtle">
          Create
        </Button>
      }
    >
      <CreateNewCategoryModal opened={opened} close={close} />
      <Loader data={categories}>
        {(data) => {
          if (data.length === 0) {
            return (
              <Text>
                You haven't created any categories yet! Click the button above
                to create one
              </Text>
            );
          }

          return <CategoriesTable categories={data} />;
        }}
      </Loader>
    </Page>
  );
};

export default Categories;
