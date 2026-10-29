"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Sair de uma partida em andamento — fase ou mini-jogo.
 *
 * Pergunta antes porque o progresso de uma partida só é gravado quando ela
 * termina: sair no meio descarta tudo o que foi respondido. Um toque sem
 * querer no cabeçalho não pode custar a fase inteira.
 *
 * Não confundir com o "Sair" do menu, que encerra a sessão. Aqui a pessoa
 * continua logada.
 */
export function BotaoSair({ para }: { para: string }) {
  const { t } = useLocale();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);

  return (
    <Dialog.Root open={aberto} onOpenChange={setAberto}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm" className="text-text-muted hover:text-text">
          <LogOut className="h-4 w-4" /> {t("common.exitGame")}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-bg p-5 shadow-2xl">
          <Dialog.Title className="font-stencil text-lg font-semibold uppercase tracking-wide text-text">
            {t("common.exitGameTitle")}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-text-muted">
            {t("common.exitGameBody")}
          </Dialog.Description>

          {/* Continuar jogando vem primeiro na leitura e é o alvo maior: sair
              é a ação destrutiva, não deve ser a mais fácil de acertar. */}
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
            <Dialog.Close asChild>
              <Button variant="outline" className="flex-1">
                {t("common.exitGameCancel")}
              </Button>
            </Dialog.Close>
            <Button variant="danger" className="flex-1" onClick={() => router.push(para)}>
              <LogOut className="h-4 w-4" /> {t("common.exitGameConfirm")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
