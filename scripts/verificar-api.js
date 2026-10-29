/**
 * Verifica se a API em produção está roteando de verdade.
 *
 *   node scripts/verificar-api.js
 *   node scripts/verificar-api.js https://outra-url.vercel.app
 *
 * O ponto cego que esta ferramenta cobre: olhar só o status HTTP engana. Um
 * 404 pode ser o NestJS dizendo "essa rota não existe" (roteamento funcionou)
 * ou a Vercel dizendo "essa função não existe" (roteamento quebrado). Os dois
 * são 404. O que separa é a origem da resposta:
 *
 *   Nest      -> JSON com {"message":...,"statusCode":...}, header X-Powered-By
 *   Plataforma-> texto "NOT_FOUND", header X-Vercel-Error
 *
 * Foi essa confusão que fez um deploy verde esconder 12 rotas mortas.
 *
 * Um 401 aqui é SUCESSO: significa que a requisição atravessou o roteamento e
 * chegou no guard de autenticação. Não estamos testando login, e sim se o
 * caminho até ele existe.
 */
const BASE = (process.argv[2] || "https://cyber-guard-api.vercel.app").replace(/\/+$/, "");

const SONDAS = [
  { rota: "/api/ranking", segmentos: 1, nota: "já funcionava antes — se quebrar, é regressão" },
  { rota: "/api/auth/status", segmentos: 2, nota: "não exige sessão: deve responder 200" },
  { rota: "/api/players/me", segmentos: 2, nota: "estava morta" },
  { rota: "/api/admin/employees", segmentos: 2, nota: "estava morta" },
  { rota: "/api/rota-que-nao-existe-xyz", segmentos: 2, nota: "sonda de req.url" },
];

function classificar(status, corpo, headers) {
  // A ordem importa. Uma função que quebra ao iniciar TAMBÉM responde com o
  // cabeçalho x-vercel-error, então testar o cabeçalho primeiro fazia todo
  // FUNCTION_INVOCATION_FAILED ser relatado como "rewrite não pegou" — e
  // mandava procurar o problema no roteamento, que estava funcionando.
  const erroVercel = headers.get("x-vercel-error") ?? "";
  if (erroVercel === "FUNCTION_INVOCATION_FAILED" || /FUNCTION_INVOCATION_FAILED/.test(corpo)) {
    return {
      ok: false,
      quem: "FUNCAO",
      detalhe: "chegou na API, mas ela quebra ao iniciar — banco pausado ou fora do ar, ou variável de ambiente faltando",
    };
  }
  if (erroVercel === "NOT_FOUND" || /^\s*(NOT_FOUND|The page could not be found)/.test(corpo)) {
    return { ok: false, quem: "PLATAFORMA", detalhe: "o rewrite não pegou — a requisição nunca chegou no Nest" };
  }
  if (erroVercel) {
    return { ok: false, quem: "PLATAFORMA", detalhe: `erro da Vercel: ${erroVercel}` };
  }
  try {
    const j = JSON.parse(corpo);
    if (typeof j.statusCode === "number" || typeof j.message !== "undefined" || j.needsBootstrap !== undefined) {
      return { ok: true, quem: "NEST", detalhe: "" };
    }
  } catch {
    /* corpo não-JSON cai no genérico abaixo */
  }
  return { ok: status < 500, quem: "?", detalhe: "resposta inesperada" };
}

(async () => {
  console.log(`alvo: ${BASE}\n`);

  let falhas = 0;
  let urlEcoada = null;

  for (const s of SONDAS) {
    let linha;
    try {
      const r = await fetch(`${BASE}${s.rota}`, { redirect: "manual" });
      const corpo = await r.text();
      const c = classificar(r.status, corpo, r.headers);
      if (!c.ok) falhas++;

      // O 404 do Nest ecoa o caminho que ele enxergou. É a prova de que a
      // Vercel entregou a URL original, e não o destino do rewrite.
      const eco = corpo.match(/Cannot GET ([^"?]+)/);
      if (eco && s.rota.includes("nao-existe")) urlEcoada = eco[1];

      linha = `${c.ok ? "ok  " : "FALHA"} ${s.rota.padEnd(30)} [${r.status}] ${c.quem}${c.detalhe ? " — " + c.detalhe : ""}`;
    } catch (e) {
      falhas++;
      linha = `FALHA ${s.rota.padEnd(30)} — ${e.message}`;
    }
    console.log(linha);
  }

  if (urlEcoada) {
    console.log(`\nsonda de req.url: o Nest enxergou "${urlEcoada}"`);
    if (urlEcoada === "/api/rota-que-nao-existe-xyz") {
      console.log("  -> URL original preservada. É disso que o setGlobalPrefix depende.");
    } else {
      console.log("  -> ATENÇÃO: a Vercel entregou o destino do rewrite, não o caminho original.");
      console.log("     Nesse caso TODA rota daria 404 e o handler precisa restaurar req.url.");
    }
  }

  console.log(falhas === 0 ? "\nTudo roteando." : `\n${falhas} falha(s).`);
  process.exit(falhas === 0 ? 0 : 1);
})();
