import { CategoriesTable, Page } from '@components';
import { Loader } from '@mantine/core';
import { useCategories } from '@zero/react-api';

export const Categories = () => {
  const categories = useCategories(0, 30);
  return (
    <Page routeName="roles">
      <Loader data={categories}>
        {(data) => <CategoriesTable categories={data} />}
      </Loader>
    </Page>
  );
};

export default Categories;
