import { useData } from '@hooks';

export const useCategory = (id: string) => {
  const {
    data: category,
    isPending,
    update,
    save,
  } = useData(
    {
      query: 'GetCategoryQuery',
      updaterKey: 'UpdateCategoryCommand',
      refreshOn: ['CategoryUpdatedEvent'],
      mapToLocalData: (category) => ({
        id: category.id,
        name: category.name,
        description: category.description ?? '',
      }),
    },
    {
      category: id,
    }
  );

  return { category, isPending, updateCategory: update, saveCategory: save };
};
