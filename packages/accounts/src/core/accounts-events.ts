export interface AccountsEvents {
  InstitutionListFetchedEvent: undefined;
  SyncAccountStarted: { accountId: string };
  SyncAccountFinished: { accountId: string };
}
