import { Page } from '@components';
import { Flex, Typography, Image } from '@mantine/core';
import type { ReactNode } from 'react';
import logo from './b6d650e8-988f-42a8-a8dd-4fdc4152a562.png';

const Home = (): ReactNode => {
  return (
    <Page routeName="home">
      <Flex justify={'center'}>
        <Image src={logo} fit={'contain'} style={{ width: '300px' }} />
      </Flex>
    </Page>
  );
};

export default Home;
