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
      Animated.delay(2200),
      Animated.timing(fade, {
        toValue: 0,
        duration: 1200,
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

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  // --- Lógica Dinámica de Colores ---
  const gradientColors = wasImpostor
    ? ["#991B1B", "#B91C1C", "#EF4444"] // Rojo/Bordeaux para la victoria de los civiles
    : ["#1D4ED8", "#2563EB", "#3B82F6"]; // Azul/Morado para el error de los civiles

  // El color del texto de resultado será ROJO si era impostor (victoria) o AMARILLO si no lo era (error).
  const resultColor = wasImpostor ? "#FFD93D" : "#FF595E"; // Amarillo brillante para la victoria, Rojo para el error.

  // El color del borde del modal será contrario al resultado para destacar el mensaje.
  const modalBorderColor = wasImpostor ? "#FFD93D" : "#FFF";
  const separatorColor = wasImpostor ? "#FFD93D" : "#FFF";
  // --- Fin Lógica Dinámica de Colores ---


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
        <View style={[
            styles.modalContent, 
            { borderColor: modalBorderColor } // Aplicamos el color de borde dinámico
        ]}>
          {/* Primer bloque de texto: ELIMINADO */}
          <Text style={styles.eliminatedText}>
            <Text style={{ color: resultColor }}> {/* Nombre del jugador toma el color del resultado */}
              {eliminatedPlayer.name.toUpperCase()}
            </Text>{" "}
            FUE ELIMINADO
          </Text>

          {/* Separador visual o línea */}
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />

          {/* Segundo bloque de texto: Resultado */}
          <Text style={[styles.resultText, { color: resultColor }]}>
            {wasImpostor
              ? "¡ERA EL IMPOSTOR!" // Resultado positivo (Eliminado = Impostor)
              : "NO ERA EL IMPOSTOR..." // Resultado negativo (Eliminado = Civil)
            }
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
    width: "90%", 
  },
  modalContent: {
    backgroundColor: "rgba(30, 30, 30, 0.95)", 
    borderRadius: 15,
    padding: 30,
    borderWidth: 4,
    // borderColor se aplica dinámicamente
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15, 
    alignItems: "center",
  },
  eliminatedText: {
    fontSize: 32,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    color: "#FFF", 
    marginBottom: 10,
  },
  separator: {
    height: 3,
    width: "80%",
    // backgroundColor se aplica dinámicamente
    marginVertical: 15,
    borderRadius: 2,
  },
  resultText: {
    fontSize: 28, // Aumentamos un poco el tamaño para el énfasis
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    // color se aplica dinámicamente
  },
});