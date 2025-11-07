import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function RulesScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📜 Reglas del Juego</Text>

        <Text style={styles.text}>
          🔹 Cada jugador recibe una palabra, excepto el impostor, que no la conoce.
        {"\n\n"}
          🔹 Los jugadores deben describir la palabra sin decirla directamente.
        {"\n\n"}
          🔹 En cada ronda, se vota quién creen que es el impostor.
        {"\n\n"}
          🔹 Si eliminan al impostor, los demás ganan.
        {"\n\n"}
          🔹 Si se eliminan jugadores inocentes, el juego continúa hasta descubrir al impostor o quedar pocos.
        {"\n\n"}
          🧠 Consejo: describí con cuidado, ni muy directo... ni muy raro 😏
        </Text>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>⬅️ Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 25 },
  title: {
    fontSize: 36,
    color: "#FFD93D",
    marginBottom: 30,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 28,
    textAlign: "left",
    width: "90%",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 15,
    borderRadius: 12,
  },
  btn: {
    marginTop: 30,
    backgroundColor: "#FFD93D",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  btnText: {
    fontSize: 22,
    color: "#000",
    fontFamily: "LuckiestGuy_400Regular",
  },
});
