import { ErrorNotification, Notification } from '@components';
import { useNotifications } from '@context';
import { Affix } from '@mantine/core';

export const Notifications = () => {
  const { notificationQueue } = useNotifications();

  console.log(notificationQueue);
  return (
    <Affix position={{ top: 20, left: 20 }}>
      {notificationQueue.map((notification) => {
        const { type } = notification;

        if (type !== 'error') {
          return <Notification type={type} message={notification.message} />;
        }
        return (
          <ErrorNotification
            message={notification.message}
            stack={notification.stack}
          />
        );
      })}
    </Affix>
  );
};
