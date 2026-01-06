import type { MigrationResultSet } from 'kysely';

export const logResults = (result: MigrationResultSet) => {
  if (result.error) {
    console.log(result.error);
  }

  result.results?.forEach((result) =>
    console.log(
      `${result.migrationName} [${result.direction}] - ${result.status}`
    )
  );
};
