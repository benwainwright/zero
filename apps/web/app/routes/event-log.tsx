import { EventLogPanel, Page } from '@components';
import { Button } from '@mantine/core';
import { EventsLogContext } from '@zero/react-api';
import { useContext } from 'react';

export const HttpRequests = () => {
  const { events, clear } = useContext(EventsLogContext);
  return (
    <Page
      routeName="eventLog"
      title="Event Log"
      headerActions={
        <Button
          onClick={() => {
            clear?.();
          }}
          variant="subtle"
        >
          Clear
        </Button>
      }
    >
      <EventLogPanel events={events} />
    </Page>
  );
};

export default HttpRequests;
