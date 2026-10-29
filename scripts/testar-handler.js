/**
 * Sobe o handler da Vercel num servidor local efêmero, faz requisições reais e
 * encerra.
 *
 * Existe porque depurar pelo painel da Vercel é caro e cego: um erro de
 * bootstrap do Nest vira `FUNCTION_INVOCATION_FAILED` em todas as rotas, sem
 * stack trace. Aqui a exceção aparece inteira, com arquivo e linha.
 *
 *   cd apps/api && pnpm build
 *   node ../../scripts/testar-handler.js .
 *
 * Espera-se: /api/nada → 404 e /api/auth/status → 200.
 * Um 500 (ou exceção impressa) significa que o deploy também vai falhar.
 */
const http = require("http");
const path = require("path");
const fs = require("fs");

const RAIZ = path.resolve(process.argv[2] || ".");

// Lê o .env na mão, para não depender de dotenv estar instalado.
const caminhoEnv = path.join(RAIZ, ".env");
if (fs.existsSync(caminhoEnv)) {
  for (const linha of fs.readFileSync(caminhoEnv, "utf8").split("\n")) {
    const m = linha.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} else {
  console.log(`aviso: ${caminhoEnv} nao encontrado — as rotas com banco vao falhar\n`);
}

const handler = require(path.join(RAIZ, "api", "index.js"));

let houveFalha = false;

const servidor = http.createServer((req, res) => {
  Promise.resolve(handler(req, res)).catch((erro) => {
    houveFalha = true;
    console.log("\n>>> O HANDLER LANCOU EXCECAO:");
    console.log(erro?.stack || erro?.message || erro);
    if (!res.headersSent) res.statusCode = 500;
    res.end("erro");
  });
});

servidor.listen(0, async () => {
  const porta = servidor.address().port;

  async function pedir(caminho, esperado) {
    const r = await fetch(`http://127.0.0.1:${porta}${caminho}`);
    const corpo = await r.text();
    const ok = r.status === esperado;
    if (!ok) houveFalha = true;
    console.log(`${ok ? "ok  " : "FALHA"} ${caminho.padEnd(20)} [${r.status}] ${corpo.slice(0, 100)}`);
  }

  try {
    await pedir("/api/nada", 404);
    await pedir("/api/auth/status", 200);
  } catch (e) {
    houveFalha = true;
    console.log("falha na requisicao:", e.message);
  }

  servidor.close();
  process.exit(houveFalha ? 1 : 0);
});
