import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { GameContext } from "../context/GameContext";

export default function VotingScreen({ navigation, route }) {
  const { onEliminate } = route.params;
  const { players, setPlayers, impostorIds, setGameWinner } = useContext(GameContext);

  const [alivePlayers, setAlivePlayers] = useState(players);

  // Carga de la fuente
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  // ... (el resto de tu lógica `eliminate` se mantiene igual)

  const eliminate = (id) => {
    // ... (Tu función de eliminación)
    Vibration.vibrate(80);

    const updatedPlayers = players.filter(p => p.id !== id);
    setPlayers(updatedPlayers);
    setAlivePlayers(updatedPlayers);

    // ✔ ahora sí usa impostorIds
    const wasImpostor = impostorIds.includes(id);

    // ✔ calcular cuántos impostores siguen vivos
    const aliveImpostors = impostorIds.filter(impo =>
      updatedPlayers.some(p => p.id === impo)
    );

    let nextScreen = "Game";

    // ✔ lógica real estilo Among Us
    if (aliveImpostors.length === 0) {
      setGameWinner("tripulantes");
      nextScreen = "Result";

    } else if (updatedPlayers.length <= aliveImpostors.length + 1) {
      setGameWinner("impostor");
      nextScreen = "Result";

    } else {
      setGameWinner(null);
    }
    console.log("🔥 Eliminando… impostorIds:", impostorIds);

    navigation.replace("Elimination", {
      eliminatedPlayer: players.find(p => p.id === id),
      wasImpostor,
      nextScreen,
    });
  };

  // Muestra el indicador de carga si la fuente no está lista
  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗳️ Votación</Text>
      <Text style={styles.subtitle}>¿Quién es el impostor?</Text>

      {alivePlayers.map((p) => (
        <TouchableOpacity
          key={p.id}
          onPress={() => eliminate(p.id)}
        >
          {/* Usamos LinearGradient para darle un estilo 3D al botón */}
          <LinearGradient
            colors={['#1C2038', '#2D334C']} // Gradiente de oscuro a un poco más claro
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.playerRow}
          >
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.voteBtn}>VOTAR 🚀</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#111426", 
    padding: 20 
  },
  title: { 
    fontSize: 40, 
    fontFamily: "LuckiestGuy_400Regular", // Usamos la fuente
    color: "#FFD93D", // Color amarillo para destacar
    textAlign: "center", 
    marginBottom: 6,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: { 
    fontSize: 22, 
    color: "#fff", // Subtítulo en blanco
    fontFamily: "LuckiestGuy_400Regular", // Usamos la fuente
    textAlign: "center", 
    marginBottom: 25,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  playerRow: {
    // Quitamos backgroundColor de aquí porque lo maneja LinearGradient
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    // Estilos de caja/sombra similares al modal
    borderWidth: 2,
    borderColor: "#415A77", // Borde sutil
    shadowColor: "#FF4E6E", // Sombra con un color llamativo
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  name: { 
    color: "#FFF", 
    fontSize: 20, 
    fontWeight: "700",
    fontFamily: "LuckiestGuy_400Regular", // Usamos la fuente
  },
  voteBtn: { 
    color: "#B5FF9E", // Color de botón de acción (verde/lima)
    fontSize: 18, 
    fontWeight: "900",
    fontFamily: "LuckiestGuy_400Regular", // Usamos la fuente
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#2E5D4E", // Fondo para el texto del botón
  },
});