import type { Account } from './account.ts';

export interface IAccountEvents {
  AccountCreated: Account;
  AccountDeleted: Account;
  AccountBalanceUpdated: { old: Account; new: Account };
  AccountLinked: { old: Account; new: Account };
  AccountLinkRemoved: { old: Account; new: Account };
}
