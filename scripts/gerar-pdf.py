#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Converte um arquivo Markdown em PDF formatado.

    python scripts/gerar-pdf.py entrada.md saida.pdf "Título" "Subtítulo"

Escrito à mão em cima do reportlab em vez de usar uma biblioteca de conversão
porque o ambiente não tem nenhuma instalada, e porque o controle fino sobre
tabelas e quebras de página importa num documento que vai ser impresso e
entregue.

Suporta o subconjunto de Markdown que o relatório usa: títulos de 1 a 3 níveis,
parágrafos, listas com marcador, listas numeradas, tabelas, blocos de código,
citações, linha horizontal, e as marcações inline de negrito, itálico e código.

As cores vêm da identidade CIFRA, mas adaptadas para papel: fundo branco e
tinta escura, com o petróleo e a menta aparecendo só como acento. Ler no papel
é diferente de ler na tela.
"""
import re
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)

# ── Paleta ────────────────────────────────────────────────────────────────
CHUMBO = colors.HexColor("#1B1D21")
PETROLEO = colors.HexColor("#164752")
PETROLEO_CLARO = colors.HexColor("#1F6478")
MENTA = colors.HexColor("#0E7A5A")   # escurecida: a menta original não tem
                                     # contraste suficiente sobre branco
CINZA = colors.HexColor("#5A6068")
CINZA_CLARO = colors.HexColor("#E8EBEA")
CINZA_LINHA = colors.HexColor("#C9CFCE")

MARGEM = 2.0 * cm


def estilos():
    base = getSampleStyleSheet()
    s = {}

    s["titulo"] = ParagraphStyle(
        "titulo", parent=base["Title"], fontName="Helvetica-Bold",
        fontSize=26, leading=31, textColor=PETROLEO, spaceAfter=6, alignment=TA_CENTER,
    )
    s["subtitulo"] = ParagraphStyle(
        "subtitulo", parent=base["Normal"], fontName="Helvetica",
        fontSize=12.5, leading=17, textColor=CINZA, alignment=TA_CENTER, spaceAfter=4,
    )
    s["h1"] = ParagraphStyle(
        "h1", parent=base["Heading1"], fontName="Helvetica-Bold",
        fontSize=17, leading=21, textColor=PETROLEO, spaceBefore=20, spaceAfter=9,
    )
    s["h2"] = ParagraphStyle(
        "h2", parent=base["Heading2"], fontName="Helvetica-Bold",
        fontSize=13.5, leading=17, textColor=PETROLEO_CLARO, spaceBefore=15, spaceAfter=6,
    )
    s["h3"] = ParagraphStyle(
        "h3", parent=base["Heading3"], fontName="Helvetica-Bold",
        fontSize=11.5, leading=15, textColor=CHUMBO, spaceBefore=11, spaceAfter=4,
    )
    s["corpo"] = ParagraphStyle(
        "corpo", parent=base["Normal"], fontName="Helvetica",
        fontSize=10, leading=15, textColor=CHUMBO, alignment=TA_JUSTIFY, spaceAfter=8,
    )
    s["item"] = ParagraphStyle(
        "item", parent=s["corpo"], spaceAfter=3, alignment=TA_JUSTIFY,
    )
    s["celula"] = ParagraphStyle(
        "celula", parent=base["Normal"], fontName="Helvetica",
        fontSize=8.6, leading=11.5, textColor=CHUMBO,
    )
    s["celula_cab"] = ParagraphStyle(
        "celula_cab", parent=s["celula"], fontName="Helvetica-Bold",
        textColor=colors.white,
    )
    s["codigo"] = ParagraphStyle(
        "codigo", parent=base["Code"], fontName="Courier",
        fontSize=8.3, leading=11, textColor=CHUMBO,
        backColor=CINZA_CLARO, borderPadding=6, spaceBefore=4, spaceAfter=9,
    )
    s["citacao"] = ParagraphStyle(
        "citacao", parent=s["corpo"], leftIndent=14, textColor=CINZA,
        fontName="Helvetica-Oblique", borderPadding=0, spaceBefore=4,
    )
    return s


def escapar(texto):
    """Escapa o que o mini-HTML do reportlab interpretaria como marcação."""
    return texto.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(texto):
    """Converte marcação inline de Markdown para as tags do reportlab.

    A ordem importa: o código é extraído primeiro e devolvido no fim, para que
    um trecho como `**` dentro de crases não vire negrito.
    """
    texto = escapar(texto)

    guardados = []

    def guardar(m):
        guardados.append(m.group(1))
        return f"\x00{len(guardados) - 1}\x00"

    texto = re.sub(r"`([^`]+)`", guardar, texto)

    texto = re.sub(r"\*\*\*(.+?)\*\*\*", r"<b><i>\1</i></b>", texto)
    texto = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", texto)
    texto = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<i>\1</i>", texto)
    # Links: mantém só o rótulo, já que o documento é para papel.
    texto = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", texto)

    def devolver(m):
        codigo = guardados[int(m.group(1))]
        return f'<font face="Courier" size="8.7" color="#0E7A5A">{codigo}</font>'

    return re.sub(r"\x00(\d+)\x00", devolver, texto)


def montar_tabela(linhas, s, largura):
    """Monta uma tabela do Markdown, distribuindo a largura pelas colunas."""
    def celulas(linha):
        return [c.strip() for c in linha.strip().strip("|").split("|")]

    cabecalho = celulas(linhas[0])
    corpo = [celulas(l) for l in linhas[2:] if l.strip()]
    n = len(cabecalho)

    dados = [[Paragraph(inline(c), s["celula_cab"]) for c in cabecalho]]
    for linha in corpo:
        linha = (linha + [""] * n)[:n]
        dados.append([Paragraph(inline(c), s["celula"]) for c in linha])

    # A primeira coluna costuma ser o nome da tecnologia (curto) e a última a
    # descrição (longa), então damos mais espaço para o fim da tabela.
    if n == 2:
        pesos = [0.32, 0.68]
    elif n == 3:
        pesos = [0.26, 0.14, 0.60]
    elif n == 4:
        pesos = [0.22, 0.13, 0.35, 0.30]
    else:
        pesos = [1.0 / n] * n

    tabela = Table(dados, colWidths=[p * largura for p in pesos], repeatRows=1)
    tabela.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PETROLEO),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.4, CINZA_LINHA),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F5F7F6")]),
    ]))
    return tabela


def converter(md, s, largura):
    """Percorre o Markdown linha a linha e devolve a lista de flowables."""
    fluxo = []
    linhas = md.split("\n")
    i = 0

    while i < len(linhas):
        linha = linhas[i]
        crua = linha.rstrip()

        # Bloco de código
        if crua.startswith("```"):
            i += 1
            buffer = []
            while i < len(linhas) and not linhas[i].startswith("```"):
                buffer.append(linhas[i])
                i += 1
            i += 1
            if buffer:
                fluxo.append(Preformatted("\n".join(buffer), s["codigo"]))
            continue

        # Tabela
        if crua.startswith("|") and i + 1 < len(linhas) and re.match(r"^\|[\s:|-]+\|?$", linhas[i + 1].strip()):
            bloco = []
            while i < len(linhas) and linhas[i].strip().startswith("|"):
                bloco.append(linhas[i])
                i += 1
            fluxo.append(Spacer(1, 3))
            fluxo.append(montar_tabela(bloco, s, largura))
            fluxo.append(Spacer(1, 11))
            continue

        # Títulos
        m = re.match(r"^(#{1,4})\s+(.*)$", crua)
        if m:
            nivel, texto = len(m.group(1)), m.group(2)
            if nivel == 1:
                fluxo.append(PageBreak())
                fluxo.append(Paragraph(inline(texto), s["h1"]))
                fluxo.append(HRFlowable(width="100%", thickness=1.1, color=MENTA, spaceAfter=9))
            else:
                estilo = {2: "h2", 3: "h3"}.get(nivel, "h3")
                fluxo.append(Paragraph(inline(texto), s[estilo]))
            i += 1
            continue

        # Linha horizontal
        if re.match(r"^(-{3,}|\*{3,}|_{3,})$", crua.strip()):
            fluxo.append(Spacer(1, 5))
            fluxo.append(HRFlowable(width="100%", thickness=0.5, color=CINZA_LINHA))
            fluxo.append(Spacer(1, 7))
            i += 1
            continue

        # Citação
        if crua.startswith(">"):
            buffer = []
            while i < len(linhas) and linhas[i].startswith(">"):
                buffer.append(linhas[i].lstrip("> ").rstrip())
                i += 1
            fluxo.append(Paragraph(inline(" ".join(buffer)), s["citacao"]))
            continue

        # Listas
        if re.match(r"^\s*[-*+]\s+", crua) or re.match(r"^\s*\d+\.\s+", crua):
            numerada = bool(re.match(r"^\s*\d+\.\s+", crua))
            itens = []
            while i < len(linhas):
                atual = linhas[i].rstrip()
                m2 = re.match(r"^\s*(?:[-*+]|\d+\.)\s+(.*)$", atual)
                if not m2:
                    # continuação indentada do item anterior
                    if atual.strip() and atual.startswith(("  ", "\t")) and itens:
                        itens[-1] += " " + atual.strip()
                        i += 1
                        continue
                    break
                itens.append(m2.group(1))
                i += 1
            fluxo.append(ListFlowable(
                [ListItem(Paragraph(inline(t), s["item"]), leftIndent=16) for t in itens],
                bulletType="1" if numerada else "bullet",
                bulletFontSize=8, bulletColor=MENTA, leftIndent=15, spaceAfter=9,
            ))
            continue

        # Linha em branco
        if not crua.strip():
            i += 1
            continue

        # Parágrafo: junta as linhas seguintes até uma quebra
        buffer = [crua]
        i += 1
        while i < len(linhas):
            prox = linhas[i].rstrip()
            if (not prox.strip() or prox.startswith(("#", "|", "```", ">", "---"))
                    or re.match(r"^\s*(?:[-*+]|\d+\.)\s+", prox)):
                break
            buffer.append(prox)
            i += 1
        fluxo.append(Paragraph(inline(" ".join(buffer)), s["corpo"]))

    return fluxo


def gerar(md, saida, titulo, subtitulo):
    doc = BaseDocTemplate(
        saida, pagesize=A4,
        leftMargin=MARGEM, rightMargin=MARGEM,
        topMargin=MARGEM, bottomMargin=MARGEM + 0.5 * cm,
        title=titulo, author="Projeto CIFRA",
    )
    largura = doc.width

    def rodape(canvas, documento):
        if documento.page == 1:   # a capa nao leva rodape
            return
        canvas.saveState()
        canvas.setStrokeColor(CINZA_LINHA)
        canvas.setLineWidth(0.4)
        canvas.line(MARGEM, MARGEM - 0.1 * cm, A4[0] - MARGEM, MARGEM - 0.1 * cm)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(CINZA)
        canvas.drawString(MARGEM, MARGEM - 0.65 * cm, titulo)
        canvas.drawRightString(A4[0] - MARGEM, MARGEM - 0.65 * cm, f"Página {documento.page}")
        canvas.restoreState()

    frame = Frame(MARGEM, MARGEM + 0.5 * cm, largura, doc.height, id="corpo")
    doc.addPageTemplates([PageTemplate(id="padrao", frames=[frame], onPage=rodape)])

    s = estilos()

    capa = [
        Spacer(1, 4.5 * cm),
        Paragraph(titulo, s["titulo"]),
        Spacer(1, 0.3 * cm),
        HRFlowable(width="42%", thickness=1.6, color=MENTA, hAlign="CENTER"),
        Spacer(1, 0.5 * cm),
        Paragraph(subtitulo, s["subtitulo"]),
        PageBreak(),
    ]

    fluxo = capa + converter(md, s, largura)
    doc.build(fluxo)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    entrada, saida = sys.argv[1], sys.argv[2]
    titulo = sys.argv[3] if len(sys.argv) > 3 else "Relatório"
    subtitulo = sys.argv[4] if len(sys.argv) > 4 else ""

    with open(entrada, encoding="utf-8") as f:
        conteudo = f.read()

    # O título da capa já apresenta o documento; um "# " logo no começo
    # geraria uma página quase vazia antes do conteúdo.
    conteudo = re.sub(r"\A\s*#\s+.*?\n", "", conteudo, count=1)

    gerar(conteudo, saida, titulo, subtitulo)
    print(f"PDF gerado: {saida}")
