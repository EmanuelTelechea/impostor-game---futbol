import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { GameContext } from "../context/GameContext";
import { playMusic, playSound } from "../utils/soundManager";

export default function VotingScreen({ navigation, route }) {

  useEffect(() => {
    playMusic(
      "suspense",
      require("../assets/music/suspense.mp3"),
      0.3
    );
  }, []);

  // Nota: onEliminate viene de params, pero usamos la lógica interna para consistencia
  const { players, setPlayers, impostorIds, setGameWinner } = useContext(GameContext);

  const [alivePlayers, setAlivePlayers] = useState(players);

  // Carga de la fuente
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  
  const eliminate = (id) => {
    Vibration.vibrate(100); // Vibración más fuerte como un silbatazo

    const updatedPlayers = players.filter(p => p.id !== id);
    setPlayers(updatedPlayers);
    setAlivePlayers(updatedPlayers);

    // Verificar si era simulador
    const wasImpostor = impostorIds.includes(id);

    // Calcular simuladores restantes
    const aliveImpostors = impostorIds.filter(impo =>
      updatedPlayers.some(p => p.id === impo)
    );

    let nextScreen = "Game";

    // Lógica de victoria (Fin del Partido)
    if (aliveImpostors.length === 0) {
      setGameWinner("tripulantes"); // Ganó el Juego Limpio
      nextScreen = "Result";

    } else if (updatedPlayers.length <= aliveImpostors.length + 1) {
      setGameWinner("impostor"); // Ganaron los Simuladores
      nextScreen = "Result";

    } else {
      setGameWinner(null);
    }
    
    console.log("🟥 Expulsión confirmada. Simuladores restantes:", aliveImpostors.length);

    // Sonido de votación
    playSound('vote');

    navigation.replace("Elimination", {
      eliminatedPlayer: players.find(p => p.id === id),
      wasImpostor,
      nextScreen,
    });
  };

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFF" />;

  return (
    // Fondo de Césped
    <LinearGradient colors={["#66BB6A", "#2E7D32", "#1B5E20"]} style={styles.container}>
      
      {/* Encabezado estilo TV */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>📺 SALA VAR</Text>
        <Text style={styles.subtitle}>¿Quién merece la Roja?</Text>
      </View>

      <View style={styles.listContainer}>
        {alivePlayers.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => eliminate(p.id)}
            activeOpacity={0.8}
          >
            {/* Fila estilo Marcador / Placa de TV */}
            <LinearGradient
              colors={['#263238', '#37474F']} // Gris oscuro técnico
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.playerRow, { borderLeftColor: p.color || '#FFF' }]}
            >
              <View style={styles.playerInfo}>
                 {/* Indicador de color de camiseta */}
                 <View style={[styles.kitIndicator, { backgroundColor: p.color || '#FFF' }]} />
                 <Text style={styles.name}>{p.name}</Text>
              </View>
              
              <View style={styles.actionBadge}>
                 <Text style={styles.voteBtn}>ROJA 🟥</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    justifyContent: 'center'
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF'
  },
  title: { 
    fontSize: 42, 
    fontFamily: "LuckiestGuy_400Regular", 
    color: "#FFF", 
    textAlign: "center", 
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: { 
    fontSize: 20, 
    color: "#FFEB3B", // Amarillo tarjeta
    fontFamily: "LuckiestGuy_400Regular", 
    textAlign: "center", 
    marginTop: 5,
    letterSpacing: 1
  },
  listContainer: {
    width: '100%',
  },
  playerRow: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    borderLeftWidth: 8, // Barra de color del jugador a la izquierda
    // Sombra
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  kitIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF'
  },
  name: { 
    color: "#FFF", 
    fontSize: 22, 
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 3
  },
  actionBadge: {
    backgroundColor: '#D32F2F', // Rojo expulsión
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B71C1C'
  },
  voteBtn: { 
    color: "#FFF", 
    fontSize: 16, 
    fontFamily: "LuckiestGuy_400Regular", 
  },
});