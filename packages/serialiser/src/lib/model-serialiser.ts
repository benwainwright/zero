import type { DomainModel } from '@zero/domain';
import type { TypeSpecSet } from 'typeson';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type Instanceofable<T> = Function & { prototype: T };

type DomainModelClass<
  TShape,
  TModel extends DomainModel<TShape>
> = Instanceofable<TModel> & {
  readonly key: string;
  reconstitute(shape: TShape): TModel;
};

export const modelSerialiser = <TShape, TModel extends DomainModel<TShape>>(
  theConstructor: DomainModelClass<TShape, TModel>
): TypeSpecSet => {
  return {
    [theConstructor.key]: [
      (thing: unknown) => thing instanceof theConstructor,
      (model: DomainModel<TShape>) => model.toObject(),
      (raw: TShape) => theConstructor.reconstitute(raw),
    ] as const,
  };
};
