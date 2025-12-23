import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GameContext } from "../context/GameContext";

// Sound helpers
import { playMusic, playSound, setSoundEnabled as setSMEnabled } from "../utils/soundManager";

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  const { soundEnabled, setSoundEnabled } = useContext(GameContext);

  useEffect(() => {
    playMusic(
      "menu",
      require("../assets/music/menu.mp3"),
      0.35
    );
  }, []);
  
  // ⬇️ recién ahora el return condicional
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FFF" />;
  }

  return (
    <LinearGradient
      colors={["#66BB6A", "#2E7D32", "#1B5E20"]}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.soundButton}
        onPress={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          setSMEnabled(next);
          if (next) playSound("click");
        }}
      >
        <Ionicons
          name={soundEnabled ? "volume-high" : "volume-mute"}
          size={40}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <Image source={require("../../assets/images/splash-removebg-preview.png")} style={{ width: 450, height: 250, marginBottom: 50 }} />

      <View style={styles.menuBox}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFFFFF" }]}
          onPress={() => {
            playSound("click");
            navigation.navigate("OfflineSetup");
          }}
        >
          <Text style={[styles.buttonText, { color: "#1B5E20" }]}>
            JUGAR PARTIDO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFEB3B" }]}
          onPress={() => {
            playSound("click");
            navigation.navigate("Rules");
          }}
        >
          <Text style={[styles.buttonText, { color: "#1B263B" }]}>
            REGLAMENTO
          </Text>
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
    fontSize: 45,
    color: "#f5d109ff", // Blanco para resaltar sobre el césped
    marginBottom: 40,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    paddingHorizontal: 10,
    textShadowColor: "rgba(0,0,0,0.6)", // Sombra para profundidad
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  menuBox: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semi-transparente
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#FFFFFF", // Borde blanco (Líneas de cal)
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  button: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 20, // Más redondeados, estilo deportivo
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)" // Sutil borde para definición
  },
  buttonText: {
    fontSize: 24, // Ligeramente más grande
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textTransform: "uppercase" // Fuerza mayúsculas
  },
  soundButton: {
  position: "absolute",
  top: 40,
  right: 20,
  width: 55,
  height: 55,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
},
});
