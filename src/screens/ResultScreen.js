import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GameContext } from "../context/GameContext";
import { playSound } from "../utils/soundManager";

export default function ResultScreen() {
  const navigation = useNavigation();
  const { gameWinner, resetGame } = useContext(GameContext);
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  // --- Lógica del Marcador ---
  const normalized = String(gameWinner || "").toLowerCase();
  const isImpostor = normalized === "impostor";

  // ✅ HOOKS SIEMPRE ARRIBA (SIN CONDICIONES)
  useEffect(() => {
    if (!fontsLoaded) return;

    try {
      if (isImpostor) playSound("lose");
      else playSound("win");
    } catch (e) {}
  }, [fontsLoaded, isImpostor]);

  // ⛔ RETURN DESPUÉS DE TODOS LOS HOOKS
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FFF" />;
  }

  // --- Temas ---
  const theme = {
    impostor: {
      title: "¡GANARON LOS\nSIMULADORES!",
      subtitle: "El árbitro compró todo...",
      scoreboardColor: "#212121",
      borderColor: "#D32F2F",
      textColor: "#FF5252",
      buttonColor: "#FF5252",
    },
    tripulantes: {
      title: "¡VICTORIA DEL\nJUEGO LIMPIO!",
      subtitle: "Se hizo justicia en la cancha ⚽",
      scoreboardColor: "#1A237E",
      borderColor: "#FFD700",
      textColor: "#FFD700",
      buttonColor: "#FFD700",
    },
    default: {
      title: "PARTIDO SUSPENDIDO",
      subtitle: "Sin resultados oficiales",
      scoreboardColor: "#333",
      borderColor: "#AAA",
      textColor: "#FFF",
      buttonColor: "#FFF",
    },
  };

  const currentTheme =
    theme[isImpostor ? "impostor" : gameWinner ? "tripulantes" : "default"];

  const handlePlayAgain = () => {
    resetGame?.();
    navigation.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "OfflineSetup" }],
    });
  };

  const handleBackToMenu = () => {
    resetGame?.();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  // --- Fallback sin ganador ---
  if (!gameWinner) {
    return (
      <LinearGradient
        colors={["#66BB6A", "#2E7D32", "#1B5E20"]}
        style={styles.container}
      >
        <View style={[styles.scoreboard, { borderColor: "#AAA" }]}>
          <Text style={[styles.title, { color: "#FFF" }]}>
            PARTIDO ANULADO
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FFF" }]}
            onPress={() => {
              playSound("click");
              handleBackToMenu();
            }}
          >
            <Text style={[styles.buttonText, { color: "#333" }]}>
              IR AL VESTUARIO
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // --- Resultado Final ---
  return (
    <LinearGradient
      colors={["#66BB6A", "#2E7D32", "#1B5E20"]}
      style={styles.container}
    >
      <View
        style={[
          styles.scoreboard,
          {
            backgroundColor: currentTheme.scoreboardColor,
            borderColor: currentTheme.borderColor,
          },
        ]}
      >
        <View style={styles.lightsContainer}>
          <View
            style={[styles.light, { backgroundColor: currentTheme.textColor }]}
          />
          <View
            style={[styles.light, { backgroundColor: currentTheme.textColor }]}
          />
          <View
            style={[styles.light, { backgroundColor: currentTheme.textColor }]}
          />
        </View>

        <Text style={[styles.title, { color: currentTheme.textColor }]}>
          {currentTheme.title}
        </Text>


        <Text style={[styles.subtitle, { color: "#FFF" }]}>
          {currentTheme.subtitle}
        </Text>

        <View style={{ width: "100%", marginTop: 30 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentTheme.buttonColor }]}
            onPress={() => {
              playSound("click");
              handlePlayAgain();
            }}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>
              ¡REVANCHA!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#CFD8DC" }]}
            onPress={() => {
              playSound("click");
              handleBackToMenu();
            }}
          >
            <Text style={[styles.buttonText, { color: "#455A64" }]}>
              VESTUARIO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  scoreboard: {
    alignItems: "center",
    padding: 30,
    borderRadius: 20,
    borderWidth: 6, // Borde grueso estilo marco de pantalla
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20,
    width: "95%",
    maxWidth: 450,
  },
  lightsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '50%',
      marginBottom: 20,
      opacity: 0.8
  },
  light: {
      width: 12,
      height: 12,
      borderRadius: 6,
      shadowColor: "#fff",
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 5
  },
  title: {
    fontSize: 38, 
    textAlign: "center",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
    lineHeight: 45,
    marginBottom: 10
  },
  subtitle: {
      fontSize: 20,
      fontFamily: "LuckiestGuy_400Regular",
      textAlign: 'center',
      opacity: 0.9,
      marginBottom: 10
  },
  button: {
    width: "100%", 
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  buttonText: {
    fontSize: 24,
    fontFamily: "LuckiestGuy_400Regular",
    textTransform: "uppercase"
  },
});