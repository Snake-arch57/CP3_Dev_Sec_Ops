/**
 * Cria um usuário direto no banco, sem precisar estar logado.
 *
 *   node scripts/criar-usuario.js <usuario> "<Nome>" <senha> [admin|funcionario] ["Setor"]
 *
 * Exemplos:
 *   node scripts/criar-usuario.js vinicius "Vinicius" MinhaSenha123 admin
 *   node scripts/criar-usuario.js joao "João Silva" Senha12345 funcionario "Caixa"
 *   node scripts/criar-usuario.js ana "Ana Souza" Senha12345 funcionario "TI"
 *
 * Por que isto existe: a coluna `passwordHash` guarda um hash bcrypt, então
 * inserir uma linha à mão pelo Supabase não funciona — o login compararia a
 * senha digitada contra um texto que não é hash e falharia sempre. Este script
 * usa a MESMA função de hash da aplicação (`bcrypt`, 10 rounds), então o
 * usuário criado aqui entra normalmente pela tela de login.
 *
 * A rota /admin do jogo continua sendo o caminho normal para cadastrar gente.
 * Isto aqui é para quando você não consegue chegar lá — por exemplo, se
 * ninguém mais lembra a senha do único admin.
 *
 * Roda contra o banco que estiver em apps/api/.env (DATABASE_URL).
 */
const path = require("path");
const fs = require("fs");

const RAIZ_API = path.resolve(__dirname, "..", "apps", "api");

// Carrega o .env sem depender de dotenv.
const caminhoEnv = path.join(RAIZ_API, ".env");
if (!fs.existsSync(caminhoEnv)) {
  console.error(`Não achei ${caminhoEnv}. Sem DATABASE_URL não dá para conectar.`);
  process.exit(1);
}
for (const linha of fs.readFileSync(caminhoEnv, "utf8").split("\n")) {
  const m = linha.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}

const [usuario, nome, senha, papelArg, setorArg] = process.argv.slice(2);

if (!usuario || !nome || !senha) {
  console.error(`
Uso:
  node scripts/criar-usuario.js <usuario> "<Nome>" <senha> [admin|funcionario] ["Setor"]

Exemplos:
  node scripts/criar-usuario.js vinicius "Vinicius" MinhaSenha123 admin
  node scripts/criar-usuario.js joao "João Silva" Senha12345 funcionario "Caixa"

O papel é opcional (padrão: funcionario). O setor é texto livre: escreva o que
quiser ("TI", "Caixa", "Estoque", "Vendas"...). Sem setor, a pessoa aparece
como "Sem setor" no ranking.
A senha precisa ter pelo menos 8 caracteres (mesma regra da aplicação).
`);
  process.exit(1);
}

if (senha.length < 8) {
  console.error("A senha precisa ter pelo menos 8 caracteres.");
  process.exit(1);
}

const papel = (papelArg ?? "funcionario").toLowerCase();
if (!["admin", "funcionario"].includes(papel)) {
  console.error(`Papel inválido: "${papelArg}". Use "admin" ou "funcionario".`);
  process.exit(1);
}


/**
 * Traduz falha de conexão em instrução acionável.
 *
 * O erro cru do Prisma ("Can't reach database server at …:6543") descreve o
 * sintoma e não a causa, e a causa mais comum aqui não é o banco: é a rede
 * bloqueando a porta. Redes de empresa, faculdade e alguns provedores liberam
 * 80 e 443 e barram 5432/6543, então o site e a API funcionam normalmente
 * enquanto a conexão direta falha — o que engana, porque tudo "parece no ar".
 */
function explicarFalha(erro) {
  const msg = String(erro?.message ?? erro);
  const semAlcance = /Can't reach database server|ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(msg);

  if (!semAlcance) return null;

  return `
Não consegui alcançar o banco de dados.

Antes de suspeitar do Supabase, vale saber que a causa mais comum é a REDE:
muitas redes bloqueiam as portas de banco (5432 e 6543) e liberam só as de
web (80 e 443). Nesse caso o site e a API continuam funcionando, porque falam
por HTTPS — só a conexão direta daqui é barrada.

Como confirmar, no PowerShell:
  Test-NetConnection aws-0-us-east-1.pooler.supabase.com -Port 6543

  TcpTestSucceeded : False  -> a rede está bloqueando; use outra (o roteador
                              de dados do celular resolve na hora)
  TcpTestSucceeded : True   -> a rede está ok, e aí sim vale conferir se o
                              projeto no Supabase está ativo, e o DATABASE_URL

Alternativa sem depender da rede: entre no jogo como admin e crie a conta pela
tela /admin, que passa pela API por HTTPS. A senha sai gerada, e a pessoa troca
no primeiro acesso.
`;
}

(async () => {
  const { PrismaClient } = require(path.join(RAIZ_API, "node_modules", "@prisma", "client"));
  const bcrypt = require(path.join(RAIZ_API, "node_modules", "bcryptjs"));

  const prisma = new PrismaClient();

  try {
    const login = usuario.toLowerCase();

    const jaExiste = await prisma.user.findUnique({ where: { username: login } });
    if (jaExiste) {
      console.error(`Já existe um usuário "${login}". Escolha outro nome.`);
      process.exit(1);
    }

    const setor = (setorArg ?? "").trim() || null;

    const criado = await prisma.user.create({
      data: {
        username: login,
        displayName: nome,
        department: setor,
        passwordHash: await bcrypt.hash(senha, 10),
        role: papel === "admin" ? "ADMIN" : "EMPLOYEE",
        // false porque você já escolheu a senha aqui — não faz sentido obrigar
        // a trocar no primeiro login, como acontece nas senhas temporárias que
        // a tela /admin gera.
        mustChangePassword: false,
      },
      select: { id: true, username: true, displayName: true, department: true, role: true },
    });

    console.log("\nUsuário criado:");
    console.log(`  usuário: ${criado.username}`);
    console.log(`  nome:    ${criado.displayName}`);
    console.log(`  setor:   ${criado.department ?? "(sem setor)"}`);
    console.log(`  papel:   ${criado.role}`);
    console.log("\nEntre em https://cyber-guard-jogo.vercel.app/login com essa senha.\n");
  } catch (erro) {
    console.error("\nFalhou:", erro.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
