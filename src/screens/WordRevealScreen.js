import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GameContext } from "../context/GameContext";

export default function WordRevealScreen({ navigation }) {
  const {
    players,
    word: contextWord,
    setWord,
    impostorId,
    startGame,
    categories,
    setCategory: setGlobalCategory,
    getSubCategories,
  } = useContext(GameContext);

  const route = useRoute();
  const params = route?.params ?? {};
  const paramWord = params.word ?? null;
  const paramCategory = params.category ?? null;
  const paramSubCategory = params.subCategory ?? null;

  const [category, setCategory] = useState(paramCategory || null);
  const [subCategory, setSubCategory] = useState(paramSubCategory || null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const flip = useSharedValue(0);
  const [fontsLoaded] = useFonts({ LuckiestGuy_400Regular });

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flip.value}deg` }],
    backfaceVisibility: "hidden",
    position: "absolute",
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flip.value + 180}deg` }],
    backfaceVisibility: "hidden",
    position: "absolute",
  }));

  useEffect(() => {
    if (paramCategory && paramSubCategory && players.length > 0) {
      startGame(players.length >= 5 ? 2 : 1, paramCategory, paramSubCategory);
    }
  }, [paramCategory, paramSubCategory, players]);

  useEffect(() => {
    if (paramWord) {
      if (typeof setWord === "function") setWord(paramWord);
      return;
    }

    if (!paramWord && paramCategory && paramSubCategory && players.length > 0) {
      startGame(players.length >= 5 ? 2 : 1, paramCategory, paramSubCategory);
    }
  }, [paramWord, paramCategory, paramSubCategory, players, setWord, startGame]);

  const toggleFlip = () => {
    const newValue = revealed ? 0 : 180;
    flip.value = withTiming(newValue, { duration: 600 });
    setRevealed(!revealed);
  };

  const next = () => {
    flip.value = 0;
    setRevealed(false);

    if (index === players.length - 1) {
      navigation.replace("Game");
    } else {
      setIndex(index + 1);
    }
  };

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  if (!Array.isArray(players) || players.length === 0) {
    return (
      <LinearGradient colors={["#2E0249", "#570A57", "#A91079"]} style={styles.container}>
        <Text style={styles.title}>No hay jugadores 😅</Text>
      </LinearGradient>
    );
  }

  if (!category) {
    return (
      <LinearGradient colors={["#16213E", "#0F3460", "#533483"]} style={styles.container}>
        <Text style={styles.title}>🎯 Elige una categoría</Text>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={styles.button}
            onPress={() => {
              setCategory(cat);
              if (typeof setGlobalCategory === "function") setGlobalCategory(cat);
            }}
          >
            <Text style={styles.buttonText}>{cat.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    );
  }

  if (category && !subCategory) {
    const subs = getSubCategories(category);
    return (
      <LinearGradient colors={["#16213E", "#0F3460", "#533483"]} style={styles.container}>
        <Text style={styles.title}>📂 {category.toUpperCase()}</Text>
        <Text style={styles.subtitle}>Elegí una subcategoría</Text>
        {subs.map((sub) => (
          <TouchableOpacity
            key={sub}
            style={styles.button}
            onPress={() => {
              setSubCategory(sub);
              startGame(players.length >= 5 ? 2 : 1, category, sub);
            }}
          >
            <Text style={styles.buttonText}>{sub.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    );
  }

  const player = players[index];
  const displayWord = paramWord ?? contextWord ?? "Palabra no disponible";
  const cardColor = player.color || "#FFD93D";

  return (
    <LinearGradient colors={["#0D1B2A", "#1B263B", "#415A77"]} style={styles.container}>
      <Text style={styles.title}>{player.name}, tu turno 👇</Text>
      <Text style={styles.subtitle}>
        {category.toUpperCase()} / {subCategory.toUpperCase()}
      </Text>

      {/* Carta que se gira al presionar */}
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={toggleFlip}
        activeOpacity={0.9}
      >
        {/* Frente */}
        <Animated.View style={[styles.card, { backgroundColor: cardColor }, frontStyle]}>
          <Text style={styles.cardPlayer}>{player.name}</Text>
          <Text style={styles.tapText}>Tocá para ver tu palabra 👀</Text>
        </Animated.View>

        {/* Reverso */}
        <Animated.View style={[styles.card, { backgroundColor: cardColor }, backStyle]}>
          <Text style={styles.cardBack}>
            {String(player.id) === String(impostorId)
              ? "IMPOSTOR 😈"
              : displayWord}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FF595E" }]}
        onPress={next}
      >
        <Text style={styles.buttonText}>
          {index === players.length - 1 ? "🚀 Listo para jugar" : "➡️ Siguiente jugador"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 32,
    color: "#FFD93D",
    marginBottom: 15,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#F8F9FA",
    marginBottom: 25,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  cardContainer: { width: 340, height: 300, marginBottom: 25, perspective: 1000 },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    paddingHorizontal: 15,
  },
  cardPlayer: {
    fontSize: 42,
    color: "#1E1F2F",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  tapText: {
    marginTop: 15,
    fontSize: 20,
    color: "#1E1F2F",
    opacity: 0.8,
    fontFamily: "LuckiestGuy_400Regular",
  },
  cardBack: {
    fontSize: 38,
    color: "#1E1F2F",
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
});
