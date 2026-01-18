export interface IPresenceRepository {
  exists(id: string): Promise<boolean>;
  existsAll(id: string[]): Promise<{ id: string; exists: boolean }[]>;
}
