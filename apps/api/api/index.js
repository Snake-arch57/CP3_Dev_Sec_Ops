/**
 * Ponto de entrada da API na Vercel.
 *
 * ⚠️ Este arquivo é .js de propósito, e importa de `../dist/` em vez de
 * `../src/`.
 *
 * A Vercel compila funções com esbuild, que NÃO implementa
 * `emitDecoratorMetadata`. O NestJS depende desse metadata para a injeção de
 * dependência: sem ele, os providers não resolvem e a aplicação morre no
 * bootstrap — com FUNCTION_INVOCATION_FAILED em toda rota, inclusive nas que
 * não tocam o banco.
 *
 * A saída é compilar com o `tsc` antes (ele emite o metadata como chamadas
 * `Reflect.metadata` no JavaScript) e apontar o handler para o resultado. O
 * script `build` do package.json roda essa compilação. Como este arquivo não
 * tem decorator nenhum, o esbuild processa sem problema.
 *
 * ⚠️ O nome do arquivo é `index.js`, e isso não é acidente.
 *
 * A tentação é usar o catch-all `[...path].js` para receber `/api/*`. Não
 * funciona: a convenção da pasta `api/` da Vercel NÃO implementa catch-all —
 * isso é coisa do roteador do Next.js, não da convenção de funções. Aqui
 * `[...path]` vira um parâmetro de nome literal `...path`, e todo segmento
 * dinâmico compila para `([^/]+)`, que casa exatamente UM segmento. A rota
 * gerada era `^/api/([^/]+)$`: `/api/ranking` chegava, `/api/auth/login`
 * morria num 404 da plataforma — 12 das 13 rotas mortas, com build verde e
 * nenhum erro no painel.
 *
 * A produção deixou a assinatura do problema à vista: `/api/a` respondia
 * `Cannot GET /api/a?...path=a`. Aquele `...path` como nome de parâmetro é a
 * prova de que a Vercel leu os três pontos como parte do nome, e não como
 * marcador de catch-all.
 *
 * O roteamento agora vem do `rewrites` no vercel.json — o padrão que a própria
 * Vercel documenta para Express e afins. Rewrites são avaliados DEPOIS do
 * sistema de arquivos, então `/api/auth/login` não casa com arquivo nenhum,
 * cai na regra e chega aqui com a URL ORIGINAL preservada em `req.url`. É
 * disso que o `setGlobalPrefix("api")` abaixo depende.
 *
 * `src/main.ts` continua servindo servidor tradicional. Os dois caminhos
 * compartilham o mesmo AppModule — nenhuma regra de negócio duplicada.
 */
require("reflect-metadata");

const { NestFactory } = require("@nestjs/core");
const { ExpressAdapter } = require("@nestjs/platform-express");
const express = require("express");
const cookieParser = require("cookie-parser");
const { AppModule } = require("../dist/app.module");
const { origensPermitidas } = require("../dist/config");

let cached = null;
let iniciando = null;

async function criarApp() {
  const servidor = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(servidor), {
    // O log padrão do Nest polui o painel da Vercel a cada cold start.
    logger: ["error", "warn"],
  });

  app.use(cookieParser());
  app.setGlobalPrefix("api");
  // Mesma regra de origem do src/main.ts — os dois pontos de entrada leem de
  // ../dist/config justamente para não divergirem.
  app.enableCors({
    origin: origensPermitidas(),
    credentials: true,
  });

  // `init` em vez de `listen`: prepara a aplicação sem abrir socket.
  await app.init();

  return servidor;
}

function obterApp() {
  if (cached) return Promise.resolve(cached);

  // Sem esta trava, duas requisições simultâneas no mesmo cold start
  // inicializariam o Nest duas vezes e abririam duas conexões de banco.
  if (!iniciando) {
    iniciando = criarApp().then((app) => {
      cached = app;
      iniciando = null;
      return app;
    });
  }

  return iniciando;
}

module.exports = async function handler(req, res) {
  const app = await obterApp();
  return app(req, res);
};
