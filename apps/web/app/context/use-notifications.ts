import { useCallback, useContext } from 'react';
import { NotificationsContext } from './notifications-provider.tsx';
import type { NotificationData } from './notification.ts';

export const useNotifications = () => {
  const { showNotification, notificationQueue, closeNotification } =
    useContext(NotificationsContext);

  const finalShowNotification = useCallback(
    (data: NotificationData) => {
      showNotification?.(data);
    },
    [showNotification]
  );

  const finalCloseNotification = useCallback(
    (data: NotificationData) => {
      closeNotification?.(data);
    },
    [closeNotification]
  );

  return {
    showNotification: finalShowNotification,
    notificationQueue,
    closeNotification: finalCloseNotification,
  };
};
