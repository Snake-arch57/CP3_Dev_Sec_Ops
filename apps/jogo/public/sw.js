/**
 * Service worker da plataforma.
 *
 * Por que existe: o Chrome só oferece o prompt de instalação ("Instalar app")
 * quando há um service worker com handler de `fetch`. Instalar pelo menu do
 * navegador funciona sem isso — desde o Chrome 108 no celular —, mas ninguém
 * procura no menu. O prompt é o que faz a opção aparecer sozinha.
 *
 * ⚠️ A regra que orienta este arquivo: NUNCA prender o usuário numa versão
 * antiga. Service worker mal configurado é uma das poucas coisas capazes de
 * servir HTML velho depois de um deploy novo, e o sintoma é péssimo de
 * diagnosticar — o site "não atualiza" para uma pessoa e atualiza para outra.
 *
 * Por isso a estratégia é sempre rede primeiro. O cache aqui é rede de
 * segurança para quando não há conexão, nunca fonte primária.
 */

const CACHE = "hackudinhos-v1";

// Só o suficiente para a tela não ficar em branco offline. O grosso do app
// vem da rede.
const ESSENCIAL = ["/", "/icone-192.png"];

self.addEventListener("install", (evento) => {
  // Assume o controle sem esperar as abas antigas fecharem: um deploy novo
  // deve valer na próxima navegação, não daqui a dias.
  self.skipWaiting();
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ESSENCIAL)).catch(() => {
      // Se algum recurso falhar, a instalação segue. Um cache incompleto é
      // melhor do que um service worker que não instala.
    }),
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      // Remove caches de versões anteriores.
      const nomes = await caches.keys();
      await Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (evento) => {
  const req = evento.request;

  // Só GET. POST de login e envio de resultado jamais podem ser servidos de
  // cache nem repetidos.
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Nada de outra origem.
  if (url.origin !== self.location.origin) return;

  // A API fica inteiramente fora: progresso, ranking e sessão precisam ser
  // sempre frescos, e cachear resposta autenticada é como um usuário acaba
  // vendo dado de outro.
  if (url.pathname.startsWith("/api/")) return;

  evento.respondWith(
    (async () => {
      try {
        const resposta = await fetch(req);

        // Guarda uma cópia só do que deu certo, para servir se cair a conexão.
        if (resposta && resposta.status === 200 && resposta.type === "basic") {
          const copia = resposta.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copia)).catch(() => {});
        }

        return resposta;
      } catch (erro) {
        // Sem rede: entrega o que houver guardado.
        const cacheado = await caches.match(req);
        if (cacheado) return cacheado;

        // Numa navegação sem nada em cache, devolve a raiz para o app abrir
        // com a própria tela em vez do erro do navegador.
        if (req.mode === "navigate") {
          const raiz = await caches.match("/");
          if (raiz) return raiz;
        }

        throw erro;
      }
    })(),
  );
});
