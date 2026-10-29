# Hackudinhos

Projeto acadêmico do Challenge da Faculdade de Defesa Cibernética, em parceria
com a Leroy Merlin. São duas frentes que se completam:

- **o site** explica os golpes digitais do cotidiano brasileiro, em aberto e sem login;
- **a plataforma** treina o reflexo de reconhecê-los, com módulos, pontuação e ranking.

---

## Estrutura

Monorepo pnpm + turbo.

| Pacote | O que é | Stack |
|---|---|---|
| `apps/site` | O site público | Next 15 · Tailwind 3 · estático |
| `apps/jogo` | Front da plataforma gamificada | Next 16 · Tailwind 4 |
| `apps/api` | API da plataforma | NestJS 11 · Prisma · PostgreSQL |
| `packages/shared` | Engine de pontuação, schemas e o conteúdo dos módulos | TypeScript · Zod · Vitest |

Site e jogo têm **identidades visuais diferentes de propósito**: o site é
registro técnico institucional, a plataforma é pixel art. Uma explica, a outra
treina — e cada linguagem serve ao seu fim. Isso está documentado em detalhe em
`Contexto Claude/contexto.md`.

---

## Deploy na VM

O deploy automático em homologação via Docker Compose está descrito em [docs/deploy-vm.md](docs/deploy-vm.md).

## Como rodar

Requer Node 24 (veja `.nvmrc`) e pnpm.

```bash
corepack enable && pnpm install
```

O site sobe sozinho, sem configurar nada:

```bash
pnpm --filter site dev
```

A plataforma precisa de banco e variáveis. Copie os exemplos e preencha:

```bash
cp apps/api/.env.example apps/api/.env && cp apps/jogo/.env.example apps/jogo/.env.local
```

Depois, com o banco de pé:

```bash
pnpm --filter api exec prisma migrate deploy
```

E então tudo junto:

```bash
pnpm dev
```

---

## Verificação

```bash
pnpm typecheck && pnpm build && pnpm audit --prod
```

Os três devem passar limpos. O `audit` reporta **zero** — se voltar a acusar,
os overrides ficam em `pnpm-workspace.yaml`.

---

## Deploy

**Três projetos na Vercel**, todos apontando para este repositório, mudando só
o Root Directory:

| Projeto | Root Directory | Variáveis |
|---|---|---|
| site | `apps/site` | `NEXT_PUBLIC_JOGO_URL` (opcional) |
| jogo | `apps/jogo` | `API_ORIGIN` |
| api | `apps/api` | `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `NODE_ENV`, `CORS_ORIGIN` |

O front do jogo fala com a API por **rewrite do Next**, feito no servidor.
O navegador enxerga tudo na mesma origem, e é isso que faz o cookie de sessão
(`SameSite=Lax`) funcionar. Não há requisição cross-origin.

O banco é PostgreSQL no Supabase. Use a string do **pooler** (porta 6543) em
`DATABASE_URL` e a **direta** (5432) em `DIRECT_URL` — a explicação completa
está em `apps/api/.env.example`.

A API roda como Serverless Function pelo handler em `apps/api/api/index.ts`.
O `src/main.ts` continua existindo para rodar em servidor tradicional; os dois
compartilham o mesmo `AppModule`.

---

## Regras do conteúdo

Não são estilo, são requisito:

- **Número só com fonte, obra e ano na mesma tela.** Sem fonte primária
  conferível, o número não entra.
- **URL de canal oficial nunca é inventada.** O não conferido aparece marcado
  como pendente, com o caminho seguro para o usuário chegar sozinho.
- **No site, nada sai do navegador.** Senha digitada, dados do dossiê e
  respostas do quiz são todos locais. Sem analytics, sem rastreador.
- **Nunca culpar a vítima.** O tom é "isso acontece com qualquer um".
- **Acessibilidade obrigatória:** contraste AA, teclado com foco visível,
  alvos de toque de 44px, `prefers-reduced-motion` respeitado.

---

## Também no repositório

`Jogo/` guarda um protótipo em Godot, mantido à parte. Os assets do CraftPix
não são versionados por restrição de licença — quem clonar baixa dos packs
originais.

`deploy/` tem a configuração de nginx e systemd da hospedagem anterior em VPS,
mantida como referência.

---

## Créditos

Faculdade de Defesa Cibernética — Challenge · parceria Leroy Merlin Brasil.