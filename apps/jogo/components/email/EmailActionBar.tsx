"use client";

import { CheckCircle, HelpCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PlayerAction } from "@repo/shared/schemas";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/*
 * Duas respostas e uma saída.
 *
 * "É golpe" e "Não é golpe" ficam lado a lado, do mesmo tamanho: é a pergunta
 * do jogo, e nenhuma das duas pode parecer a opção padrão. "Não sei" fica
 * embaixo, discreta — está ali para quem ficou na dúvida poder dizer isso em
 * vez de chutar, que é o comportamento que o treinamento quer.
 *
 * ⚠️ O valor interno de "Não sei" continua sendo `"delete"`. O nome é herança
 * do botão Excluir que existia aqui, e mexer nele significaria mudar o enum em
 * `packages/shared/src/schemas/email.schema.ts`, o reducer da fase e os testes
 * do engine — sem nada mudar para quem joga. Se um dia for renomeado, é o
 * `PlayerActionSchema` que manda.
 *
 * ⚠️ Nenhum e-mail tem "não sei" como resposta certa, e isso é proposital: ela
 * não vale ponto e não tira ponto. Dois e-mails tinham `correctAction: "delete"`
 * de quando o botão era Excluir (o pendrive do dia 2 e o falso consignado do
 * dia 5); os dois viraram `"report"`, que é o que eles sempre foram — golpe.
 */
export function EmailActionBar({
  onDecide,
  disabled = false,
}: {
  onDecide: (action: PlayerAction) => void;
  disabled?: boolean;
}) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-3 border-t border-border p-4">
      <div className="flex gap-3">
        <Button
          variant="danger"
          size="lg"
          className="flex-1"
          disabled={disabled}
          onClick={() => onDecide("report")}
        >
          <ShieldAlert className="h-5 w-5" /> {t("phasesGame.report")}
        </Button>
        <Button
          variant="success"
          size="lg"
          className="flex-1"
          disabled={disabled}
          onClick={() => onDecide("accept")}
        >
          <CheckCircle className="h-5 w-5" /> {t("phasesGame.accept")}
        </Button>
      </div>
      <Button
        variant="outline"
        size="md"
        disabled={disabled}
        onClick={() => onDecide("delete")}
      >
        <HelpCircle className="h-4 w-4" /> {t("phasesGame.unsure")}
      </Button>
    </div>
  );
}
