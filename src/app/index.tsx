import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import styles from "./style.home";

export default function HomeScreen() {
  const router = useRouter();
  const [isSomeoneLogged, setIsSomeoneLogged] = useState(false);

  useEffect(() => {
    if (!isSomeoneLogged) router.push("../login");
  }, []);

  return <View className="mainContainer" style={styles.mainContainer}></View>;
}
