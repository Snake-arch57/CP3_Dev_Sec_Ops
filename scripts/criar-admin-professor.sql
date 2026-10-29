-- Conta inicial de administrador para uma demonstração.
-- A senha temporária aleatória aparece somente no resultado desta execução.
-- Guarde-a com segurança e troque-a no primeiro acesso.
-- Se o usuário já existir, o INSERT não altera a senha existente.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH credenciais AS MATERIALIZED (
  SELECT encode(gen_random_bytes(18), 'hex') AS senha_temporaria
), inserido AS (
  INSERT INTO "User"
    (id, username, "passwordHash", "displayName", department, role,
     "mustChangePassword", level, xp, money, reputation, "createdAt", "updatedAt")
  SELECT
    gen_random_uuid()::text,
    'professor.admin',
    crypt(credenciais.senha_temporaria, gen_salt('bf', 10)),
    'Administrador de demonstração',
    'Professor',
    'ADMIN',
    true,
    1, 0, 0, 100, now(), now()
  FROM credenciais
  WHERE true
  ON CONFLICT (username) DO NOTHING
  RETURNING username
)
SELECT inserido.username, credenciais.senha_temporaria
FROM inserido CROSS JOIN credenciais;

