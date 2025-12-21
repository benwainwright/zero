import type { BankConnection } from './bank-connection.ts';

export interface IBankConnectionEvents {
  BankConnectionCreated: BankConnection;
  BankConnectionRequisitionSaved: { old: BankConnection; new: BankConnection };
  BankAccountIdsSaved: { old: BankConnection; new: BankConnection };
  BankConnectionRefreshed: { old: BankConnection; new: BankConnection };
  BankConnectionDeleted: BankConnection;
}
