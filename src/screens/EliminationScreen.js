import {
  LuckiestGuy_400Regular,
  useFonts,
} from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGameContext } from "../context/GameContext";

export default function EliminationScreen({ route, navigation }) {
  const { eliminatedPlayer, wasImpostor } = route.params;
  const { gameWinner } = useGameContext();

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2500), // Un poco más de tiempo para leer el veredicto
      Animated.timing(fade, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (gameWinner) {
        navigation.replace("Result");
      } else {
        navigation.replace("Game");
      }
    });
  }, [gameWinner, navigation, fade, scale]); 

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFF" />;

  // --- Lógica Dinámica de Colores (Tema Fútbol) ---
  // Si era SIMULADOR (Impostor) -> Es algo BUENO para los honestos -> Verde/Dorado (¡Gol!)
  // Si era HONESTO (Tripulante) -> Es algo MALO (Error arbitral) -> Rojo/Gris (¡Error!)
  
  const gradientColors = wasImpostor
    ? ["#1B5E20", "#2E7D32", "#4CAF50"] // Verde Victoria (¡Lo atraparon!)
    : ["#B71C1C", "#D32F2F", "#E53935"]; // Rojo Error (¡Expulsaron mal!)

  const resultColor = "#FFF"; 
  const modalBorderColor = "#FFF"; // Borde blanco estilo Tarjeta o TV
  
  // Textos temáticos
  const titleText = `${eliminatedPlayer.name.toUpperCase()} SE VA A LAS DUCHAS`;
  const verdictText = wasImpostor ? "¡ERA UN SIMULADOR!" : "¡ERROR! JUGABA LIMPIO";

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Tarjeta Roja Gigante / Pantalla VAR */}
        <View style={[
            styles.modalContent, 
            { borderColor: modalBorderColor } 
        ]}>
          
          {/* Icono superior */}
          <Text style={styles.cardIcon}>🟥</Text>

          {/* Primer bloque: Jugador expulsado */}
          <Text style={styles.eliminatedText}>
             {titleText}
          </Text>

          <View style={styles.separator} />

          {/* Segundo bloque: Veredicto del VAR */}
          <Text style={styles.verdictLabel}>VEREDICTO DEL VAR:</Text>
          
          <Text style={[styles.resultText, { color: resultColor }]}>
            {verdictText}
          </Text>

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
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%", 
    maxWidth: 500,
  },
  modalContent: {
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo oscuro sutil para resaltar texto
    borderRadius: 20,
    padding: 40,
    borderWidth: 6, // Borde grueso estilo tarjeta física
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20, 
    alignItems: "center",
    width: '90%',
  },
  cardIcon: {
      fontSize: 60,
      marginBottom: 10,
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowRadius: 10
  },
  eliminatedText: {
    fontSize: 34,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    color: "#FFF", 
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4
  },
  separator: {
    height: 2,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 20,
  },
  verdictLabel: {
      fontSize: 18,
      color: "#EEE",
      fontFamily: "LuckiestGuy_400Regular",
      marginBottom: 5,
      opacity: 0.9
  },
  resultText: {
    fontSize: 38, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 5,
    lineHeight: 45
  },
});