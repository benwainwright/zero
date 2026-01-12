import { useData } from '@hooks';

export const useCategories = (offset: number, limit: number) => {
  const { data: categories } = useData(
    {
      query: 'ListCategoriesQuery',
      refreshOn: [
        'CategoryCreatedEvent',
        'CategoryDeletedEvent',
        'CategoryUpdatedEvent',
      ],
    },
    {
      offset,
      limit,
    }
  );

  return categories?.categories;
};
