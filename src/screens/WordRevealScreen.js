import { useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
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
    getSubCategories
  } = useContext(GameContext);

  const route = useRoute();
  const params = route?.params ?? {}; // ← ✅ protección segura
  const paramWord = params.word ?? null;
  const paramCategory = params.category ?? null;
  const paramSubCategory = params.subCategory ?? null;

  const [category, setCategory] = useState(paramCategory || null);
  const [subCategory, setSubCategory] = useState(paramSubCategory || null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const flip = useSharedValue(0);

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

  // Si vino con categoría y subcategoría desde OfflineSetupScreen → arrancar directo
  useEffect(() => {
    if (paramCategory && paramSubCategory && players.length > 0) {
      startGame(players.length >= 5 ? 2 : 1, paramCategory, paramSubCategory);
    }
  }, [paramCategory, paramSubCategory, players]);

  // sincronizar palabra del contexto o parámetro
  useEffect(() => {
    if (paramWord) {
      if (typeof setWord === "function") setWord(paramWord);
      return;
    }

    // Si nos dieron categoría y subcategoría pero NO palabra, entonces sí iniciar la partida aquí
    if (!paramWord && paramCategory && paramSubCategory && players.length > 0) {
      startGame(players.length >= 5 ? 2 : 1, paramCategory, paramSubCategory);
    }
  }, [paramWord, paramCategory, paramSubCategory, players, setWord, startGame]);


  const reveal = () => {
    flip.value = withTiming(180, { duration: 500 });
    setTimeout(() => setRevealed(true), 250);
  };

  const hide = () => {
    flip.value = withTiming(0, { duration: 500 });
    setTimeout(() => setRevealed(false), 250);
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

  // Si no hay jugadores
  if (!Array.isArray(players) || players.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay jugadores</Text>
      </View>
    );
  }

  // Si no hay categoría (modo manual)
  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎯 Elegí una categoría</Text>

        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((cat) => (
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
          ))
        ) : (
          <Text style={{ color: "#ccc", marginTop: 20 }}>
            No hay categorías disponibles
          </Text>
        )}
      </View>
    );
  }

  // Si hay categoría pero falta subcategoría
  if (category && !subCategory) {
    const subs = getSubCategories(category);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📂 {category.toUpperCase()}</Text>
        <Text style={{ color: "#fff", marginBottom: 10 }}>Elegí una subcategoría</Text>
        {subs.map((sub) => (
          <TouchableOpacity
            key={sub}
            style={styles.button}
            onPress={() => {
              setSubCategory(sub);
              startGame(players.length >= 5 ? 2 : 1, category, sub);
              if (typeof setGlobalCategory === "function") setGlobalCategory(category);
            }}
          >
            <Text style={styles.buttonText}>{sub.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  const player = players[index];
  const displayWord = paramWord ?? contextWord ?? "Palabra no disponible";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{player.name}, toca para ver tu rol</Text>
      <Text style={styles.categoryText}>
        Categoría: {category.toUpperCase()} / {subCategory.toUpperCase()}
      </Text>

      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontStyle]}>
          <Text style={styles.cardText}>Toca para ver</Text>
        </Animated.View>

        <Animated.View style={[styles.card, backStyle]}>
          <Text style={styles.cardText}>
            {String(player.id) === String(impostorId)
              ? "IMPOSTOR 😈"
              : `Palabra:\n${displayWord}`}
          </Text>
        </Animated.View>
      </View>

      {!revealed ? (
        <TouchableOpacity style={styles.button} onPress={reveal}>
          <Text style={styles.buttonText}>Ver rol</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.secondaryBtn} onPress={hide}>
          <Text style={styles.secondaryBtnText}>Ocultar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={next}>
        <Text style={styles.buttonText}>
          {index === players.length - 1 ? "Listo para jugar" : "Siguiente jugador"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1F2F" },
  title: { fontSize: 24, fontWeight: "900", marginBottom: 20, color: "#fff", textAlign: "center" },
  categoryText: { color: "#FFD93D", fontSize: 18, marginBottom: 10 },
  button: { backgroundColor: "#6C63FF", padding: 14, borderRadius: 14, marginTop: 15, width: 240 },
  buttonText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: "bold" },
  secondaryBtn: { backgroundColor: "#444", padding: 12, borderRadius: 12, marginTop: 8, width: 220 },
  secondaryBtnText: { color: "white", fontSize: 16, textAlign: "center" },
  cardContainer: { width: 280, height: 180, marginBottom: 15 },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFD93D",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: { fontSize: 26, fontWeight: "bold", textAlign: "center", color: "#2B2D42" },
});
