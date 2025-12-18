import { AuthorisationError } from './authorisation-error.ts';
import { DomainModel } from './domain-model.ts';
import { Grants } from './grants.ts';

describe('grant', () => {
  it('throws an authorisation error if there are no permissions', () => {
    const grant = new Grants([]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).toThrow(
      new AuthorisationError(model, 'user:create')
    );
  });

  it('throws no error if a capability matches and it is a global resource', () => {
    const grant = new Grants([
      {
        resource: '*',
        action: 'ALLOW',
        capabilities: ['user:delete', 'user:create'],
      },
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).not.toThrow();
  });

  it('throws an authorisation error if there is a permission with a global resource that doesnt match', () => {
    const grant = new Grants([
      {
        resource: '*',
        action: 'ALLOW',
        capabilities: ['user:delete'],
      },
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).toThrow(
      new AuthorisationError(model, 'user:create')
    );
  });

  it('specific deny permission overrides global allow permission', () => {
    class TestOtherDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const grant = new Grants([
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
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).toThrow(
      new AuthorisationError(model, 'user:create')
    );
  });

  it('global deny permissions override specific allow permissions', () => {
    class TestOtherDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const grant = new Grants([
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
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).toThrow(
      new AuthorisationError(model, 'user:create')
    );
  });

  it('global allow permissions override specific ones even if it is last', () => {
    class TestOtherDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const grant = new Grants([
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
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'bar';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).not.toThrow();
  });

  it('global allow permissions override specific ones even if it is first', () => {
    class TestOtherDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const grant = new Grants([
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
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'bar';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).not.toThrow();
  });

  it('does not throw an error if there is a matching cap and specific entity id match', () => {
    class TestOtherDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const grant = new Grants([
      {
        resource: new TestOtherDomainModel(),
        action: 'ALLOW',
        capabilities: ['user:create'],
      },
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).not.toThrow();
  });

  it('throws an error if there is a permission with matching caps but the entity is specified and doesnt match', () => {
    class TestOtherDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'bar';
    }

    const grant = new Grants([
      {
        resource: new TestOtherDomainModel(),
        action: 'ALLOW',
        capabilities: ['user:create'],
      },
    ]);

    class TestDomainModel extends DomainModel<unknown> {
      public override toObject() {
        return this;
      }

      public id = 'foo';
    }

    const model = new TestDomainModel();

    expect(() => grant.can(model, 'user:create')).toThrow(
      new AuthorisationError(model, 'user:create')
    );
  });
});
