export { User, type IUser } from '@user';

export {
  type IBankConnection,
  BankConnection,
  type IBankConnectionEvents,
  bankConnectionSchema,
} from '@bank-connection';

export {
  type IActor,
  type IDomainEvents,
  type IEvent,
  DomainModel,
} from '@core';

export {
  type IPermission,
  type ICapability,
  permissionSchema,
} from '@permission';

export { Role, type IRole, roleSchema, type IRoute, routes } from '@role';
