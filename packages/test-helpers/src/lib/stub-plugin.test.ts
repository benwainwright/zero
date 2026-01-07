import { Container, injectable } from 'inversify';
import { StubPlugin } from './stub-plugin.ts';

describe('stub plugin', () => {
  it('returns a mock when the thing isnt bound', () => {
    const container = new Container();
    container.register(StubPlugin);

    console.log('START');
    const result = container.get<{ _isMockObject: boolean }>('Thing');
    expect(result._isMockObject).toBeTruthy();
    console.log('END');
  });

  it('returns a real object when the thing is bound', () => {
    const container = new Container();
    container.register(StubPlugin);

    @injectable()
    class Thing {}

    container.bind('Thing').to(Thing);

    const result = container.get<Thing>('Thing');
    expect(result).toBeInstanceOf(Thing);
  });
});
