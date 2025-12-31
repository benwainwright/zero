import { AuthorisationError } from './authorisation-error.ts';
import { DomainModel } from '@zero/domain';
import { GrantService } from './grant-service.ts';
import { AuthError } from './auth-error.ts';

describe('grant', () => {
  describe('done', () => {
    it('throws an auth error if no permissions have been set', () => {
      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:delete', 'user:create'],
          },
        ],
      });

      expect(() => grant.done()).toThrow(AuthError);
    });

    it('throws no error if permissions have been set', () => {
      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:delete', 'user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      grant.requires({ capability: 'user:create', for: model });

      expect(() => grant.done()).not.toThrow();
    });

    it(`bypassesses any other caps if the 'all' cap is set`, () => {
      class TestOtherDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const grant = new GrantService();
      grant.setActor({
        permissions: [
          {
            resource: new TestOtherDomainModel(),
            action: 'ALLOW',
            capabilities: ['all'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).not.toThrow();
    });

    it('throws no error if requiresNoPermissions has been called', () => {
      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:delete', 'user:create'],
          },
        ],
      });

      grant.requiresNoPermissions();

      expect(() => grant.done()).not.toThrow();
    });
  });

  describe('can', () => {
    it('correctly interprets an empty domain model as - needs global permissions', () => {
      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            action: 'ALLOW',
            capabilities: ['user:list'],
            resource: '*',
          },
        ],
      });

      expect(() => grant.requires({ capability: 'user:list' })).not.toThrow();
    });

    it('throws if an empty domain model is provided and global permissions are not present', () => {
      const grant = new GrantService();

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      grant.setActor({
        permissions: [
          {
            action: 'ALLOW',
            capabilities: ['user:list'],
            resource: model,
          },
        ],
      });

      expect(() => grant.requires({ capability: 'user:list' })).toThrow(
        AuthorisationError
      );
    });

    it('throws an authorisation error if there are no permissions', () => {
      const grant = new GrantService();

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      grant.setActor({
        permissions: [],
      });

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).toThrow(AuthorisationError);
    });

    it('throws no error if a capability matches and it is a global resource', () => {
      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:delete', 'user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).not.toThrow();
    });

    it('throws an authorisation error if there is a permission with a global resource that doesnt match', () => {
      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:delete'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).toThrow(AuthorisationError);
    });

    it('specific deny permission overrides global allow permission', () => {
      class TestOtherDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
          {
            resource: new TestOtherDomainModel(),
            action: 'DENY',
            capabilities: ['user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).toThrow(AuthorisationError);
    });

    it('global deny permissions override specific allow permissions', () => {
      class TestOtherDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const grant = new GrantService();
      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'DENY',
            capabilities: ['user:create'],
          },
          {
            resource: new TestOtherDomainModel(),
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).toThrow(AuthorisationError);
    });

    it('global allow permissions override specific ones even if it is last', () => {
      class TestOtherDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const grant = new GrantService();
      grant.setActor({
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
          {
            resource: new TestOtherDomainModel(),
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'bar';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).not.toThrow();
    });

    it('global allow permissions override specific ones even if it is first', () => {
      class TestOtherDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const grant = new GrantService();

      grant.setActor({
        permissions: [
          {
            resource: new TestOtherDomainModel(),
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'bar';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).not.toThrow();
    });

    it('does not throw an error if there is a matching cap and specific entity id match', () => {
      class TestOtherDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const grant = new GrantService();
      grant.setActor({
        permissions: [
          {
            resource: new TestOtherDomainModel(),
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).not.toThrow();
    });

    it('throws an error if there is a permission with matching caps but the entity is specified and doesnt match', () => {
      class TestOtherDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'bar';
      }

      const grant = new GrantService();
      grant.setActor({
        permissions: [
          {
            resource: new TestOtherDomainModel(),
            action: 'ALLOW',
            capabilities: ['user:create'],
          },
        ],
      });

      class TestDomainModel extends DomainModel<unknown> {
        public override toObject() {
          return this;
        }

        public id = 'foo';
      }

      const model = new TestDomainModel();

      expect(() =>
        grant.requires({ capability: 'user:create', for: model })
      ).toThrow(AuthorisationError);
    });
  });
});
