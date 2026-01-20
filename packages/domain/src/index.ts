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
  type ISyncDetails,
  syncDetailsSchema,
  type SyncDetailsEvents,
  SyncDetails,
} from '@sync-details';

export {
  type IPermission,
  type ICapability,
  permissionSchema,
} from '@permission';

export { Account, type IAccount, accountSchema } from '@account';

export {
  Role,
  type IRole,
  roleSchema,
  type IRoute,
  routes,
  routesSchema,
} from '@role';

export {
  Transaction,
  type ITransaction,
  transactionSchema,
  openBankingTransactionSchema,
  currencySchema,
  type IOpenBankingTransaction,
  type ICurrency,
} from '@transaction';

export { OauthToken, type IOauthToken, oAuthTokenSchema } from '@oauth-token';

export { Budget, budgetSchema, type IBudget } from '@budget';

export {
  Category,
  type ICategory,
  categorySchema,
  type CategoryEvents,
} from '@category';
