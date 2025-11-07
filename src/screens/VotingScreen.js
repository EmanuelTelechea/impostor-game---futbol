import { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { GameContext } from "../context/GameContext";

export default function VotingScreen({ navigation, route }) {
  const { onEliminate } = route.params;
  const { players, setPlayers, impostorId, setGameWinner } = useContext(GameContext);

  const [alivePlayers, setAlivePlayers] = useState(players);

  const eliminate = (id) => {
        Vibration.vibrate(80);

        // 1. Filtrar la lista de jugadores que va al contexto
        const updatedPlayers = players.filter(p => p.id !== id);
        
        // 2. Actualizar las listas en el contexto
        setAlivePlayers(updatedPlayers); // 👈 Es crucial actualizar la lista de vivos en el contexto
        setPlayers(updatedPlayers); 

        const wasImpostor = id === impostorId;
        let nextScreen = "Game"; // Por defecto, volvemos a GameScreen

        // 3. Lógica de victoria/continuación
        if (wasImpostor) {
            setGameWinner("tripulantes");
            nextScreen = "Result"; // Irá a Result desde Elimination
        } else if (updatedPlayers.length <= 2) {
            setGameWinner("impostor");
            nextScreen = "Result"; // Irá a Result desde Elimination
        } else {
            // Si el juego sigue, es buena práctica resetear el ganador a null
            setGameWinner(null);
            
            // NOTA: Ya NO es necesario llamar a onEliminate(id).
            // La lógica de onEliminate en GameScreen.js es ahora la responsable
            // de recalcular el estado de la partida si se elimina a alguien en GameScreen.
        }

        // 4. Mostrar animación de eliminación
        navigation.replace("Elimination", {
            eliminatedPlayer: players.find(p => p.id === id),
            wasImpostor,
            // 💡 Pasamos la siguiente pantalla a la que debe navegar EliminationScreen
            nextScreen: nextScreen, 
        });
    };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗳️ Votación</Text>
      <Text style={styles.subtitle}>¿Quién es el impostor?</Text>

      {alivePlayers.map((p) => (
        <TouchableOpacity
          key={p.id}
          style={styles.playerRow}
          onPress={() => eliminate(p.id)}
        >
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.voteBtn}>Votar</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111426", padding: 20 },
  title: { fontSize: 30, fontWeight: "900", color: "#fff", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 18, color: "#7A7FFF", textAlign: "center", marginBottom: 22 },
  playerRow: {
    backgroundColor: "#1C2038",
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { color: "#fff", fontSize: 18, fontWeight: "700" },
  voteBtn: { color: "#FF4E6E", fontSize: 16, fontWeight: "900" },
});
