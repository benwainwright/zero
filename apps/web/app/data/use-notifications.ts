import { showNotification } from './show-notification.tsx';
import { useEvents } from '@zero/react-api';

export const useNotifications = () => {
  useEvents((event) => {
    switch (event.key) {
      case 'ApplicationError':
        showNotification({
          type: 'error',
          message: event.data.message,
        });
        break;

      case 'BankConnectionDeleted':
        showNotification({
          type: 'success',
          message: 'Bank connection disconnected',
        });
        break;

      case 'AccountDeleted':
        showNotification({
          type: 'success',
          message: 'Account deleted',
        });
        break;

      case 'LoginSuccessfulEvent':
        showNotification({
          type: 'success',
          message: 'Login Successful',
        });
        break;

      case 'LoginFailedEvent':
        showNotification({
          type: 'error',
          message: 'Login Failed',
        });
        break;

      case 'AccountCreated':
        showNotification({
          type: 'success',
          message: 'Account Created',
        });
        break;

      case 'LogoutSuccessfulEvent':
        showNotification({
          type: 'success',
          message: 'Logout Successful',
        });
        break;

      case 'TransactionCreated':
        showNotification({
          type: 'success',
          message: 'Transaction Created!',
        });
        break;

      case 'UserUpdated':
        showNotification({
          type: 'success',
          message: 'User was updated',
        });
        break;

      case 'UserCreated':
        showNotification({
          type: 'success',
          message: 'User Registration Successful',
        });
        break;
    }
  });
};
