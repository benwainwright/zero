import { useCallback, useContext } from 'react';
import { NotificationsContext } from './notifications-provider.tsx';
import type { NotificationData } from './notification.ts';

export const useNotifications = () => {
  const { showNotification, notificationQueue } =
    useContext(NotificationsContext);

  const finalShowNotification = useCallback(
    (data: NotificationData) => {
      showNotification?.(data);
    },
    [showNotification]
  );

  return { showNotification: finalShowNotification, notificationQueue };
};
