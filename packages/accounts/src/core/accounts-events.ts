export interface AccountsEvents {
  InstitutionListFetchedEvent: undefined;
  BankIntegrationDisconnected: undefined;
  SyncAccountStarted: { accountId: string };
  SyncAccountFinished: { accountId: string };
}
