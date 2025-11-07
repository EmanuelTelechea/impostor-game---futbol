import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet, Text } from "react-native";
import { useGameContext } from "../context/GameContext";

export default function EliminationScreen({ route, navigation }) {
  const { eliminatedPlayer, wasImpostor } = route.params;
  const { gameWinner } = useGameContext();

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2200),
      Animated.timing(fade, {
        toValue: 0,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (gameWinner) {
        navigation.replace("Result");
      } else {
        navigation.replace("Game");
      }
    });
  }, [gameWinner, navigation]);

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  const gradientColors = wasImpostor
    ? ["#450920", "#831843", "#BE123C"]
    : ["#0D1B2A", "#1B263B", "#415A77"];

  const textColor = wasImpostor ? "#FFD93D" : "#B5FF9E";

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={[styles.eliminatedText, { color: "#FFF" }]}>
          ❌ {eliminatedPlayer.name.toUpperCase()} FUE ELIMINADO
        </Text>

        <Text style={[styles.resultText, { color: textColor }]}>
          {wasImpostor ? "😈 ERA EL IMPOSTOR!" : "😬 NO ERA EL IMPOSTOR..."}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  eliminatedText: {
    fontSize: 36,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
  },
  resultText: {
    fontSize: 28,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    marginTop: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
  },
});
