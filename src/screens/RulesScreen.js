import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RulesScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFF" />;

  return (
    // Fondo de Césped
    <LinearGradient colors={["#66BB6A", "#2E7D32", "#1B5E20"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📜 REGLAMENTO</Text>

        {/* Caja estilo Pizarra Táctica */}
        <View style={styles.rulesBox}> 
          <Text style={styles.text}>
            <Text style={styles.highlight}>LA PREVIA:</Text> Todo el equipo recibe la <Text style={styles.highlight}>TÁCTICA SECRETA</Text>, excepto el <Text style={styles.impostorText}>SIMULADOR</Text>, que entra a la cancha sin saber nada.
            {"\n\n"}
            <Text style={styles.highlight}>EL PARTIDO:</Text> Por turnos, describan la jugada sin ser demasiado obvios. Si sos el Simulador, ¡mentí y actuá para que no te descubran!
            {"\n\n"}
            <Text style={styles.highlight}>EL VAR:</Text> Al final de la ronda, todos votan quién merece la Roja. El más votado se va a las duchas.
            {"\n\n"}
            <Text style={styles.highlight}>VICTORIA:</Text> Si expulsan al Simulador, gana el <Text style={styles.highlight}>JUEGO LIMPIO</Text>.
            {"\n\n"}
            <Text style={styles.highlight}>DERROTA:</Text> Si expulsan a demasiados inocentes y el Simulador iguala en número al equipo, ¡él gana el partido!
            {"\n\n"}
          </Text>
          
          {/* Consejo del DT */}
          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>CONSEJO DEL DT</Text>
            <Text style={styles.tipText}>
               "Tocá y pasá. Da pistas cortas... no le regales la estrategia al rival."
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>VOLVER A LA CANCHA</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scroll: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 25,
    paddingTop: 60, 
  },
  title: {
    fontSize: 42, 
    color: "#FFF",
    marginBottom: 30,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.8)", 
    textShadowOffset: { width: 3, height: 3 }, 
    textShadowRadius: 5,
    letterSpacing: 1
  },
  rulesBox: {
    width: "100%", 
    maxWidth: 600, 
    backgroundColor: "rgba(0, 50, 0, 0.7)", // Verde muy oscuro transparente
    padding: 25,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFF", // Borde blanco pizarra
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  text: {
    color: "#E0E0E0", // Blanco hueso
    fontSize: 18,
    lineHeight: 28, 
    textAlign: "left",
    marginBottom: 10,
    fontFamily: "LuckiestGuy_400Regular", // Usamos la fuente también aquí para estilo cartoon
  },
  highlight: {
    color: "#FFEB3B", // Amarillo
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 2
  },
  impostorText: {
      color: "#FF5252", // Rojo claro
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowRadius: 2
  },
  
  // Sección Consejo
  tipContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    alignItems: 'center'
  },
  tipTitle: {
      color: "#FFF",
      fontSize: 20,
      fontFamily: "LuckiestGuy_400Regular",
      marginBottom: 5
  },
  tipText: {
    color: "#B5FF9E", // Verde claro fosforescente
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  
  // Botón
  btn: {
    marginTop: 30,
    backgroundColor: "#FFF", // Blanco (Balón)
    width: "100%",
    maxWidth: 400,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 2,
    borderColor: '#DDD'
  },
  btnText: {
    fontSize: 22,
    color: "#2E7D32", // Texto Verde
    fontFamily: "LuckiestGuy_400Regular",
  },
});