
CREATE TABLE IF NOT EXISTS roles (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  permissions  JSONB NOT NULL DEFAULT '[]'::jsonb,
  routes       JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  "userId" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,

  CONSTRAINT user_roles_pkey PRIMARY KEY ("userId", "roleId"),
  CONSTRAINT user_roles_user_fk
    FOREIGN KEY ("userId") REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT user_roles_role_fk
    FOREIGN KEY ("roleId") REFERENCES roles(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles ("userId");
CREATE INDEX IF NOT EXISTS user_roles_role_id_idx ON user_roles ("roleId");
