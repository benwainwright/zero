import { useEvent } from '@hooks';

export const useLogErrors = () => {
  useEvent('ApplicationError', (data) => {
    console.table(data.stack);
  });
};
