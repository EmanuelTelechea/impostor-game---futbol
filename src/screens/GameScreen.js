import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGameContext } from "../context/GameContext";

export default function GameScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    players,
    impostorId,
    alivePlayers,
    setAlivePlayers,
    setGameWinner,
    selectedCategory,
    setSelectedCategory,
    word,
    setWord,
    getSubCategories,
  } = useGameContext();

  const [index, setIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  // ✅ Animación de entrada
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // ✅ Cargar la categoría desde parámetros si viene de WordRevealScreen
  useEffect(() => {
    const cat = route?.params?.category;
    if (cat && typeof setSelectedCategory === "function") {
      setSelectedCategory(cat);
    }
  }, [route?.params]);

  // ✅ Inicializa los jugadores vivos solo si está vacío
  useEffect(() => {
    if (alivePlayers.length === 0 && Array.isArray(players)) {
      setAlivePlayers(players);
    }
  }, [players]);

  // ✅ Eliminación de jugador
  const onEliminate = (id) => {
    const updated = alivePlayers.filter((p) => p.id !== id);
    const wasImpostor = id === impostorId;
    const eliminatedPlayer = alivePlayers.find((p) => p.id === id);

    const impostoresVivos = updated.filter((p) => p.id === impostorId).length;
    const tripulantesVivos = updated.length - impostoresVivos;

    console.log("---- ESTADO POST ELIMINACIÓN ----");
    console.log("Vivos:", updated.map((p) => p.id));
    console.log("Impostores vivos:", impostoresVivos);
    console.log("Tripulantes vivos:", tripulantesVivos);
    console.log("Eliminado era impostor:", wasImpostor);
    console.log("---------------------------------");

    let winner = null;

    // 🧩 Lógica de victoria
    if (wasImpostor) {
      if (impostoresVivos === 0) {
        console.log("🎉 ¡Tripulantes ganan!");
        winner = "tripulantes";
      }
    } else {
      if (tripulantesVivos <= impostoresVivos) {
        console.log("🕵️‍♂️ ¡Impostor gana!");
        winner = "impostor";
      }
    }

    // 🔁 Si no hay ganador, continuar partida
    if (!winner) {
      console.log("➡️ Continuando partida...");
      setGameWinner(null);
      setAlivePlayers(updated);
      setIndex(0);
    } else {
      console.log("🏁 Fin del juego. Ganador:", winner);
      setGameWinner(winner);
    }

    // 👉 Navegar SIEMPRE a la pantalla de Eliminación
    navigation.replace("Elimination", {
      eliminatedPlayer,
      wasImpostor,
      category: selectedCategory,
      word,
    });
  };

  const currentPlayer = alivePlayers[index];

  if (!currentPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>😵 No hay jugadores vivos.</Text>
        <TouchableOpacity
          style={[styles.button, styles.returnButton]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.turnText}>Turno actual:</Text>
      <Text style={styles.playerName}>{currentPlayer.name}</Text>

      {selectedCategory && (
        <Text style={styles.categoryText}>
          Categoría actual: {selectedCategory.toUpperCase()}
        </Text>
      )}

      {word && (
        <Text style={styles.wordText}>Palabra: {word}</Text>
      )}

      <Text style={styles.subtitle}>Selecciona a quién eliminar 👇</Text>

      <View style={{ width: "100%", marginTop: 10 }}>
        {alivePlayers.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.playerButton, { backgroundColor: p.color || "#444" }]}
            onPress={() => onEliminate(p.id)}
          >
            <Text style={styles.eliminateText}>Eliminar a {p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C1D",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  turnText: {
    color: "#9EAFFF",
    fontSize: 22,
    marginBottom: 6,
  },
  playerName: {
    color: "#FFD93D",
    fontSize: 36,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  categoryText: {
    color: "#8CE6FF",
    fontSize: 18,
    marginTop: 10,
  },
  wordText: {
    color: "#B5FF9E",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 10,
  },
  subtitle: {
    color: "#E0E0E0",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
    marginBottom: 20,
  },
  playerButton: {
    paddingVertical: 14,
    borderRadius: 15,
    marginVertical: 6,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  eliminateText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  returnButton: {
    backgroundColor: "#FF4E6E",
  },
});
