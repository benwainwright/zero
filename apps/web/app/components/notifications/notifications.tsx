import { ErrorNotification, Notification } from '@components';
import { useNotifications } from '@context';
import { Affix } from '@mantine/core';

export const Notifications = () => {
  const { notificationQueue, closeNotification } = useNotifications();

  return (
    <Affix position={{ top: 20, left: 20 }}>
      {notificationQueue.map((notification) => {
        const { type } = notification;

        if (type !== 'error') {
          return (
            <Notification
              type={type}
              message={notification.message}
              onClose={() => closeNotification(notification)}
            />
          );
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
