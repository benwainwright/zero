import { Page } from '@components';
import { Typography } from '@mantine/core';
import type { ReactNode } from 'react';

const Home = (): ReactNode => {
  return (
    <Page routeName="home">
      <Typography>
        <p>
          Welcome to Zero - to get started, head over to the integrations page
        </p>
      </Typography>
    </Page>
  );
};

export default Home;
