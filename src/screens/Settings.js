import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Button, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useGameContext } from "../context/GameContext";
export default function Settings({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  const { soundEnabled, setSoundEnabled, impostorCount, setImpostorCount } = useGameContext();


  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("settings", JSON.stringify({ impostorCount, soundEnabled }));
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar configuración:", error);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <Text style={styles.title}>⚙️ Configuración</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Impostores:</Text>
        <Button title="➖" onPress={() => setImpostorCount(Math.max(1, impostorCount - 1))} />
        <Text style={styles.value}>{impostorCount}</Text>
        <Button title="➕" onPress={() => setImpostorCount(impostorCount + 1)} />
      </View>

      <View style={styles.settingRow}>
       <Text style={styles.label}>Sonido 🔊 </Text>
      <Switch
        value={soundEnabled}
        onValueChange={(value) => setSoundEnabled(value)}
      />
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: "#6C63FF" }]} onPress={saveSettings}>
        <Text style={styles.btnText}>💾 Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: "#FFD93D" }]} onPress={() => navigation.goBack()}>
        <Text style={[styles.btnText, { color: "#000" }]}>⬅️ Volver</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 25 },
  title: {
    fontSize: 36,
    color: "#FFD93D",
    fontFamily: "LuckiestGuy_400Regular",
    marginBottom: 50,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
  },
  settingRow: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  label: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
  },
  counterContainer: { flexDirection: "row", alignItems: "center" },
  counterBtn: {
    backgroundColor: "#FFD93D",
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    elevation: 5,
  },
  counterText: { fontSize: 28, fontWeight: "900", color: "#1E1F2F" },
  value: { fontSize: 24, color: "#fff", fontFamily: "LuckiestGuy_400Regular" },
  btn: {
    width: "70%",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    elevation: 8,
  },
  btnText: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
  },
});
