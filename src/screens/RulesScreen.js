import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RulesScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📜 Reglas del Juego</Text>

        <View style={styles.rulesBox}> 
          <Text style={styles.text}>
            🔹 Cada jugador recibe una palabra, excepto el impostor, que no la conoce.
            {"\n\n"}
            🔹 Los jugadores deben describir la palabra sin decirla directamente.
            {"\n\n"}
            🔹 En cada ronda, se vota quién creen que es el impostor.
            {"\n\n"}
            🔹 Si eliminan al impostor, los demás ganan.
            {"\n\n"}
            🔹 Si se eliminan jugadores inocentes, el juego continúa hasta descubrir al impostor o quedar pocos.
            {"\n\n"}
          </Text>
          <Text style={styles.tipText}>
            🧠 Consejo: describí con cuidado, ni muy directo... ni muy raro 😏
          </Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>VOLVER</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    // Eliminamos paddingTop del container, lo manejamos en scroll
  },
  scroll: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 25,
    paddingTop: 50, // Añadimos el padding superior aquí
  },
  title: {
    fontSize: 40, // Más grande
    color: "#FFD93D",
    marginBottom: 30,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.9)", // Sombra de texto dramática
    textShadowOffset: { width: 4, height: 4 }, 
    textShadowRadius: 8,
  },
  rulesBox: {
    // Estilo de caja modal/tarjeta para el contenido
    width: "100%", 
    maxWidth: 600, // Límite para pantallas grandes
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    padding: 25,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFD93D", // Borde amarillo para resaltar que es información clave
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 30, // Mayor altura de línea para mejor legibilidad
    textAlign: "left",
    marginBottom: 15,
  },
  tipText: {
    color: "#B5FF9E", // Color de contraste para el consejo
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    fontFamily: "LuckiestGuy_400Regular", // Usamos la fuente para destacar
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  btn: {
    // Estilo de botón consistente con HomeScreen
    marginTop: 40,
    backgroundColor: "#FF3B30", // Color rojo para un botón de acción secundaria
    width: "90%",
    maxWidth: 400,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btnText: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
  },
});