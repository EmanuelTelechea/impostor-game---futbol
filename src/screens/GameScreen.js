import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
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
  } = useGameContext();

  const [index, setIndex] = useState(0);
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  // Cargar categoría desde parámetros si llega
  useEffect(() => {
    const cat = route?.params?.category;
    if (cat && typeof setSelectedCategory === "function") {
      setSelectedCategory(cat);
    }
  }, [route?.params]);

  // Inicializa los jugadores vivos si no existen aún
  useEffect(() => {
    if (alivePlayers.length === 0 && Array.isArray(players)) {
      setAlivePlayers(players);
    }
  }, [players]);

  const onEliminate = (id) => {
    const updated = alivePlayers.filter((p) => p.id !== id);
    const wasImpostor = id === impostorId;
    const eliminatedPlayer = alivePlayers.find((p) => p.id === id);

    const impostoresVivos = updated.filter((p) => p.id === impostorId).length;
    const tripulantesVivos = updated.length - impostoresVivos;

    let winner = null;

    if (wasImpostor) {
      if (impostoresVivos === 0) winner = "tripulantes";
    } else {
      if (tripulantesVivos <= impostoresVivos) winner = "impostor";
    }

    if (!winner) {
      setGameWinner(null);
      setAlivePlayers(updated);
      setIndex(0);
    } else {
      setGameWinner(winner);
    }

    navigation.replace("Elimination", {
      eliminatedPlayer,
      wasImpostor,
      category: selectedCategory,
      word,
    });
  };

  const currentPlayer = alivePlayers[index];

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  if (!currentPlayer) {
    return (
      <LinearGradient colors={["#16213E", "#0F3460", "#533483"]} style={styles.container}>
        <Text style={styles.title}>😵 No hay jugadores vivos</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF595E" }]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(600)}
        exiting={FadeOut.duration(400)}
        style={{ width: "100%", alignItems: "center" }}
      >
        <Text style={styles.title}>Turno actual:</Text>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>

        {selectedCategory && (
          <Text style={styles.subtitle}>
            Categoría actual: {selectedCategory.toUpperCase()}
          </Text>
        )}

        <Text style={[styles.subtitle, { marginTop: 20 }]}>Selecciona a quién eliminar 👇</Text>

        <View style={{ width: "100%", marginTop: 10 }}>
          {alivePlayers.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.playerButton, { backgroundColor: p.color || "#444" }]}
              onPress={() => onEliminate(p.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.playerButtonText}>Eliminar a {p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
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
  title: {
    fontSize: 32,
    color: "#FFD93D",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  playerName: {
    fontSize: 40,
    color: "#8CE6FF",
    fontFamily: "LuckiestGuy_400Regular",
    marginVertical: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: "#F8F9FA",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  playerButton: {
    paddingVertical: 14,
    borderRadius: 18,
    marginVertical: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  playerButtonText: {
    color: "#1E1F2F",
    fontSize: 22,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 18,
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
});
