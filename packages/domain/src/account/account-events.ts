import type { Account } from './account.ts';

export interface IAccountEvents {
  AccountCreated: Account;
  AccountDeleted: Account;
  AccountClosed: Account;
  AccountUpdated: { old: Account; new: Account };
  AccountBalanceUpdated: { old: Account; new: Account };
  AccountLinked: { old: Account; new: Account };
  AccountLinkRemoved: { old: Account; new: Account };
}
