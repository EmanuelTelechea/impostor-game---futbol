import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text } from "react-native";

export default function AppLoadingScreen({ onFinish }) {
  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Pequeño delay para que no parpadee
      const t = setTimeout(() => {
        onFinish();
      }, 600);

      return () => clearTimeout(t);
    }
  }, [fontsLoaded]);

  return (
    <LinearGradient
      colors={["#66BB6A", "#2E7D32", "#1B5E20"]}
      style={styles.container}
    >
      <Image source={require("../../assets/images/splash-removebg-preview.png")} style={{ width: 450, height: 250, marginBottom: 50 }} />
      <Text style={styles.subtitle}>Cargando partido...</Text>

      <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 30 }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    color: "#FFFFFF",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#E0E0E0",
    marginTop: 10,
  },
});
