import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <Text style={styles.title}>🎭 El juego del IMPOSTOR 🎭</Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFD93D" }]}
          onPress={() => navigation.navigate("OfflineSetup")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>🎮 Jugar Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6C63FF" }]}
          onPress={() => navigation.navigate("Settings")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>⚙️ Configuración</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 40,
    color: "#FFD93D",
    marginBottom: 60,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 8,
  },
  menuContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  buttonText: {
    fontSize: 24,
    color: "#1E1F2F",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
});
