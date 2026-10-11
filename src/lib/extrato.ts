import AsyncStorage from "@react-native-async-storage/async-storage";

export const CATEGORIAS = [
  "alimentação",
  "transporte",
  "moradia",
  "saúde",
  "educação",
  "lazer",
  "salário",
  "outros",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type TipoEntrada = "receita" | "despesa";

export interface Entrada {
  id: string;
  tipo: TipoEntrada;
  valor: number;
  descricao: string;
  categoria: Categoria;
  data: string; // ISO
}

export interface Totais {
  saldo: number;
  ganhoTotal: number;
  gastoTotal: number;
}

const CHAVE = "extrato:entradas";

function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// converte registros antigos ("ganho"/"gasto", sem categoria)
function normalizar(e: any): Entrada {
  return {
    ...e,
    tipo:
      e.tipo === "ganho" ? "receita" : e.tipo === "gasto" ? "despesa" : e.tipo,
    categoria: e.categoria ?? "outros",
  };
}

async function carregar(): Promise<Entrada[]> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as any[]).map(normalizar) : [];
  } catch {
    return [];
  }
}

async function salvar(entradas: Entrada[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(entradas));
}

// "DD/MM/AAAA" -> ISO (com a hora atual); null se a data não existir
export function dataBRparaISO(texto: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return null;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const agora = new Date();
  const data = new Date(
    ano,
    mes - 1,
    dia,
    agora.getHours(),
    agora.getMinutes(),
    agora.getSeconds(),
  );
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }
  return data.toISOString();
}

export function hojeBR(): string {
  return new Date().toLocaleDateString("pt-BR");
}

// retorna a mensagem de erro, ou null se estiver tudo certo
export function validarEntrada(
  d: Partial<Omit<Entrada, "id">>,
): string | null {
  if (!d.descricao || !d.descricao.trim()) return "Informe a descrição.";
  if (typeof d.valor !== "number" || isNaN(d.valor) || d.valor <= 0)
    return "Informe um valor maior que zero.";
  if (d.tipo !== "receita" && d.tipo !== "despesa") return "Informe o tipo.";
  if (!d.categoria || !CATEGORIAS.includes(d.categoria))
    return "Escolha uma categoria.";
  if (!d.data || isNaN(new Date(d.data).getTime()))
    return "Informe uma data válida (DD/MM/AAAA).";
  return null;
}

export async function listarEntradas(): Promise<Entrada[]> {
  return carregar();
}

export async function adicionarEntrada(
  dados: Omit<Entrada, "id">,
): Promise<Entrada> {
  const erro = validarEntrada(dados);
  if (erro) throw new Error(erro);

  const entradas = await carregar();
  const nova: Entrada = {
    ...dados,
    descricao: dados.descricao.trim(),
    id: gerarId(),
  };
  entradas.push(nova);
  await salvar(entradas);
  return nova;
}

export async function removerEntrada(id: string): Promise<void> {
  const entradas = await carregar();
  await salvar(entradas.filter((e) => e.id !== id));
}

export function calcularTotais(entradas: Entrada[]): Totais {
  const ganhoTotal = entradas
    .filter((e) => e.tipo === "receita")
    .reduce((soma, e) => soma + e.valor, 0);
  const gastoTotal = entradas
    .filter((e) => e.tipo === "despesa")
    .reduce((soma, e) => soma + e.valor, 0);
  return { saldo: ganhoTotal - gastoTotal, ganhoTotal, gastoTotal };
}