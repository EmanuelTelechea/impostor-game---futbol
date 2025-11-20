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

export default function GameScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // 1. 🔥 RECUPERAR LA MOCHILA (Params)
  // Intentamos leer los datos que vienen de WordReveal
  const paramImpostorIds = route.params?.impostorIds;
  const paramWord = route.params?.word;
  const paramCategory = route.params?.category;

  const {
    players,
    alivePlayers,
    setAlivePlayers,
    setGameWinner,
    // 🔥 Importamos la versión plural del contexto por si acaso
    impostorIds: ctxImpostorIds, 
    setSelectedCategory,
  } = useGameContext();

  // 2. 🔥 DEFINIR LA VERDAD ABSOLUTA
  // Si hay params, úsalos. Si no, usa contexto. Si no, array vacío.
  const realImpostorIds = (paramImpostorIds && paramImpostorIds.length > 0) 
    ? paramImpostorIds 
    : (ctxImpostorIds || []);

  // Usamos la palabra que viene por params o fallback
  const realWord = paramWord || "Palabra Secreta";

  const [index, setIndex] = useState(0);
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  // Debug para ver qué está llegando
  useEffect(() => {
    console.log("🎮 GameScreen Iniciado");
    console.log("📥 Impostores recibidos (Params):", paramImpostorIds);
    console.log("📦 Impostores en Contexto:", ctxImpostorIds);
    console.log("✅ USANDO LISTA:", realImpostorIds);
  }, []);

  // Inicializa los jugadores vivos
  useEffect(() => {
    // Si la lista de vivos está vacía o desincronizada, reiníciala con todos los jugadores
    if (alivePlayers.length === 0 && Array.isArray(players) && players.length > 0) {
      setAlivePlayers(players);
    }
  }, [players]);

  const onEliminate = (id) => {
    // Filtrar al jugador eliminado
    const updatedAlive = alivePlayers.filter((p) => p.id !== id);
    
    // 🔥 CORRECCIÓN CLAVE:
    // Verificamos si el ID está DENTRO del array de impostores
    const wasImpostor = realImpostorIds.includes(id);
    
    const eliminatedPlayer = alivePlayers.find((p) => p.id === id);

    // Contar cuántos impostores quedan vivos en la lista 'updatedAlive'
    const impostoresVivos = updatedAlive.filter((p) => realImpostorIds.includes(p.id)).length;
    const tripulantesVivos = updatedAlive.length - impostoresVivos;

    console.log(`🔫 Eliminado: ${eliminatedPlayer?.name}. Era impostor? ${wasImpostor}`);
    console.log(`📊 Quedan: ${impostoresVivos} Impostores vs ${tripulantesVivos} Tripulantes`);

    let winner = null;

    // Lógica de victoria Among Us
    if (impostoresVivos === 0) {
      winner = "tripulantes"; // Ganaron los buenos
    } else if (impostoresVivos >= tripulantesVivos) {
      winner = "impostor"; // Ganaron los malos (si igualan o superan en número)
    }

    // Actualizar estado global
    setAlivePlayers(updatedAlive);
    if (winner) setGameWinner(winner);

    // Navegar al resultado de la eliminación
    // 🔥 PASAMOS LA ANTORCHA: Enviamos de nuevo los datos a la siguiente pantalla
    navigation.replace("Elimination", {
      impostorIds: realImpostorIds, // <--- Vital pasarlo
      eliminatedPlayer,
      wasImpostor,
      category: paramCategory || "General",
      word: realWord,
      nextScreen: winner ? "Result" : "Game" // Le decimos a Elimination a dónde ir después
    });
  };

  const currentPlayer = alivePlayers[index];

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  if (!currentPlayer) {
    return (
      <LinearGradient colors={["#16213E", "#0F3460", "#533483"]} style={styles.container}>
        <Text style={styles.title}>🏁 Fin de la ronda</Text>
         {/* Botón de emergencia por si se vacía la lista */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF595E" }]}
          onPress={() => navigation.navigate("Result")}
        >
          <Text style={styles.buttonText}>Ver Resultados</Text>
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
        <Text style={styles.title}>Votación 🗳️</Text>
        
        {/* Mostramos la categoría solo como recordatorio */}
        <Text style={styles.subtitle}>
           {paramCategory ? paramCategory.toUpperCase() : "Juego en curso"}
        </Text>

        <Text style={[styles.subtitle, { marginTop: 20, color: "#FFD93D" }]}>
            ¿Quién es el impostor? 👇
        </Text>

        <View style={{ width: "100%", marginTop: 20 }}>
          {alivePlayers.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.playerButton, { backgroundColor: p.color || "#444" }]}
              onPress={() => onEliminate(p.id)}
              activeOpacity={0.8}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20}}>
                 <Text style={[styles.playerButtonText, {flex: 1, textAlign: 'left'}]}>{p.name}</Text>
                  <Text style={[styles.playerButtonText, {fontSize: 18}]}>VOTAR 🚀</Text>
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
    fontSize: 36,
    color: "#FFD93D",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: "#F8F9FA",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    opacity: 0.8
  },
  playerButton: {
    paddingVertical: 16,
    borderRadius: 18,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    width: '100%',
  },
  playerButtonText: {
    color: "#fff", // Texto blanco para contrastar con colores de fondo
    fontSize: 24,
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
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