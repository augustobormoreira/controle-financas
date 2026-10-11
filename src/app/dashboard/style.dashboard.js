import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dashboardContents: {
    width: 800,
    height: 600,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 25,
  },
  saldo: {
    fontSize: 28,
  },
  dadosCarteira: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 350,
  },
  dadosCarteiraTexto: {
    fontSize: 22,
  },

  warningText: {
    color: "red",
  },
  successText: {
    color: "green",
  },
});

export default styles;
