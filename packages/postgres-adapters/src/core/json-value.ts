import { type Expression, type OperationNode, sql } from 'kysely';

class JsonValue<T> implements Expression<T> {
  #value: T;
  constructor(value: T) {
    this.#value = value;
  }

  get expressionType(): T | undefined {
    return undefined;
  }

  toOperationNode(): OperationNode {
    const json = JSON.stringify(this.#value);
    return sql`CAST(${json} AS JSONB)`.toOperationNode();
  }
}
//ValueExpression<DB, "roles", string | number | boolean | JsonArray | JsonObject | null | undefined>

export const json = <T>(value: T) => new JsonValue(value);
