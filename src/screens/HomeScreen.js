import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <Text style={styles.title}>🎭 El juego del IMPOSTOR 🎭</Text>

      {/* Nuevo contenedor estilizado como caja de menú */}
      <View style={styles.menuBox}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#B5FF9E" }]} // Verde lima
          onPress={() => navigation.navigate("OfflineSetup")}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: "#1B263B" }]}>JUGAR OFFLINE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFD93D" }]} // Amarillo
          onPress={() => navigation.navigate("Rules")}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: "#1B263B" }]}>REGLAS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#415A77" }]} 
          onPress={() => navigation.navigate("Settings")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>CONFIGURACIÓN</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  title: {
    fontSize: 45, // Un poco más grande
    color: "#FFD93D",
    marginBottom: 50, // Separación del menú
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    paddingHorizontal: 15,
    textShadowColor: "rgba(0,0,0,0.9)", // Sombra más oscura
    textShadowOffset: { width: 4, height: 4 }, // Sombra más grande
    textShadowRadius: 8,
  },
  menuBox: {
    // Estilo de caja modal/agrupador
    width: "90%",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.9)", // Fondo oscuro semi-transparente
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#415A77", // Borde sutil
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  button: {
    width: "100%", // Ocupa todo el ancho de la caja
    paddingVertical: 18, // Ligeramente menos que los botones de resultado
    borderRadius: 12, // Coherente con VotingScreen
    alignItems: "center",
    marginVertical: 10,
    // Sombra para el botón
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    fontSize: 22,
    color: "#FFF", // Por defecto, texto blanco
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
});
