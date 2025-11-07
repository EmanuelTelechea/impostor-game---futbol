import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameContext } from "../context/GameContext";

export default function ResultScreen() {
  const navigation = useNavigation();
  const { gameWinner, resetGame } = useContext(GameContext);
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  // Si no hay ganador, mostrar fallback con botones seguros
  if (!gameWinner) {
    return (
      <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
        <Text style={[styles.title, { color: "#FFD93D" }]}>😕 No hay resultado</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30" }]}
          onPress={() => {
            resetGame && resetGame();
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          }}
        >
          <Text style={styles.buttonText}>🏠 Volver al menú</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFD93D" }]}
          onPress={() => {
            resetGame && resetGame();
            navigation.reset({
              index: 1,
              routes: [{ name: "Home" }, { name: "OfflineSetup" }],
            });
          }}
        >
          <Text style={[styles.buttonText, { color: "#000" }]}>🎮 Configurar jugadores</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const normalized = String(gameWinner).toLowerCase();
  const isImpostor = normalized === "impostor";

  const title = isImpostor ? "¡El impostor ganó!" : "¡La tripulación gana!";
  const color = isImpostor ? "#FF4E6E" : "#4EFF9A";

  const handlePlayAgain = () => {
    resetGame && resetGame();
    navigation.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "OfflineSetup" }],
    });
  };

  const handleBackToMenu = () => {
    resetGame && resetGame();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <View style={styles.resultBox}>
        <Text style={[styles.title, { color }]}>{title}</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFD93D" }]}
          onPress={handlePlayAgain}
        >
          <Text style={[styles.buttonText, { color: "#000" }]}>🔁 Jugar de nuevo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30" }]}
          onPress={handleBackToMenu}
        >
          <Text style={styles.buttonText}>🏠 Volver al menú</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultBox: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 42,
    textAlign: "center",
    fontFamily: "LuckiestGuy_400Regular",
    marginBottom: 50,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: "LuckiestGuy_400Regular",
    color: "#fff",
  },
});
