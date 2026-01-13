import { useEvents } from '@zero/react-api';
import { useNotifications } from './use-notifications.ts';

export const useEventNotifications = () => {
  const { showNotification } = useNotifications();
  useEvents((event) => {
    switch (event.key) {
      case 'ApplicationError':
        showNotification({
          type: 'error',
          message: event.data.message ?? '',
          stack: event.data.parsedStack,
        });
        break;

      case 'BankConnectionDeleted':
        showNotification({
          type: 'success',
          message: 'Bank connection disconnected',
        });
        break;

      case 'HttpError':
        showNotification({
          type: 'error',
          message: `There was an error making an HTTP request: [${event.data.statusCode}] - ${event.data.body}`,
          stack: event.data.parsedStack,
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
          type: 'failure',
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
