import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    gap: 16,
  },

  // botões
  acoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  botao: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  botaoTexto: {
    fontSize: 14,
    color: "#000",
  },

  // lista
  lista: {
    width: "100%",
    maxHeight: 280,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  itemTipo: {
    fontSize: 14,
  },
  itemData: {
    fontSize: 12,
    color: "#666",
  },
  itemValor: {
    fontSize: 14,
  },
  ganho: {
    color: "green",
  },
  gasto: {
    color: "red",
  },
  vazio: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },

  // modal
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  modalTitulo: {
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 6,
    fontSize: 14,
  },
  erro: {
    color: "red",
    fontSize: 12,
  },
  modalAcoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemDescricao: {
    fontSize: 14,
    color: "#000",
  },

  rotuloCampo: {
    fontSize: 12,
    color: "#666",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  chipAtivo: {
    backgroundColor: "#000",
  },
  chipTexto: {
    fontSize: 12,
    color: "#000",
  },
  chipTextoAtivo: {
    color: "#fff",
  },

  linhaDetalhe: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  detalheRotulo: {
    fontSize: 12,
    color: "#666",
  },
  detalheValor: {
    fontSize: 14,
    color: "#000",
    flexShrink: 1,
    textAlign: "right",
  },
});
