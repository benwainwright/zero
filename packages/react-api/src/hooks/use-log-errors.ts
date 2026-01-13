import { useEvent } from '@hooks';

export const useLogErrors = () => {
  useEvent('ApplicationError', (data) => {
    console.table(data.parsedStack);
  });

  useEvent('HttpError', (data) => {
    console.table(data.parsedStack);
  });
};
