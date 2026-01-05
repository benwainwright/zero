import { thing } from './the-thing.ts';
describe('the thing', () => {
  it('returns true', () => {
    const result = thing();
    expect(result).toBeTruthy();
  });
});
