import { Notification as MantineNotification } from '@mantine/core';
import { IconX, IconCheck, IconInfoCircleFilled } from '@tabler/icons-react';

interface NotificationProps {
  type: 'success' | 'failure' | 'info';
  message: string;
  onClose: () => void;
}

const getNotificationProps = (type: 'success' | 'failure' | 'info') => {
  switch (type) {
    case 'failure':
      return {
        title: 'Error',
        color: 'red',
        icon: <IconX />,
      };
    case 'info':
      return {
        color: 'blue',
        icon: <IconInfoCircleFilled />,
      };

    default:
      return {
        title: 'Success',
        color: 'green',
        icon: <IconCheck />,
      };
  }
};

export const Notification = ({ type, message, onClose }: NotificationProps) => {
  return (
    <MantineNotification {...getNotificationProps(type)} onClose={onClose}>
      {message}
    </MantineNotification>
  );
};
