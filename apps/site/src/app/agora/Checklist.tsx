"use client";

import { useState } from "react";

type Item = {
  id: string;
  titulo: string;
  /** O que é, em uma frase, sem jargão. */
  oQue: string;
  /** Por que isso existe. */
  porque: string;
  /** O que concretamente deixa de acontecer. */
  impacto: string;
  /** Caminho curto para fazer. */
  como: string;
  prioridade: 1 | 2;
};

const ITENS: Item[] = [
  {
    id: "2fa-whats",
    titulo: "Ligue a verificação em duas etapas no WhatsApp",
    oQue: "É uma senha de seis números, criada por você.",
    porque: "Na clonagem, basta o código que chega por SMS.",
    impacto: "Sem essa senha, o golpista não leva a conta.",
    como: "Configurações → Privacidade → Verificação em duas etapas → Ativar. Cadastre um e-mail de recuperação.",
    prioridade: 1,
  },
  {
    id: "2fa",
    titulo: "Ligue a verificação em duas etapas no e-mail e no banco",
    oQue: "Além da senha, o serviço pede um código ou sua digital.",
    porque: "Senha pode vazar sem você saber.",
    impacto: "Só a senha vazada não basta para entrar.",
    como: "Veja na parte de segurança de cada serviço. Comece pelo e-mail.",
    prioridade: 1,
  },
  {
    id: "gerenciador",
    titulo: "Instale um gerenciador de senhas",
    oQue: "Um app que cria e guarda uma senha para cada site.",
    porque: "Sem ele, todo mundo repete senha.",
    impacto: "Um site vazado não abre suas outras contas.",
    como: "Bitwarden e KeePassXC são gratuitos. O do navegador ou do iPhone também serve.",
    prioridade: 1,
  },
  {
    id: "atualizar",
    titulo: "Deixe as atualizações automáticas ligadas",
    oQue: "Atualização quase sempre conserta falha de segurança.",
    porque: "Depois do conserto, a falha fica conhecida.",
    impacto: "Você deixa de ser alvo fácil.",
    como: "Ligue a atualização automática. No computador, não adie o reinício.",
    prioridade: 2,
  },
  {
    id: "pin-chip",
    titulo: "Coloque senha no chip do celular",
    oQue: "Um código de quatro números, pedido quando o chip é ligado.",
    porque: "Sem ele, um ladrão usa seu chip em outro celular e recebe seus SMS.",
    impacto: "Celular roubado não vira chave do seu banco.",
    como: "Android: Configurações → Segurança → Bloqueio do cartão SIM. iPhone: Ajustes → Celular → PIN do SIM. Troque o código padrão e anote: três erros bloqueiam o chip.",
    prioridade: 2,
  },
  {
    id: "pix-limite",
    titulo: "Baixe o limite do PIX à noite",
    oQue: "No app do banco, dá para ter um limite menor à noite.",
    porque: "Golpes e roubos de celular acontecem muito à noite.",
    impacto: "O prejuízo fica menor. Subir o limite leva algumas horas.",
    como: "Procure “limites” e baixe o da noite.",
    prioridade: 2,
  },
];

export function Checklist() {
  const [feitos, setFeitos] = useState<Set<string>>(new Set());

  const alternar = (id: string) =>
    setFeitos((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });

  const prioritarios = ITENS.filter((i) => i.prioridade === 1);
  const demais = ITENS.filter((i) => i.prioridade === 2);

  const Bloco = ({ itens }: { itens: Item[] }) => (
    <ul className="space-y-4">
      {itens.map((item) => {
        const feito = feitos.has(item.id);
        return (
          <li
            key={item.id}
            className={`rounded-sm border transition-colors duration-200 ${
              feito
                ? "border-menta/40 bg-menta-900/40"
                : "border-chumbo-linha bg-chumbo-painel"
            }`}
          >
            <div className="flex gap-4 p-5">
              <input
                type="checkbox"
                id={`item-${item.id}`}
                checked={feito}
                onChange={() => alternar(item.id)}
                className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-menta"
              />
              <div className="min-w-0">
                <label
                  htmlFor={`item-${item.id}`}
                  className="cursor-pointer font-display text-lg font-semibold leading-snug text-balance"
                >
                  {item.titulo}
                </label>

                <p className="mt-2.5 text-body leading-relaxed text-papel-2 text-pretty">
                  {item.oQue}
                </p>

                <div className="mt-4 space-y-3 border-t border-chumbo-linha pt-4">
                  <div>
                    <p className="etiqueta">Por quê</p>
                    <p className="mt-1 text-sm leading-relaxed text-papel-2">
                      {item.porque}
                    </p>
                  </div>
                  <div>
                    <p className="etiqueta-risco">
                      O que evita
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-papel-2">
                      {item.impacto}
                    </p>
                  </div>
                  <div>
                    <p className="etiqueta">Como fazer</p>
                    <p className="mt-1 text-sm leading-relaxed text-papel-3">
                      {item.como}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-5 mb-8 border-b border-chumbo-linha bg-chumbo/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <p className="font-display text-sm text-papel-2" aria-live="polite">
          <span className="text-menta tabular-nums">{feitos.size}</span>
          <span className="text-papel-3"> de {ITENS.length} marcados</span>
        </p>
        <p className="mt-1 text-xs leading-relaxed text-papel-3">
          A marcação some ao fechar a página. Nada é gravado.
        </p>
      </div>

      <h2 className="font-display text-xl font-semibold">
        Comece por estes quatro
      </h2>
      <p className="mt-2 max-w-2xl text-body text-papel-2">
        Se só der para fazer um hoje, faça o primeiro.
      </p>
      <div className="mt-6">
        <Bloco itens={prioritarios} />
      </div>

      <h2 className="mt-14 font-display text-xl font-semibold">
        Depois, com calma
      </h2>
      <p className="mt-2 max-w-2xl text-body text-papel-2">
        Também importam, mas podem esperar.
      </p>
      <div className="mt-6">
        <Bloco itens={demais} />
      </div>
    </div>
  );
}
