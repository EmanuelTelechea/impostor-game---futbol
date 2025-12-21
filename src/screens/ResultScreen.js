import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameContext } from "../context/GameContext";

export default function ResultScreen() {
  const navigation = useNavigation();
  const { gameWinner, resetGame } = useContext(GameContext);
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  // --- Lógica del ganador y colores ---
  const normalized = String(gameWinner || "").toLowerCase(); // Aseguramos que sea una cadena para evitar problemas
  const isImpostor = normalized === "impostor";

  const titleText = isImpostor ? "¡El impostor ganó!" : "¡La tripulación gana!";
  const emoji = isImpostor ? "" : "";
  const resultTitle = `${emoji} ${titleText}`;
  
  // Colores para el tema de la pantalla (gradiente de fondo y colores primarios)
  const theme = {
    impostor: {
      gradient: ["#450920", "#831843", "#BE123C"], // Rojos oscuros y dramáticos
      primaryColor: "#FFD93D", // Amarillo de contraste para el Impostor
    },
    tripulantes: {
      gradient: ["#0D1B2A", "#1B263B", "#415A77"], // Azules oscuros
      primaryColor: "#B5FF9E", // Verde/Lima de contraste para la Tripulación
    },
    default: {
      gradient: ["#0D1B2A", "#1B263B", "#415A77"],
      primaryColor: "#FFD93D",
    },
  };
  
  const currentTheme = theme[isImpostor ? 'impostor' : 'tripulantes'] || theme.default;
  const buttonColor = currentTheme.primaryColor;

  // Si no hay ganador, mostrar fallback
  if (!gameWinner) {
    // ... (El fallback se mantiene igual, pero aplicamos los nuevos estilos de botón)
    return (
      <LinearGradient colors={currentTheme.gradient} style={styles.container}>
        <Text style={[styles.title, { color: currentTheme.primaryColor }]}>No hay resultado</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30" }]}
          onPress={() => {
            resetGame && resetGame();
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          }}
        >
          <Text style={styles.buttonText}>Volver al menú</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={() => {
            resetGame && resetGame();
            navigation.reset({
              index: 1,
              routes: [{ name: "Home" }, { name: "OfflineSetup" }],
            });
          }}
        >
          <Text style={[styles.buttonText, { color: "#000" }]}>Configurar jugadores</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // ... (Funciones handlePlayAgain y handleBackToMenu se mantienen)

  const handlePlayAgain = () => {
    resetGame && resetGame();
    navigation.reset({
      index: 1,
      routes: [{ name: "Home" }, { name: "OfflineSetup" }],
    });
  };

  const handleBackToMenu = () => {
    resetGame && resetGame();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  // --- Renderizado de resultados ---
  return (
    <LinearGradient colors={currentTheme.gradient} style={styles.container}>
      <View style={[styles.resultBox, { borderColor: buttonColor }]}>
        <Text style={[styles.title, { color: currentTheme.primaryColor }]}>{resultTitle}</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handlePlayAgain}
        >
          <Text style={[styles.buttonText, { color: "#000" }]}>JUGAR DE NUEVO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30" }]}
          onPress={handleBackToMenu}
        >
          <Text style={styles.buttonText}>VOLVER AL MENÚ</Text>
        </TouchableOpacity>
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
  resultBox: {
    // Estilo de caja modal más prominente, similar al de EliminationScreen
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.95)", // Fondo oscuro y semi-transparente
    padding: 35,
    borderRadius: 15,
    borderWidth: 4, // Borde más grueso
    borderColor: "#FFD93D", // Este será sobrescrito por el color del ganador
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
    width: "90%",
  },
  title: {
    fontSize: 36, // Aumentamos el tamaño
    textAlign: "center",
    fontFamily: "LuckiestGuy_400Regular",
    marginBottom: 40,
    textShadowColor: "#000",
    textShadowOffset: { width: 4, height: 4 }, // Sombra más grande y dramática
    textShadowRadius: 8,
    lineHeight: 55, // Mejoramos el espaciado si el texto es largo
  },
  button: {
    // Estilo de botón consistente con VotingScreen
    width: "100%", // Ocupa todo el ancho de resultBox
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    // Sombra más sutil en el botón
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: "LuckiestGuy_400Regular",
    color: "#fff",
  },
});