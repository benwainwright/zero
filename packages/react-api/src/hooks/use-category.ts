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
      command: 'UpdateCategoryCommand',
      refreshOn: ['CategoryUpdatedEvent'],
    },
    {
      category: id,
    }
  );

  return { category, isPending, updateCategory: update, saveCategory: save };
};
