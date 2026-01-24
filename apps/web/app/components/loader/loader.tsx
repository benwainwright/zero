import type { ReactNode } from 'react';
import { Flex, Loader as MantineLoader } from '@mantine/core';

interface LoaderProps<TData> {
  data: TData | undefined;
  children: (data: TData) => ReactNode;
}

export const Loader = <TData,>({
  data,
  children,
}: LoaderProps<TData>): ReactNode => {
  if (data === undefined) {
    return (
      <Flex justify={'center'} align={'center'}>
        <MantineLoader />
      </Flex>
    );
  }

  return children(data);
};
