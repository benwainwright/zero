module '@database-adapters' {
  const databaseAdaptersModule: import('@zero/bootstrap').IModule<
    import('@zero/bootstrap').BindingMap
  >;
}

module '@storage-adapter' {
  const storageAdapterModule: import('@zero/bootstrap').IModule<
    import('@zero/bootstrap').BindingMap
  >;
}
