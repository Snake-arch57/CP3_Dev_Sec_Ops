# Deploy automático na VM Rocky Linux

Cada merge que atualiza a branch `main` aciona o GitHub Actions e publica o estado atual do repositório na VM de **homologação**, usando Docker Compose. O workflow usa um runner self-hosted instalado na VM e o clone existente; não usa SSH de entrada nem guarda as credenciais do banco no GitHub.

## Preparar a VM

1. Instale Git, Docker Engine e o plugin Docker Compose conforme a documentação oficial do Rocky Linux/Docker. Habilite e inicie o serviço Docker.
2. Escolha uma conta dedicada para o runner. Adicione-a ao grupo `docker`, faça novo login e confirme que ela consegue executar `docker compose version` sem sudo. Essa conta terá controle dos containers da VM.
3. Garanta que essa conta seja dona do clone do repositório. Deixe-o na branch `main`, sem alterações rastreadas locais, e anote seu caminho absoluto.
4. Crie `apps/api/.env` na VM, a partir de `apps/api/.env.example`, com `DATABASE_URL`, `DIRECT_URL` e `JWT_SECRET` reais. Não versione esse arquivo. Gere um segredo JWT forte, por exemplo com `openssl rand -hex 32`.
5. Instale e registre um runner self-hosted deste repositório na VM seguindo **Settings → Actions → Runners → New self-hosted runner**. Adicione o label customizado `cyberguard-deploy` e execute o serviço do runner com a conta que tem acesso ao Docker e ao clone.
6. Em **Settings → Environments**, crie o environment `homologacao` sem revisores obrigatórios. Em **Settings → Secrets and variables → Actions → Variables**, crie a variável de repositório:
   - `VM_DEPLOY_PATH`: caminho absoluto do clone, por exemplo `/home/deploy/CP3_Dev_Sec_Ops`.

O primeiro deploy pode ser acionado por um merge ou por um push autorizado em `main`. O workflow atualiza o clone até o commit acionador, constrói as três imagens, aplica migrations do Prisma e executa `docker compose up -d`.

## Portas

- Site: `3001` (publicada na interface da VM).
- Jogo: `3002` (publicada na interface da VM).
- API: `3003`, vinculada somente a `127.0.0.1`; o jogo conversa com ela pela rede interna do Compose.

Ajuste o firewalld e configure um proxy HTTPS (por exemplo, Nginx) conforme os domínios da VM. O `.env` precisa apontar para um PostgreSQL acessível a partir dela. O Compose não cria um banco local.

## Controles

Proteja `main` com merge por pull request e revisão, pois código nessa branch será executado por um runner que controla Docker na VM. Mantenha esse runner apenas para este repositório e não permita que workflows de pull requests de forks sejam executados nele. O workflow é disparado apenas em `push` para `main`.

Este fluxo é de homologação. A publicação final em produção deve continuar sujeita à aprovação humana prevista no trabalho; não remova essa aprovação ao criar o processo de produção.
