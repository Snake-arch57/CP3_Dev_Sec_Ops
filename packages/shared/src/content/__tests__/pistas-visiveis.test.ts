import { describe, expect, it } from "vitest";
import { getAllDays, getEmailsForDay } from "../loader";
import { availableToolIds } from "../../engine/investigation";

/**
 * Todo e-mail precisa oferecer ao menos uma pista que o jogador consiga usar.
 *
 * Existe por causa da simplificação das ferramentas de investigação: das onze,
 * cinco saíram de cena (cabeçalho, sandbox, certificado, domínio e assistente
 * de IA). O conteúdo dos e-mails não foi reescrito — as pistas dessas
 * ferramentas continuam gravadas, só não são oferecidas.
 *
 * O risco disso é silencioso: um e-mail cujas pistas eram todas de ferramentas
 * removidas fica sem nada para investigar, e ninguém percebe até o jogador
 * chegar nele. Quando a lista foi reduzida, quatro e-mails caíam nesse caso;
 * dois foram cobertos por manter "pesquisar remetente" e dois tiveram a pista
 * de domínio reatribuída ao endereço do remetente.
 *
 * Roda nos dois idiomas porque o inglês é um arquivo à parte e pode divergir.
 */
describe.each(["pt", "en"] as const)("conteúdo em %s", (locale) => {
  const casos = getAllDays(locale).flatMap((day) =>
    getEmailsForDay(day.id, locale).map((email) => [day.id, email.id, email] as const),
  );

  it("tem e-mails para verificar", () => {
    expect(casos.length).toBeGreaterThan(0);
  });

  it.each(casos)("%s / %s oferece ao menos uma pista visível", (_dia, _id, email) => {
    expect(availableToolIds(email).length).toBeGreaterThan(0);
  });
});
