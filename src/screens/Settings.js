import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../styles/theme";

export default function Settings({ navigation }) {
  const [impostors, setImpostors] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const increaseImpostors = () => {
    setImpostors(prev => (prev < 3 ? prev + 1 : prev)); // máximo 3
  };

  const decreaseImpostors = () => {
    setImpostors(prev => (prev > 1 ? prev - 1 : prev)); // mínimo 1
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Configuración</Text>

      {/* Cantidad de impostores */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Impostores:</Text>

        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterBtn} onPress={decreaseImpostors}>
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.value}>{impostors}</Text>

          <TouchableOpacity style={styles.counterBtn} onPress={increaseImpostors}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sonido */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Sonidos:</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.btnText}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 25
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 40
  },
  settingRow: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15
  },
  label: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    width: 40,
    textAlign: "center",
    color: theme.colors.text
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  counterBtn: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadow
  },
  counterText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000"
  },
  btn: {
    marginTop: 50,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: theme.radius,
    ...theme.shadow
  },
  btnText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#000"
  }
});
