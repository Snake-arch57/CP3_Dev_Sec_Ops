import type { NextConfig } from "next";

/**
 * Origem da API, para onde o rewrite abaixo encaminha `/api/*`.
 *
 * A ordem de precedência importa:
 *  1. `API_ORIGIN`, quando definida — é o que manda, e permite apontar para
 *     uma API de preview ou de outra conta sem tocar no código;
 *  2. em produção na Vercel, a API publicada — para o deploy não quebrar caso
 *     alguém esqueça a variável, que foi exatamente o que aconteceu na
 *     primeira subida;
 *  3. localhost, para desenvolvimento.
 *
 * O erro `DNS_HOSTNAME_RESOLVED_PRIVATE` na Vercel é o sintoma de cair no
 * localhost sem querer: a função tenta resolver um endereço privado.
 */
// Endereço herdado do nome anterior do projeto. Continua válido; quando um
// subdomínio próprio (api.hackudinhos.com.br) for apontado para a API, basta
// definir API_ORIGIN no painel — este valor é só a rede de segurança para o
// caso de alguém esquecer a variável, que já aconteceu uma vez.
const API_PRODUCAO = "https://cyber-guard-api.vercel.app";

const API_ORIGIN =
  process.env.API_ORIGIN?.replace(/\/+$/, "") ||
  (process.env.VERCEL_ENV === "production" ? API_PRODUCAO : "http://localhost:3003");

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy no servidor: o navegador enxerga tudo na mesma origem do jogo.
    // É isso que faz o cookie de sessão (SameSite=Lax) sobreviver.
    return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }];
  },
};

export default nextConfig;
