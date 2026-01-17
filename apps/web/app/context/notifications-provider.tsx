import { createContext, useCallback, type ReactNode } from 'react';
import type { NotificationData } from './notification.ts';
import { useState } from 'react';

interface NotificationContextPropsData {
  notificationQueue: NotificationData[];
  showNotification?: (notification: NotificationData) => void;
  closeNotification?: (notification: NotificationData) => void;
}

export const NotificationsContext = createContext<NotificationContextPropsData>(
  { notificationQueue: [] }
);

interface NotificationProviderProps {
  children: ReactNode;
  timeout: number;
}

export const NotificationProvider = ({
  children,
  timeout,
}: NotificationProviderProps) => {
  const [queue, setQueue] = useState<NotificationData[]>([]);

  const closeNotification = (data: NotificationData) => {
    setQueue((queue) => queue.filter((item) => item !== data));
  };

  const showNotification = useCallback(
    (data: NotificationData) => {
      setQueue((queue) => [...queue, data]);
      setTimeout(() => closeNotification(data), timeout);
    },
    [setQueue, timeout]
  );

  return (
    <NotificationsContext
      value={{
        notificationQueue: queue,
        closeNotification,
        showNotification,
      }}
    >
      {children}
    </NotificationsContext>
  );
};
