export interface IScopedService<TScopeKey> {
  for(key: TScopeKey): void;
}
