import { AtSign, Link2, FileSearch, QrCode, Database, Phone } from "lucide-react";
import type { ToolRegistryEntry } from "./types";
import { SenderAddressTool } from "./tools/SenderAddressTool";
import { LinkHoverTool } from "./tools/LinkHoverTool";
import { AttachmentAnalysisTool } from "./tools/AttachmentAnalysisTool";
import { QrCodeTool } from "./tools/QrCodeTool";
import { InternalDbLookupTool } from "./tools/InternalDbLookupTool";
import { OutOfBandVerifyTool } from "./tools/OutOfBandVerifyTool";

/**
 * Ferramentas da bancada de investigação.
 *
 * Eram onze; ficaram as seis listadas em `FERRAMENTAS_VISIVEIS`
 * (`@repo/shared/engine`), que é a fonte da regra — este arquivo só dá rosto a
 * elas. O motivo de cada remoção está documentado lá.
 *
 * Os rótulos viraram perguntas. "Endereço do remetente" descreve um campo
 * técnico; "Quem mandou?" descreve a dúvida que a pessoa já tem ao abrir o
 * e-mail. A ferramenta passa a responder uma pergunta em vez de exigir que se
 * saiba o nome da coisa a conferir.
 *
 * O custo em segundos também saiu: investigar não desconta mais tempo nem
 * pontos. Conferir é justamente o comportamento que o jogo quer ensinar.
 */
export const INVESTIGATION_TOOL_REGISTRY: ToolRegistryEntry[] = [
  {
    id: "sender_address",
    label: "Quem mandou?",
    icon: AtSign,
    Component: SenderAddressTool,
  },
  {
    id: "internal_db_lookup",
    label: "A empresa conhece quem mandou?",
    icon: Database,
    Component: InternalDbLookupTool,
  },
  {
    id: "link_hover",
    label: "Para onde o link leva?",
    icon: Link2,
    Component: LinkHoverTool,
  },
  {
    id: "attachment_analysis",
    label: "O anexo é seguro?",
    icon: FileSearch,
    Component: AttachmentAnalysisTool,
  },
  {
    id: "qr_preview",
    label: "Para onde o QR Code leva?",
    icon: QrCode,
    Component: QrCodeTool,
  },
  {
    id: "out_of_band_verify",
    label: "Confirmar com a pessoa",
    icon: Phone,
    Component: OutOfBandVerifyTool,
  },
];
