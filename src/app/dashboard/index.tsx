import Extrato from "@/components/extrato";
import { useState } from "react";
import { Text, View } from "react-native";
import styles from "./style.dashboard";

export default function Dashboard() {
  const [saldo, setSaldo] = useState(0);
  const [gastoTotal, setGastoTotal] = useState(0);
  const [ganhoTotal, setGanhoTotal] = useState(0);

  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.dashboardContents}>
        <Text style={styles.saldo}>Saldo atual: {saldo}</Text>
        <View style={styles.dadosCarteira}>
          <Text style={[styles.dadosCarteiraTexto, styles.warningText]}>
            Gasto total: {gastoTotal}
          </Text>
          <Text style={[styles.dadosCarteiraTexto, styles.successText]}>
            Ganho total: {ganhoTotal}
          </Text>
        </View>

        <Extrato
          onTotaisChange={({ saldo, ganhoTotal, gastoTotal }) => {
            setSaldo(saldo);
            setGanhoTotal(ganhoTotal);
            setGastoTotal(gastoTotal);
          }}
        />
      </View>
    </View>
  );
}
