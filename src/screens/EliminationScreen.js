import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useGameContext } from "../context/GameContext";

export default function EliminationScreen({ route, navigation }) {
  const { eliminatedPlayer, wasImpostor } = route.params;
  const fade = useRef(new Animated.Value(1)).current;
  const moveUp = useRef(new Animated.Value(0)).current;
  const { gameWinner } = useGameContext();
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(moveUp, {
        toValue: -120,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start(() => {
      if (gameWinner) { // Si hay ganador, vamos a la pantalla de resultados
        navigation.replace("Result");
      } else { // Si no hay ganador, volvemos al juego
        navigation.replace("Game");
      }
    });
    }, [gameWinner, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ translateY: moveUp }] }}>
        <Text style={styles.eliminatedText}>
          ❌ {eliminatedPlayer.name} fue eliminado
        </Text>
        <Text style={styles.resultText}>
          {wasImpostor ? "😈 ERA el impostor!" : "😬 No era el impostor..."}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b2335",
    justifyContent: "center",
    alignItems: "center",
  },
  eliminatedText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  resultText: {
    fontSize: 20,
    color: "#ffd84d",
    marginTop: 10,
    textAlign: "center",
  }
});
