import {
  adicionarEntrada,
  calcularTotais,
  CATEGORIAS,
  dataBRparaISO,
  hojeBR,
  listarEntradas,
  validarEntrada,
  type Categoria,
  type Entrada,
  type TipoEntrada,
  type Totais,
} from "@/lib/extrato";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import styles from "./style.extrato";

type Props = {
  onTotaisChange: (totais: Totais) => void;
};

const moeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dataHora = (iso: string) => new Date(iso).toLocaleString("pt-BR");
const dataCurta = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");
const rotulo = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export default function Extrato({ onTotaisChange }: Props) {
  const [entradas, setEntradas] = useState<Entrada[]>([]);

  // modal de nova operação
  const [tipoModal, setTipoModal] = useState<TipoEntrada | null>(null);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [dataTexto, setDataTexto] = useState(hojeBR());
  const [erro, setErro] = useState("");

  // modal de detalhes
  const [selecionada, setSelecionada] = useState<Entrada | null>(null);

  async function atualizar() {
    const lista = await listarEntradas();
    setEntradas(lista);
    onTotaisChange(calcularTotais(lista));
  }

  useEffect(() => {
    atualizar();
  }, []);

  function abrirModal(tipo: TipoEntrada) {
    setDataTexto(hojeBR());
    setTipoModal(tipo);
  }

  function fecharModal() {
    setTipoModal(null);
    setValor("");
    setDescricao("");
    setCategoria(null);
    setErro("");
  }

  async function confirmar() {
    const dados = {
      tipo: tipoModal ?? undefined,
      valor: parseFloat(valor.replace(",", ".")),
      descricao,
      categoria: categoria ?? undefined,
      data: dataBRparaISO(dataTexto) ?? undefined,
    };

    const mensagem = validarEntrada(dados);
    if (mensagem) {
      setErro(mensagem);
      return;
    }

    await adicionarEntrada(dados as Omit<Entrada, "id">);
    fecharModal();
    await atualizar();
  }

  async function gerarPdf() {
    const { saldo } = calcularTotais(entradas);
    const linhas = ordenadas
      .map(
        (e) => `
        <tr>
          <td>${e.tipo === "receita" ? "Receita" : "Despesa"}</td>
          <td>${dataHora(e.data)}</td>
          <td>${escapeHtml(e.descricao)}</td>
          <td>${rotulo(e.categoria)}</td>
          <td style="text-align:right">${moeda(e.valor)}</td>
        </tr>`,
      )
      .join("");

    const html = `
      <html>
        <body style="font-family: sans-serif; padding: 24px">
          <h1>Extrato</h1>
          <table style="width:100%; border-collapse: collapse" border="1" cellpadding="6">
            <tr><th>Tipo</th><th>Data/hora</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr>
            ${linhas}
          </table>
          <h3>Saldo atual: ${moeda(saldo)}</h3>
        </body>
      </html>`;

    if (Platform.OS === "web") {
      await Print.printAsync({ html });
      return;
    }

    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
    }
  }

  // mais recentes primeiro (pela data da operação)
  const ordenadas = [...entradas].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <View style={styles.container}>
      <View style={styles.acoes}>
        <Pressable style={styles.botao} onPress={() => abrirModal("receita")}>
          <Text style={styles.botaoTexto}>Adicionar receita</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => abrirModal("despesa")}>
          <Text style={styles.botaoTexto}>Adicionar despesa</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={gerarPdf}>
          <Text style={styles.botaoTexto}>Extrato</Text>
        </Pressable>
      </View>

      <FlatList
        style={styles.lista}
        data={ordenadas}
        keyExtractor={(e) => e.id}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma operação ainda.</Text>
        }
        renderItem={({ item }) => {
          const ehReceita = item.tipo === "receita";
          return (
            <Pressable style={styles.item} onPress={() => setSelecionada(item)}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemDescricao} numberOfLines={1}>
                  {item.descricao}
                </Text>
                <Text style={styles.itemData}>
                  {rotulo(item.categoria)} · {dataCurta(item.data)}
                </Text>
              </View>
              <Text
                style={[
                  styles.itemValor,
                  ehReceita ? styles.ganho : styles.gasto,
                ]}
              >
                {ehReceita ? "+" : "-"} {moeda(item.valor)}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* nova operação */}
      <Modal visible={tipoModal !== null} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>
              {tipoModal === "receita" ? "Nova receita" : "Nova despesa"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              style={styles.input}
              placeholder="Valor (ex: 2000)"
              keyboardType="decimal-pad"
              value={valor}
              onChangeText={setValor}
            />
            <TextInput
              style={styles.input}
              placeholder="Data (DD/MM/AAAA)"
              keyboardType="numbers-and-punctuation"
              value={dataTexto}
              onChangeText={setDataTexto}
            />

            <Text style={styles.rotuloCampo}>Categoria</Text>
            <View style={styles.chips}>
              {CATEGORIAS.map((c) => {
                const ativo = categoria === c;
                return (
                  <Pressable
                    key={c}
                    style={[styles.chip, ativo && styles.chipAtivo]}
                    onPress={() => setCategoria(c)}
                  >
                    <Text
                      style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}
                    >
                      {rotulo(c)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

            <View style={styles.modalAcoes}>
              <Pressable style={styles.botao} onPress={fecharModal}>
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.botao} onPress={confirmar}>
                <Text style={styles.botaoTexto}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* detalhes da operação */}
      <Modal visible={selecionada !== null} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Detalhes da operação</Text>
            {selecionada && (
              <>
                <View style={styles.linhaDetalhe}>
                  <Text style={styles.detalheRotulo}>Descrição</Text>
                  <Text style={styles.detalheValor}>
                    {selecionada.descricao}
                  </Text>
                </View>
                <View style={styles.linhaDetalhe}>
                  <Text style={styles.detalheRotulo}>Valor</Text>
                  <Text
                    style={[
                      styles.detalheValor,
                      selecionada.tipo === "receita"
                        ? styles.ganho
                        : styles.gasto,
                    ]}
                  >
                    {moeda(selecionada.valor)}
                  </Text>
                </View>
                <View style={styles.linhaDetalhe}>
                  <Text style={styles.detalheRotulo}>Tipo</Text>
                  <Text style={styles.detalheValor}>
                    {selecionada.tipo === "receita" ? "Receita" : "Despesa"}
                  </Text>
                </View>
                <View style={styles.linhaDetalhe}>
                  <Text style={styles.detalheRotulo}>Categoria</Text>
                  <Text style={styles.detalheValor}>
                    {rotulo(selecionada.categoria)}
                  </Text>
                </View>
                <View style={styles.linhaDetalhe}>
                  <Text style={styles.detalheRotulo}>Data</Text>
                  <Text style={styles.detalheValor}>
                    {dataHora(selecionada.data)}
                  </Text>
                </View>
              </>
            )}
            <View style={styles.modalAcoes}>
              <Pressable
                style={styles.botao}
                onPress={() => setSelecionada(null)}
              >
                <Text style={styles.botaoTexto}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}