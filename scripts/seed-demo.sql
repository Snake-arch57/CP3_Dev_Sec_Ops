-- Usuários fictícios para uma demonstração, com senhas temporárias aleatórias.
-- Rode no SQL Editor do Supabase. O resultado mostra as senhas apenas nesta
-- execução; entregue-as por um canal apropriado. Todos devem trocá-las no
-- primeiro acesso. O script pode ser executado novamente sem alterar usuários
-- já existentes.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH demonstracao(username, display_name, department, level, xp) AS (
  VALUES
    ('funcionario01', 'Funcionário 01', 'TI', 4, 3200),
    ('funcionario02', 'Funcionário 02', 'TI', 3, 2100),
    ('funcionario03', 'Funcionário 03', 'Caixa', 5, 4100),
    ('funcionario04', 'Funcionário 04', 'Caixa', 1, 950),
    ('funcionario05', 'Funcionário 05', 'Gerência', 4, 3800),
    ('funcionario06', 'Funcionário 06', 'Gerência', 2, 1150),
    ('funcionario07', 'Funcionário 07', 'Lojista', 2, 1800),
    ('funcionario08', 'Funcionário 08', 'Lojista', 3, 2600),
    ('funcionario09', 'Funcionário 09', 'Entregador', 2, 1500),
    ('funcionario10', 'Funcionário 10', 'Entregador', 3, 2050)
), credenciais AS MATERIALIZED (
  SELECT demonstracao.*, encode(gen_random_bytes(12), 'hex') AS senha_temporaria
  FROM demonstracao
), inseridos AS (
  INSERT INTO "User"
    (id, username, "passwordHash", "displayName", department, role,
     "mustChangePassword", level, xp, money, reputation, "createdAt", "updatedAt")
  SELECT
    gen_random_uuid()::text,
    credenciais.username,
    crypt(credenciais.senha_temporaria, gen_salt('bf', 10)),
    credenciais.display_name,
    credenciais.department,
    'EMPLOYEE',
    true,
    credenciais.level,
    credenciais.xp,
    0, 100, now(), now()
  FROM credenciais
  WHERE true
  ON CONFLICT (username) DO NOTHING
  RETURNING username
)
SELECT inseridos.username, credenciais.senha_temporaria
FROM inseridos JOIN credenciais USING (username)
ORDER BY inseridos.username;

-- Confere a pontuação por setor:
SELECT department AS setor, SUM(xp) AS pontos_do_setor, COUNT(*) AS pessoas
FROM "User"
WHERE role = 'EMPLOYEE' AND username LIKE 'funcionario%'
GROUP BY department
ORDER BY pontos_do_setor DESC;

