import { authModule } from './auth-module.ts';
import { containerWithMockedBootstrapDepsBound } from '@zero/bootstrap';
import { bootstrapInitialUsersAndPermissions } from '@bootstrap';
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
  it('bootstraps initial users and perms', async () => {
    const { container, bootstrapper } = containerWithMockedBootstrapDepsBound();
    await container.load(authModule);

    await container.getAsync('Bootstrapper');

    expect(bootstrapInitialUsersAndPermissions).toHaveBeenCalledWith(
      bootstrapper,
      container
    );
  });

  it('binds services', async () => {
    const { container } = containerWithMockedBootstrapDepsBound();
    await container.load(authModule);

    await container.getAsync('Bootstrapper');

    expect(bindServices).toHaveBeenCalled();
  });
});
