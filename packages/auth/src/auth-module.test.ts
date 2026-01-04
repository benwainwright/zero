import { authModule } from './auth-module.ts';
import { containerWithMockedBootstrapDepsBound } from '@zero/bootstrap';
import { bindServices } from '@services';

vi.mock('@bootstrap');

vi.mock('@services', async (original) => {
  return {
    ...(await original()),
    bindServices: vi.fn(),
  };
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('the auth module', () => {
  it('binds services', async () => {
    const { bootstrapper } = containerWithMockedBootstrapDepsBound();
    await container.load(authModule);

    await container.getAsync('Bootstrapper');

    expect(bindServices).toHaveBeenCalled();
  });
});
