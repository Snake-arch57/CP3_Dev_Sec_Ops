-- 60 contas de aluno para a aula, com senhas temporárias aleatórias.
-- Rode no SQL Editor do Supabase. O resultado mostra as senhas apenas nesta
-- execução; entregue cada senha ao aluno por um canal apropriado.
-- Todos devem trocá-la no primeiro acesso.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH credenciais AS MATERIALIZED (
  SELECT
    'aluno' || lpad(n::text, 2, '0') AS username,
    encode(gen_random_bytes(12), 'hex') AS senha_temporaria
  FROM generate_series(1, 60) AS n
), inseridos AS (
  INSERT INTO "User"
    (id, username, "passwordHash", "displayName", department, role,
     "mustChangePassword", level, xp, money, reputation, "createdAt", "updatedAt")
  SELECT
    gen_random_uuid()::text,
    credenciais.username,
    crypt(credenciais.senha_temporaria, gen_salt('bf', 10)),
    'Aluno ' || right(credenciais.username, 2),
    'Alunos',
    'EMPLOYEE',
    true,
    1, 0, 0, 100, now(), now()
  FROM credenciais
  WHERE true
  ON CONFLICT (username) DO NOTHING
  RETURNING username
)
SELECT inseridos.username, credenciais.senha_temporaria
FROM inseridos JOIN credenciais USING (username)
ORDER BY inseridos.username;

-- Para conferir as contas criadas:
SELECT COUNT(*) AS contas_de_aluno
FROM "User"
WHERE username LIKE 'aluno%';

-- Para apagar as contas da aula depois:
-- DELETE FROM "User" WHERE username LIKE 'aluno%';

