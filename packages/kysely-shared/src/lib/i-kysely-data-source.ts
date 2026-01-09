import { Kysely } from 'kysely';
export interface IKyselyDataSource<DB> {
  get(): Promise<Kysely<DB>>;
  close(): Promise<void>;
}
