import { Injectable } from "@nestjs/common";
import type { Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Ranking por DEPARTAMENTO, nunca por pessoa.
 *
 * Exigência da empresa, e é por lei (LGPD): expor um placar nominal de
 * desempenho de funcionário é tratar dado pessoal de um jeito que pode
 * constranger e prejudicar quem aparece embaixo. Então o placar deixou de ter
 * nome, id e posição individual — soma os pontos por setor e mostra só o setor
 * e o total.
 *
 * O que este serviço devolve NÃO contém: nome de pessoa, id de pessoa, a
 * posição de ninguém, nem quantas pessoas há em cada setor (esse último para
 * dificultar deduzir o desempenho de alguém num setor pequeno).
 *
 * O único dado ligado ao usuário atual é o NOME do próprio setor dele, para a
 * tela poder destacar "o seu setor" — e isso a pessoa já sabe sobre si mesma.
 *
 * ── Exceção para uso acadêmico ──────────────────────────────────────────────
 *
 * Um setor pode abrir a lista aluno a aluno dentro da própria linha do placar:
 * é a turma de faculdade, onde os participantes são contas descartáveis e
 * pseudônimas ("Aluno 35") criadas para a aula, e a disputa entre alunos é o
 * próprio objetivo didático — o professor precisa dela para premiar.
 *
 * O setor é o TURMA_PADRAO abaixo. `RANKING_INDIVIDUAL_DEPARTMENT` troca esse
 * valor sem mexer no código, e defini-la como vazia desliga o recurso. O
 * padrão vem no código de propósito: depender só da variável significa acertar
 * projeto, ambiente e republicação na Vercel, e qualquer um dos três errado
 * faz o recurso sumir sem dizer por quê.
 *
 * Dois limites, que continuam valendo:
 *   1. Só esse setor abre. Todos os outros seguem somados e sem nome.
 *   2. Recebem a lista quem PERTENCE ao setor e quem é ADMIN — o professor
 *      precisa dela, e o administrador já enxerga todo mundo pelo nome no
 *      painel de administração, então não revela nada novo para ele. Um
 *      funcionário de outro setor não vê.
 *
 * Para desligar depois da aula: defina RANKING_INDIVIDUAL_DEPARTMENT como
 * vazia, ou remova este bloco. Nenhum setor com gente de verdade se chama
 * "Alunos", então o padrão não afeta a operação da empresa.
 */

/** Setor tratado como turma quando a variável de ambiente não diz outra coisa. */
const TURMA_PADRAO = "Alunos";

/** Mesma normalização do agrupamento: "TI", "ti " e "Ti" são o mesmo setor. */
function normalizar(valor: string | null | undefined): string {
  return (valor ?? "").trim().replace(/\s+/g, " ");
}

type Membro = {
  id: string;
  department: string | null;
  xp: number;
  displayName: string;
};

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking(currentUserId: string, currentUserRole: Role) {
    const users = await this.prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      select: { id: true, department: true, xp: true, displayName: true },
    });

    // Agrupa por setor. A chave normaliza (minúsculas, espaços colapsados) para
    // que "TI" e "ti" contem como o mesmo setor; o rótulo exibido é a primeira
    // forma que apareceu, preservando a grafia de quem cadastrou.
    const grupos = new Map<string, { label: string; xp: number }>();
    let currentKey: string | null = null;

    for (const u of users) {
      const bruto = normalizar(u.department);
      const key = bruto.toLowerCase() || "__sem_setor__";
      const label = bruto || "Sem setor";

      const grupo = grupos.get(key) ?? { label, xp: 0 };
      grupo.xp += u.xp;
      grupos.set(key, grupo);

      if (u.id === currentUserId) currentKey = key;
    }

    const entries = [...grupos.values()]
      .sort((a, b) => b.xp - a.xp)
      .map((g, i) => ({ rank: i + 1, department: g.label, xp: g.xp }));

    return {
      entries,
      currentDepartment: currentKey ? grupos.get(currentKey)!.label : null,
      individual: this.turmaAberta(users, grupos, currentUserId, currentKey, currentUserRole),
    };
  }

  /**
   * A turma que a tela pode abrir dentro da linha dela, ou null.
   *
   * Devolve junto o rótulo do setor, para a tela casar com a linha certa do
   * placar sem precisar repetir a regra de normalização.
   */
  private turmaAberta(
    users: Membro[],
    grupos: Map<string, { label: string; xp: number }>,
    currentUserId: string,
    currentKey: string | null,
    currentUserRole: Role,
  ) {
    // Variável definida (mesmo vazia) manda; ausente cai no padrão do código.
    const bruto = process.env.RANKING_INDIVIDUAL_DEPARTMENT ?? TURMA_PADRAO;
    const turma = normalizar(bruto).toLowerCase();
    if (!turma) return null;

    const podeVer = currentUserRole === "ADMIN" || currentKey === turma;
    if (!podeVer) return null;

    const grupo = grupos.get(turma);
    if (!grupo) return null;

    const membros = users.filter((u) => normalizar(u.department).toLowerCase() === turma);
    if (membros.length === 0) return null;

    return {
      department: grupo.label,
      entries: membros
        .sort((a, b) => b.xp - a.xp || a.displayName.localeCompare(b.displayName))
        .map((u, i) => ({
          rank: i + 1,
          name: u.displayName,
          xp: u.xp,
          isYou: u.id === currentUserId,
        })),
    };
  }
}
