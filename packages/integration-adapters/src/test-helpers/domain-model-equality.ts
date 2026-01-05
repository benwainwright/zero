import { expect } from 'vitest';

import { DomainModel } from '@zero/domain';

type EqualityTester = Parameters<typeof expect.addEqualityTesters>[0][number];

function isDomainModel(value: unknown): value is DomainModel<unknown> {
  return value instanceof DomainModel;
}

function stripEvents<T extends DomainModel<unknown>>(
  model: T
): Record<string, unknown> {
  const source = model as unknown as Record<string, unknown>;
  const clone: Record<string, unknown> = {};

  for (const key of Object.keys(source)) {
    if (key === 'events') continue;
    clone[key] = source[key];
  }

  return clone;
}

export const domainModelEquality: EqualityTester = function (a, b) {
  const aIs = isDomainModel(a);
  const bIs = isDomainModel(b);

  if (!aIs && !bIs) return undefined;
  if (aIs !== bIs) return false;

  const aa = stripEvents(a);
  const bb = stripEvents(b);

  const ctx = this as { equals?: (x: unknown, y: unknown) => boolean };

  if (typeof ctx.equals === 'function') {
    return ctx.equals(aa, bb);
  }

  return JSON.stringify(aa) === JSON.stringify(bb);
};
