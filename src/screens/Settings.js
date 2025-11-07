import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function Settings({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  const [impostors, setImpostors] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const increaseImpostors = () => setImpostors(prev => (prev < 3 ? prev + 1 : prev));
  const decreaseImpostors = () => setImpostors(prev => (prev > 1 ? prev - 1 : prev));

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("settings", JSON.stringify({ impostors, soundEnabled }));
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
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterBtn} onPress={decreaseImpostors}>
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.value}>{impostors}</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={increaseImpostors}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Sonidos:</Text>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
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
