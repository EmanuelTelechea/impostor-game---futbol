import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../styles/theme";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> El juego del IMPOSTOR </Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate("OfflineSetup")}
        >
          <Text style={styles.btnText}>🎮 Jugar Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.btnText}>⚙️ Configuración</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 60,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 10,
    textAlign: "center"
  },
  menuContainer: {
    width: "100%",
    alignItems: "center"
  },
  btnPrimary: {
    width: "85%",
    backgroundColor: theme.colors.accent,
    paddingVertical: 22,
    marginBottom: 20,
    borderRadius: theme.radius * 1.4,
    alignItems: "center",
    ...theme.shadow
  },
  btn: {
    width: "85%",
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: theme.radius * 1.2,
    alignItems: "center",
    ...theme.shadow
  },
  btnText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000"
  }
});
