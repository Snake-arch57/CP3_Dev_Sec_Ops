"use client";

import { Star, Mail, CalendarDays } from "lucide-react";
import { MeterBadge } from "./MeterBadge";
import { BotaoSair } from "@/components/game/BotaoSair";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Painel de cima durante a partida.
 *
 * Tinha nove indicadores: dia, cronômetro, e-mails, combo, dinheiro, XP, nível,
 * barra de segurança e reputação. Para quem está tentando decidir se um e-mail
 * é golpe, isso é nove coisas competindo pela atenção com a única que importa.
 *
 * Ficaram três: em que dia está, quanto falta, e quantos pontos já fez.
 * Cronômetro, combo e segurança saíram junto com as mecânicas. Dinheiro e
 * nível continuam existindo e aparecendo na tela inicial — só não durante a
 * leitura.
 */
export interface GameHudProps {
  dayNumber: number;
  xp: number;
  emailAtual: number;
  totalEmails: number;
  /** Para onde o botão de sair leva. Sem isto, o botão não aparece. */
  sairPara?: string;
}

export function GameHud({ dayNumber, xp, emailAtual, totalEmails, sairPara }: GameHudProps) {
  const { t } = useLocale();
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
      <MeterBadge icon={CalendarDays} label={t("hud.day")} value={dayNumber} />
      <MeterBadge icon={Mail} label={t("hud.emails")} value={`${emailAtual}/${totalEmails}`} />
      <MeterBadge icon={Star} label={t("hud.points")} value={xp} colorClassName="text-primary" />
      {sairPara && (
        <div className="ml-auto">
          <BotaoSair para={sairPara} />
        </div>
      )}
    </div>
  );
}
