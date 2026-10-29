# Plano de Migração — Identidade visual e marca

> **Status: executado em 23/08/2026.** As etapas 1 a 5 foram aplicadas. O que
> ficou de fora está registrado no fim do documento, na seção 9.

Documento de planejamento, mantido como registro do que foi decidido e por quê.

Objetivo: unificar a identidade visual do jogo com a do site, e padronizar o
nome do produto como **Hackudinhos** em toda parte.

---

## 1. Diagnóstico — o que o levantamento mostrou

Três descobertas mudam bastante o tamanho estimado do trabalho.

### O jogo já se chama Hackudinhos

O nome já está aplicado na interface do jogo (`app/layout.tsx`, `Sidebar.tsx`,
`MobileTopBar.tsx`, dicionários de tradução) e — o mais importante — **no
cookie de sessão**:

```
apps/api/src/auth/auth.constants.ts
export const SESSION_COOKIE_NAME = "hackudinhos_session";
```

Ou seja: quem precisa migrar de nome é o **site** e a **infraestrutura**, não o
jogo. E o cookie, que seria o item mais delicado da migração, já está no nome
final. Não encostar nele.

### O jogo não tem uma única cor literal

| Medição em `apps/jogo` (57 arquivos `.tsx`) | Quantidade |
|---|---|
| Usos de token semântico (`bg-surface`, `text-text-muted`…) | 419 |
| Classes de cor literal (`bg-slate-800`, `text-green-500`…) | **0** |
| Valores hex escritos direto no `.tsx` | 86 |

Isso é a diferença entre um mutirão e uma edição pontual. Como todo componente
consome tokens semânticos, **trocar a identidade visual é reescrever os valores
dos tokens num arquivo só** — `apps/jogo/app/globals.css` — sem tocar em
nenhum dos 57 componentes.

Os 86 hex se concentram em quatro arquivos:

| Arquivo | Hex | Situação |
|---|---|---|
| `components/ui/glossary-manual.tsx` | 40 | Estética de pergaminho, deliberada |
| `components/ui/lofi-player.tsx` | 14 | A avaliar |
| `components/ui/language-selector.tsx` | 6 | A avaliar |
| `components/ui/theme-toggle.tsx` | 4 | A avaliar |

### As duas paletas partem de premissas diferentes

| | Site (CIFRA) | Jogo (Hackudinhos) |
|---|---|---|
| Versão do Tailwind | 3 (config em `.ts`) | 4 (config em CSS, `@theme`) |
| Temas | Escuro fixo | **Claro e escuro** |
| Nomes dos tokens | Por cor (`chumbo`, `menta`) | Por função (`bg`, `primary`) |
| Cor de erro | Não existe | `--color-danger` |

As duas últimas linhas são as que geram decisão de verdade, e estão na seção 5.

---

## 2. Parte A — Identidade visual

### A.1 Mapeamento de tokens

A paleta do site, aplicada aos tokens do jogo:

| Token do jogo | Valor proposto | Origem no site |
|---|---|---|
| `--color-bg` | `#1B1D21` | chumbo |
| `--color-surface` | `#2E3138` | chumbo.painel |
| `--color-surface-2` | `#383C44` | chumbo.linha |
| `--color-surface-3` | `#4A4F59` | chumbo.linhaForte |
| `--color-border` | `#4A4F59` | chumbo.linhaForte |
| `--color-primary` | `#3ED6A4` | menta |
| `--color-primary-hover` | `#61DDB4` | menta.400 |
| `--color-success` | `#3ED6A4` | menta |
| `--color-warning` | `#F2A93D` | âmbar |
| `--color-danger` | *a definir* | — (ver seção 5) |
| `--color-text` | `#F2F4F3` | papel |
| `--color-text-muted` | `#A9AFAE` | papel.2 |

O petróleo (`#164752`) não entra como tinta: no site ele é campo institucional,
usado só como fundo. Serviria como fundo de destaque em painéis do jogo.

### A.2 Passos

1. **Reescrever os tokens** em `apps/jogo/app/globals.css`, no bloco do tema
   escuro. É a mudança central, e são cerca de 12 linhas.
2. **Resolver o tema claro** conforme a decisão da seção 5.
3. **Avaliar os quatro arquivos com hex.** O `glossary-manual` provavelmente
   deve ser preservado como está — a estética de pergaminho é uma peça de
   design intencional, não descuido. Os outros três merecem análise caso a caso.
4. **Conferir contraste.** O site foi construído com razões de contraste
   verificadas (papel sobre chumbo = 15,4:1; menta = 9,2:1; âmbar = 8,5:1). Os
   mesmos pares precisam ser reconferidos no contexto do jogo, porque lá há
   superfícies sobrepostas que o site não tem.
5. **Revisar tela a tela.** São 15 telas; a passagem visual é o que pega o que
   a medição não pega.

### A.3 Por que isso não é uma reescrita

Vale registrar, porque a intuição diz o contrário: os componentes não mudam. Um
`<div className="bg-surface text-text">` continua idêntico — só o valor por trás
de `surface` e `text` é outro. É exatamente o retorno de ter usado tokens
semânticos desde o começo.

---

## 3. Parte B — Renomeação para Hackudinhos

Os nomes existentes se dividem em três categorias, e a diferença entre elas é o
que evita quebrar coisa em produção.

### Categoria 1 — Nome de exibição (seguro)

Texto que o usuário lê. Trocar não quebra nada.

| Onde | O que tem |
|---|---|
| `apps/site/src/app/layout.tsx` | Título e descrição das páginas |
| `apps/site/src/components/layout/Marca.tsx` | A marca no cabeçalho |
| `apps/site/src/components/layout/Footer.tsx` | Rodapé |
| `apps/site/src/app/sobre/`, `/contato/`, `/treinamento/` | Corpo de texto |
| `README.md` | Documentação |
| `Contexto Claude/contexto.md` | Documentação interna |

### Categoria 2 — Identificador interno (contido)

Não aparece para o usuário, mas está no código. Trocar exige rodar o build.

| Onde | O que tem | Observação |
|---|---|---|
| `package.json` (raiz) | `"name": "cifra"` | Nome do workspace |
| `Jogo/project.godot` | `config/name="CyberGuard"` | Protótipo, fora do ar |
| `deploy/*.service` | Nomes de serviço systemd | **Legado** — ver seção 6 |

### Categoria 3 — Identificador externo (quebra se mudar)

Aqui mora o risco. São nomes dos quais outras coisas dependem.

| Item | Valor atual | Consequência de mudar |
|---|---|---|
| Projeto Vercel da API | `cyber-guard-api` | Muda a URL pública |
| Projeto Vercel do jogo | `cyber-guard-jogo` | Muda a URL pública |
| Projeto Vercel do site | `cyber-guard` | Muda a URL pública |
| `apps/jogo/next.config.ts` | `API_PRODUCAO = "https://cyber-guard-api.vercel.app"` | **O jogo perde a API** |
| Cookie de sessão | `hackudinhos_session` | **Já está correto — não mexer** |

O item crítico é a relação entre os dois últimos: o jogo tem a URL da API
escrita no código como fallback. Renomear o projeto da API na Vercel sem
atualizar esse arquivo **derruba o login em produção**.

### B.1 Ordem segura para a renomeação externa

Se os projetos da Vercel forem renomeados, esta ordem evita janela de quebra:

1. Renomear o projeto da **API** na Vercel e anotar a URL nova
2. A URL antiga continua respondendo por um tempo — confirmar isso antes de
   seguir
3. Atualizar `API_PRODUCAO` em `apps/jogo/next.config.ts` e a variável
   `API_ORIGIN` no projeto do jogo
4. Publicar o jogo e rodar `node scripts/verificar-api.js <url-nova>`
5. Só então renomear os projetos do **jogo** e do **site**, que ninguém
   referencia por código

**Alternativa mais simples:** não renomear nada na Vercel. As URLs não precisam
casar com o nome do produto, e é possível apontar um domínio próprio para os
projetos depois — o que resolve a aparência sem mexer em identificador nenhum.

---

## 4. Ordem de execução sugerida

As duas partes são independentes e podem ser feitas em qualquer ordem, mas
convém separá-las em commits distintos: se algo quebrar, saber se foi a cor ou
o nome economiza tempo.

| Etapa | Escopo | Risco |
|---|---|---|
| 1 | Tokens de cor do jogo (`globals.css`) | Baixo |
| 2 | Revisão visual das 15 telas | Baixo |
| 3 | Arquivos com hex, caso a caso | Baixo |
| 4 | Nomes de exibição no site | Baixo |
| 5 | Identificadores internos | Médio (exige build) |
| 6 | Renomeação na Vercel, se for o caso | **Alto** |

Etapas 1 a 5 são seguras e locais. A 6 mexe em produção e merece ser feita
separada, num momento sem demonstração marcada.

---

## 5. Decisões que precisam ser tomadas antes

Estas três não têm resposta técnica única — dependem do que se quer.

### 5.1 O jogo mantém o tema claro?

O jogo hoje tem tema claro e escuro, com um seletor
(`components/ui/theme-toggle.tsx`). O site é escuro fixo, e a paleta CIFRA foi
desenhada só para fundo escuro — não existe versão clara dela.

- **Manter os dois temas:** exige criar uma variante clara da identidade CIFRA,
  o que é trabalho de design, não de código.
- **Só escuro, como o site:** unifica de verdade e é mais rápido, mas remove um
  recurso que já existe e funciona.

### 5.2 Qual será a cor de erro?

O site não tem cor de erro. Ele usa o âmbar para risco, sempre em bloco
preenchido. O jogo tem `--color-danger` (hoje `#d97a68`) e usa em situações que
são genuinamente erro — resposta errada, falha de operação.

Usar âmbar para as duas coisas apagaria a diferença entre "atenção" e "errou".
O provável é precisar de um vermelho novo, harmonizado com a paleta e com
contraste verificado sobre o chumbo.

### 5.3 As URLs mudam?

Ver a alternativa na seção B.1. Renomear projeto na Vercel é a única etapa de
risco alto do plano inteiro, e é opcional.

---

## 6. Achados laterais

- **`deploy/` NÃO é legado — corrigido em 23/08/2026.** Este documento afirmava
  que a pasta continha artefatos de uma hospedagem desativada. A verificação
  mostrou o contrário: `play.mizanis.com.br` responde com `Server: nginx` e
  serve o jogo. É uma hospedagem paralela **ativa**, em servidor próprio, com
  versão anterior à da Vercel.
  O sintoma apareceu na prática: o botão de treinamento do site levava para o
  servidor próprio, que exibia a identidade antiga, enquanto o domínio da Vercel
  já mostrava a nova. O site foi reapontado; **o servidor próprio segue no ar** e
  precisa ser desativado ou atualizado, sob pena de as duas versões divergirem
  de novo.
- **O protótipo Godot** tem `config/name="CyberGuard"`. Como está fora do ar,
  entra junto por consistência, sem urgência.
- **Nenhuma tabela ou coluna do banco carrega nome de marca**, o que significa
  que a renomeação não toca em dados nem exige migração.

---

## 7. Como verificar que deu certo

| Verificação | Como |
|---|---|
| Build dos três apps | `pnpm run build` |
| Tipos | `pnpm run typecheck` |
| Testes das regras de jogo | `pnpm run test` |
| API roteando | `node scripts/verificar-api.js` |
| Caminho da demo | `node scripts/verificar-api.js https://<url-do-jogo>` |
| Sobrou nome antigo? | `grep -ri "cifra\|cyberguard\|cyber-guard" --exclude-dir=node_modules --exclude-dir=.git .` |
| Contraste | Conferir os pares texto/fundo contra WCAG AA (4,5:1) |

A busca final por nomes antigos é o que fecha a migração: enquanto ela retornar
algo fora de `docs/` e do histórico, ainda há ponta solta.

---

## 8. Resumo do esforço

| Parte | Arquivos afetados | Observação |
|---|---|---|
| Identidade visual | 1 principal + até 4 a avaliar | Concentrado no `globals.css` |
| Nomes de exibição | ~8 | Todos no site |
| Identificadores internos | 3 | Build necessário |
| Infraestrutura (opcional) | 1 + painel Vercel | Única etapa de risco alto |

O trabalho é menor do que a descrição sugere, e a razão é estrutural: o jogo foi
construído com tokens semânticos, e o nome final já está aplicado nele. O que
resta é o site e a decisão sobre tema claro e cor de erro.


---

## 9. O que foi executado

Aplicado em 23/08/2026, após a chegada do manual de identidade (v2, paleta v1).

### Identidade visual

- Tokens de cor do jogo reescritos em `apps/jogo/app/globals.css` com a paleta
  do manual: chumbo no fundo, papel no texto, menta na ação, âmbar no alerta,
  petróleo como campo institucional (token novo `--color-campo`).
- **Escuro passou a ser o padrão.** O manual define o chumbo como "o fundo de
  tudo" e a paleta só existe para fundo escuro. O tema claro continua
  disponível para quem escolher, como inversão derivada.
- **Tipografia trocada** para Barlow (corpo) e Barlow Condensed (títulos),
  conforme a seção 05 do manual. O corpo passou de 18px para 16px — a fonte
  anterior era estreita e pedia o tamanho maior.
- `theme-toggle.tsx` usava as duas cores da paleta antiga como cor de cortina;
  passou a usar papel e chumbo.

### Decisão sobre a cor de erro

O manual não define vermelho — resolve risco com âmbar em bloco cheio. Mas isso
serve para "atenção", não para "você errou", e o jogo precisa dos dois. Foi
escolhido `#F28B80`, verificado em contraste: **7,06** sobre o chumbo e **5,44**
sobre o painel. O primeiro candidato (`#E8695E`) foi descartado por dar 4,10
sobre o painel, abaixo do mínimo AA.

Todos os pares texto/fundo dos dois temas foram verificados contra WCAG AA.

### Renomeação

Treze ocorrências no código-fonte do site, mais `package.json`, `README.md`,
`Jogo/project.godot` e os comentários do `tailwind.config.ts`.

A troca exigiu cuidado de concordância: "a CIFRA é um projeto" virou "os
Hackudinhos são um projeto" — o nome mudou de feminino singular para masculino
plural, e o verbo vai junto. Uma substituição cega teria deixado o texto errado.

O token de easing `ease-cifra` virou `ease-marca`, por ser nome de marca dentro
de um identificador técnico.

### O que ficou de fora, e por quê

| Item | Motivo |
|---|---|
| `language-selector.tsx` (6 hex) | São bandeiras do Brasil e dos EUA — cor de bandeira não se altera |
| `glossary-manual.tsx` (40 hex) | Estética de pergaminho, deliberada; ver decisão pendente abaixo |
| `lofi-player.tsx` (14 hex) | Tons sépia de player retrô; mesma decisão |
| 37 usos de `font-pixel` | Press Start 2P mantida em HUD, placar e minijogos |
| Renomear projetos na Vercel | Etapa de risco alto, opcional — as URLs seguem `cyber-guard-*` |

### Decisões que continuam abertas

1. **Os elementos de arcade ficam?** A Press Start 2P e as peças com estética
   própria (manual de pergaminho, player sépia) mantêm o jogo com cara de jogo,
   mas destoam da identidade institucional. Unificar tudo tornaria o jogo
   visualmente idêntico ao site — o que é ganho de marca e perda de
   personalidade lúdica. É escolha de produto, não técnica.
2. **As URLs da Vercel.** Continuam `cyber-guard-*`. Ver seção B.1 para a ordem
   segura, caso se decida mudar.
