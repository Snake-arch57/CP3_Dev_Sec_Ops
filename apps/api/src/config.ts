/**
 * Configuração sensível a segurança, num lugar só.
 *
 * Existe porque a API tem DOIS pontos de entrada — `src/main.ts` (servidor
 * tradicional) e `api/index.js` (função da Vercel) — e cada um montava a
 * própria configuração de CORS. Corrigir só um deixava o outro aberto, que é
 * o tipo de divergência que ninguém percebe até alguém procurar.
 */

/**
 * Origens que podem chamar a API com credenciais.
 *
 * O padrão anterior era `?? true`, que faz o Express **refletir a origem
 * recebida** — ou seja, qualquer site na internet recebia
 * `Access-Control-Allow-Origin: <ele mesmo>` junto de
 * `Access-Control-Allow-Credentials: true`. Isso ficou valendo em produção
 * porque `CORS_ORIGIN` nunca foi definida no painel, e o código não tinha como
 * reclamar: o fallback era justamente o caso mais permissivo.
 *
 * Agora o padrão é o oposto — em produção, sem configuração explícita,
 * nenhuma origem externa é liberada.
 *
 * Isso não quebra o jogo: ele conversa com a API através do rewrite do Next
 * (`apps/jogo/next.config.ts`), então para o navegador é tudo mesma origem e
 * CORS nem entra na jogada. Quem faz a chamada é o servidor do Next, e servidor
 * não aplica CORS. Se um dia algum front precisar bater direto na API de outro
 * domínio, é só definir `CORS_ORIGIN` (aceita lista separada por vírgula).
 */
export function origensPermitidas(): string[] | boolean {
  const configurado = process.env.CORS_ORIGIN?.split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  if (configurado && configurado.length > 0) return configurado;

  // Sem configuração explícita: fecha em produção, libera o localhost em dev.
  if (process.env.NODE_ENV === "production") return false;

  return ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"];
}

/**
 * Segredo que assina os tokens de sessão.
 *
 * O fallback antigo (`?? "dev-only-insecure-secret-change-me"`) falhava em
 * silêncio, que é o pior modo de falhar: sem a variável, a aplicação subia
 * normal, o login funcionava, a demo corria lisa — e toda sessão estava
 * assinada com uma string que está publicada neste repositório. Qualquer pessoa
 * com acesso ao código conseguiria forjar um token de ADMIN.
 *
 * Em produção isso agora derruba o bootstrap na hora. Um erro visível no deploy
 * é muito melhor do que uma aplicação que parece certa e não é.
 */
export function segredoJwt(): string {
  const segredo = process.env.JWT_SECRET;
  if (segredo && segredo.trim().length > 0) return segredo;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET não está definida. Em produção a API não sobe sem ela — " +
        "sem isso as sessões seriam assinadas com o segredo de exemplo do " +
        "repositório, e qualquer um poderia forjar um token de ADMIN. " +
        "Defina JWT_SECRET nas variáveis de ambiente do projeto.",
    );
  }

  return "dev-only-insecure-secret-change-me";
}
