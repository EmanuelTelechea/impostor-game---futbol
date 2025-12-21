import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useGameContext } from "../context/GameContext";
import { playSound } from "../utils/soundManager";
export default function GameScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // 1. RECUPERAR LA MOCHILA (Params)
  const paramImpostorIds = route.params?.impostorIds;
  const paramWord = route.params?.word;
  const paramCategory = route.params?.category;

  const {
    players,
    alivePlayers,
    setAlivePlayers,
    setGameWinner,
    impostorIds: ctxImpostorIds, 
    setSelectedCategory,
  } = useGameContext();

  // 2. DEFINIR LA VERDAD ABSOLUTA
  const realImpostorIds = (paramImpostorIds && paramImpostorIds.length > 0) 
    ? paramImpostorIds 
    : (ctxImpostorIds || []);

  const realWord = paramWord || "Palabra Secreta";

  const [index, setIndex] = useState(0);
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  // Debug
  useEffect(() => {
    console.log("⚽ GameScreen (Cancha) Iniciado");
    console.log("📥 Infiltrados recibidos:", paramImpostorIds);
  }, []);

  // Inicializa los jugadores en cancha
  useEffect(() => {
    if (alivePlayers.length === 0 && Array.isArray(players) && players.length > 0) {
      setAlivePlayers(players);
    }
  }, [players]);

  const onEliminate = (id) => {
    // Filtrar al jugador expulsado
    const updatedAlive = alivePlayers.filter((p) => p.id !== id);
    
    // Verificar si era el que estaba simulando (Impostor)
    const wasImpostor = realImpostorIds.includes(id);
    const eliminatedPlayer = alivePlayers.find((p) => p.id === id);

    // Contar cuántos infiltrados quedan en cancha
    const impostoresVivos = updatedAlive.filter((p) => realImpostorIds.includes(p.id)).length;
    const tripulantesVivos = updatedAlive.length - impostoresVivos;

    console.log(`🟥 Expulsado: ${eliminatedPlayer?.name}. Era simulador? ${wasImpostor}`);

    let winner = null;

    // Lógica de victoria
    if (impostoresVivos === 0) {
      winner = "tripulantes"; // Ganó el Equipo Limpio
    } else if (impostoresVivos >= tripulantesVivos) {
      winner = "impostor"; // Ganaron los Simuladores (infiltrados dominan la cancha)
    }

    // Actualizar estado global
    setAlivePlayers(updatedAlive);
    if (winner) setGameWinner(winner);

    // Navegar a la pantalla de la Tarjeta Roja
    navigation.replace("Elimination", {
      impostorIds: realImpostorIds,
      eliminatedPlayer,
      wasImpostor,
      category: paramCategory || "General",
      word: realWord,
      nextScreen: winner ? "Result" : "Game"
    });
  };

  const currentPlayer = alivePlayers[index];

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFF" />;

  // Si no hay nadie (caso raro de error), botón de emergencia
  if (!currentPlayer) {
    return (
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
        <Text style={styles.title}>Fin del Partido</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#D32F2F" }]}
          onPress={() => navigation.navigate("Result")}
        >
          <Text style={styles.buttonText}>Ir al Vestuario</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    // CAMBIO: Fondo Césped
    <LinearGradient colors={["#66BB6A", "#2E7D32", "#1B5E20"]} style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(600)}
        exiting={FadeOut.duration(400)}
        style={{ width: "100%", alignItems: "center" }}
      >
        {/* Título estilo VAR / Arbitraje */}
        <Text style={styles.title}>¡DECISIÓN DEL VAR! 📺</Text>
        
        <Text style={styles.subtitle}>
           Copa: {paramCategory ? paramCategory.toUpperCase() : "AMISTOSO"}
        </Text>

        <Text style={[styles.subtitle, { marginTop: 20, color: "#FFEB3B", fontSize: 22 }]}>
            ¿Quién merece la Roja? 🟥👇
        </Text>

        <View style={{ width: "100%", marginTop: 20 }}>
          {alivePlayers.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.playerButton, { backgroundColor: p.color || "#333" }]}
              onPress={() => {
                playSound("vote");
                onEliminate(p.id);
              }}
              activeOpacity={0.8}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20}}>
                 {/* Nombre estilo Camiseta */}
                 <Text style={[styles.playerButtonText, {flex: 1, textAlign: 'left'}]}>
                    {p.name}
                 </Text>
                 {/* Acción estilo Tarjeta */}
                 <Text style={[styles.playerButtonText, {fontSize: 18, color: '#FFCDD2'}]}>
                    ROJA 🟥
                 </Text>
              </View>
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
    fontSize: 38, // Un poco más grande
    color: "#FFF", // Blanco puro
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#E8F5E9", // Blanco verdoso
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  playerButton: {
    paddingVertical: 16,
    borderRadius: 12, // Menos redondeado, más rectangular como tarjeta
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    width: '100%',
    borderWidth: 2,
    borderColor: "#FFF", // Borde blanco resaltando sobre el césped
  },
  playerButtonText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
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