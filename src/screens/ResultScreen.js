import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameContext } from "../context/GameContext";

export default function ResultScreen() {
  const navigation = useNavigation();
  const { gameWinner, resetGame } = useContext(GameContext);

  // Si no hay ganador, mostrar fallback con botones seguros (evita navegar a "Game")
  if (!gameWinner) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: "#FFD93D" }]}>No hay resultado</Text>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => {
            resetGame && resetGame();
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          }}
        >
          <Text style={styles.btnText}>Volver al menú</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => {
            resetGame && resetGame();
            navigation.reset({
              index: 1,
              routes: [{ name: "Home" }, { name: "OfflineSetup" }],
            });
          }}
        >
          <Text style={styles.btnText}>Configurar jugadores</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const normalized = String(gameWinner).toLowerCase();
  const isImpostor = normalized === "impostor";

  const title = isImpostor ? "😈 El impostor ganó" : "🚀 ¡La tripulación gana!";
  const color = isImpostor ? "#FF4E6E" : "#4EFF9A";

  const handlePlayAgain = () => {
    resetGame && resetGame();
    navigation.reset({
      index: 1,
      routes: [
        { name: "Home" },
        { name: "OfflineSetup" },
      ],
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
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{title}</Text>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={handlePlayAgain}
      >
        <Text style={styles.btnText}>Jugar de nuevo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={handleBackToMenu}
      >
        <Text style={styles.btnText}>Volver al menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111426",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 40,
  },
  btnPrimary: {
    backgroundColor: "#4E6BFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
