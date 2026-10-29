import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * Garante os parâmetros que o Prisma precisa quando está atrás de um pooler.
 *
 * Sem `pgbouncer=true`, o Prisma usa prepared statements — que o PgBouncer em
 * modo transaction não suporta. O sintoma é traiçoeiro: a conexão abre normal
 * (então a aplicação sobe e responde), e só as consultas falham.
 *
 * Isto existe porque a URL é colada à mão em painel de deploy, e esquecer o
 * sufixo é fácil demais. Em vez de depender de acertar, o código completa.
 * Se a URL não passa por pooler (porta 5432 direta), nada é alterado.
 */
function normalizarUrl(url: string | undefined): string | undefined {
  if (!url) return url;

  // Porta 6543 é o pooler em modo transaction do Supabase.
  const usaPooler = url.includes(":6543") || url.includes("pooler.supabase.com:6543");
  if (!usaPooler) return url;

  const parametros: string[] = [];
  if (!url.includes("pgbouncer=")) parametros.push("pgbouncer=true");
  if (!url.includes("connection_limit=")) parametros.push("connection_limit=1");
  if (parametros.length === 0) return url;

  return url + (url.includes("?") ? "&" : "?") + parametros.join("&");
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: { db: { url: normalizarUrl(process.env.DATABASE_URL) } },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
