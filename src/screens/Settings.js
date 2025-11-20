import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"; // Agregamos ActivityIndicator
import { useGameContext } from "../context/GameContext";

export default function Settings({ navigation }) {
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });
  const { soundEnabled, setSoundEnabled} = useGameContext();


  const saveSettings = async () => {
    try {
      // Guardamos el objeto completo de configuración
      await AsyncStorage.setItem("settings", JSON.stringify({ soundEnabled }));
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar configuración:", error);
    }
  };

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" style={styles.loading} />;

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      {/* Nuevo Contenedor de Opciones */}
      <View style={styles.settingsBox}>
        <View style={styles.settingRow}>
          <Text style={styles.label}>Sonido del Juego 🔊</Text>
          <Switch
            // Colores más contrastantes para el switch
            trackColor={{ false: "#767577", true: "#FFD93D" }} 
            thumbColor={soundEnabled ? "#0D1B2A" : "#F4F3F4"}
            ios_backgroundColor="#3e3e3e"
            value={soundEnabled}
            onValueChange={(value) => setSoundEnabled(value)}
          />
        </View>
        
        {/* Aquí podríamos agregar más opciones en el futuro */}
      </View>
      
      <View style={styles.buttonGroup}>
        {/* Botón Guardar (Primario) */}
        <TouchableOpacity 
          style={[styles.btn, styles.primaryBtn]} 
          onPress={saveSettings}
        >
          <Text style={styles.primaryBtnText}>Guardar Cambios</Text>
        </TouchableOpacity>

        {/* Botón Volver (Secundario) */}
        <TouchableOpacity 
          style={[styles.btn, styles.secondaryBtn]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryBtnText}>Volver sin Guardar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: "#0D1B2A" },
  container: { 
    flex: 1, 
    justifyContent: "flex-start", // Alineamos arriba para centrar el panel
    alignItems: "center", 
    paddingTop: 80, // Espacio superior
    paddingHorizontal: 25 
  },
  title: {
    fontSize: 40, // Más grande
    color: "#FFD93D",
    fontFamily: "LuckiestGuy_400Regular",
    marginBottom: 40,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  
  // --- Contenedor de Opciones ---
  settingsBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Fondo semi-transparente
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#415A77", // Borde sutil
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  settingRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1, // Separador para cada opción
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  label: {
    fontSize: 24, // Texto más grande para la etiqueta
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // --- Botones ---
  buttonGroup: {
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
  },
  btn: {
    width: "100%", // Ocupa todo el ancho del grupo (máx 400)
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  // Estilo Primario: Guardar
  primaryBtn: {
    backgroundColor: "#6C63FF", // Púrpura/Azul para la acción principal
  },
  primaryBtnText: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
  },
  // Estilo Secundario: Volver
  secondaryBtn: {
    backgroundColor: "transparent", // Fondo transparente
    borderWidth: 2,
    borderColor: "#FFD93D", // Borde amarillo
    marginTop: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  secondaryBtnText: {
    fontSize: 22,
    color: "#FFD93D",
    fontFamily: "LuckiestGuy_400Regular",
  },
});