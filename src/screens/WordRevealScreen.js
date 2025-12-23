import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GameContext } from "../context/GameContext";
import { playMusic, playSound } from "../utils/soundManager";

// ----------------------------------------------------
// FUNCIÓN DE AJUSTE DINÁMICO DEL TAMAÑO DE FUENTE (JUGADA)
// ----------------------------------------------------
const getFontSizeForWord = (word) => {
  if (!word) return 55;
  const length = word.length;
  const MAX_FONT_SIZE = 55;
  const MIN_FONT_SIZE = 30;
  let size = MAX_FONT_SIZE - (length * 1.5); 
  if (length > 15) {
    size = MAX_FONT_SIZE - (length * 2.5); 
  }
  return Math.max(MIN_FONT_SIZE, Math.floor(size));
};

// ----------------------------------------------------
// FUNCIÓN DE AJUSTE DINÁMICO DEL TAMAÑO DE FUENTE (NOMBRES)
// ----------------------------------------------------
const getFontSizeForName = (name) => {
    if (!name) return 60; 
    const length = name.length;
    const MAX_FONT_SIZE = 60;
    const MIN_FONT_SIZE = 35;
    let size = MAX_FONT_SIZE - (length * 2); 
    if (length > 12) {
        size = MAX_FONT_SIZE - (length * 3);
    }
    return Math.max(MIN_FONT_SIZE, Math.floor(size));
};


// ----------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------

export default function WordRevealScreen({ navigation }) {
  const {
    players,
    setWord: setContextWord,
    setHint: setContextHint,
    setImpostorIds: setContextImpostorIds,
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
  const paramImpostorIds = params.impostorIds ?? [];
  const hintsEnabled = params.hintsEnabled ?? false;
  const displayHint = params.hint ?? "VAR no disponible";
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
    transform: [{ rotateY: `${flip.value - 180}deg` }],
    backfaceVisibility: "hidden",
    position: "absolute",
  }));

  useEffect(() => {
      playMusic(
        "suspense",
        require("../assets/music/suspense.mp3"),
        0.3
      );
    }, []);

  useEffect(() => {
    if (paramWord && paramImpostorIds.length > 0) {
      console.log("🔄 Sincronizando Táctica:", paramImpostorIds);
      setContextWord(paramWord);
      setContextImpostorIds(paramImpostorIds);
      if (displayHint) setContextHint(displayHint);
    }
    else if (!paramWord && players.length > 0) {
      console.log("⚠️ Balón perdido, reiniciando partido...");
      startGame(null, paramCategory, paramSubCategory);
    }
  }, [paramWord, paramImpostorIds, setContextWord, setContextImpostorIds, displayHint, players.length, startGame, paramCategory, paramSubCategory, setContextHint]);


  const toggleFlip = () => {
    const newValue = revealed ? 0 : 180;
    flip.value = withTiming(newValue, { duration: 600 });
    setRevealed(!revealed);
    playSound('giro');
  };

  const next = () => {
    flip.value = 0;
    setRevealed(false);

    if (index === players.length - 1) {
      navigation.replace("Game", {
        impostorIds: paramImpostorIds,
        word: paramWord,
        category,
        subCategory
      });
    } else {
      setIndex(index + 1);
    }
  };

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFF" />;

  // ESTADO 1: No hay jugadores
  if (!Array.isArray(players) || players.length === 0) {
    return (
      <LinearGradient colors={["#1B5E20", "#2E7D32", "#66BB6A"]} style={styles.container}>
        <Text style={[styles.title, { marginBottom: 30, color: '#FFF' }]}>Vestuario Vacío</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#D32F2F', width: 250 }]}
          onPress={() => navigation.navigate("OfflineSetup")}
        >
          <Text style={styles.buttonText}>Fichar Jugadores</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // ESTADO 2: Elegir Categoría (Copa)
  if (!category && !subCategory) {
    return (
      <LinearGradient colors={["#1B5E20", "#2E7D32", "#66BB6A"]} style={styles.container}>
        <Text style={[styles.title, { marginBottom: 30, color: '#FFEB3B' }]}>Elige la Copa </Text>
        <View style={styles.categoryBox}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.button, { backgroundColor: '#FFEB3B' }]}
              onPress={() => {
                setCategory(cat);
                if (typeof setGlobalCategory === "function") setGlobalCategory(cat);
                playSound('click');
              }}
            >
              <Text style={[styles.buttonText, { color: '#1B5E20' }]}>{cat.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    );
  }

  // ESTADO 3: Elegir Subcategoría (Liga)
  if (category && !subCategory) {
    const subs = getSubCategories(category);
    return (
      <LinearGradient colors={["#1B5E20", "#2E7D32", "#66BB6A"]} style={styles.container}>
        <Text style={[styles.title, { marginBottom: 10, color: '#FFF' }]}>{category.toUpperCase()}</Text>
        <Text style={[styles.subtitle, { marginBottom: 30, color: '#FFEB3B' }]}>Elige la División</Text>
        <View style={styles.categoryBox}>
          {subs.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={[styles.button, { backgroundColor: '#FFEB3B' }]}
              onPress={() => {
                setSubCategory(sub);
                startGame(null, category, sub);
                playSound('click');
              }}
            >
              <Text style={[styles.buttonText, { color: '#1B5E20' }]}>{sub.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    );
  }

  // ESTADO 4: Revelación (Carta de Jugador)
  const player = players[index];
  if (!player) return <ActivityIndicator size="large" color="#FFF" />;
  const cardColor = player.color || "#FFD93D";
  const isImpostor = paramImpostorIds.includes(player.id);
  
  const dynamicTextColor = cardColor; 
  const dynamicBorderColor = cardColor; 
  
  const dynamicWordFontSize = getFontSizeForWord(paramWord); 
  const dynamicNameFontSize = getFontSizeForName(player.name);

  const isSubCategoryGeneralOrNull = !subCategory || subCategory.trim().toLowerCase() === "general";
  const displaySubCategoryText = isSubCategoryGeneralOrNull ? "" : subCategory.toUpperCase();


  return (
    <LinearGradient colors={["#66BB6A", "#2E7D32", "#1B5E20"]} style={styles.container}>
      <Text style={styles.title}>{player.name}, ven al VAR</Text>

      <TouchableOpacity
        style={[styles.cardContainer, { 
          shadowColor: "#000", // Sombra negra para resaltar en el césped
        }]}
        onPress={() => { 
          playSound("giro");
          toggleFlip(); }}
        activeOpacity={0.9}
      >
        {/* Frente (Cromo de Jugador / Camiseta) */}
        <Animated.View 
          style={[
            styles.card, 
            { backgroundColor: "#FFF" }, // Fondo blanco estilo tarjeta clásica
            styles.cardBorderFrame,
            { borderColor: dynamicBorderColor, backgroundColor: cardColor }, // Borde y fondo interno del color del jugador
            frontStyle
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.categoryDisplay}>
                {/* Icono de trofeo o balón sutil arriba */}
                <Text style={{fontSize: 40}}>🏆</Text>
                <Text style={[styles.categoryText, { color: "#FFF" }]}>{category.toUpperCase()}</Text>
                
                {!isSubCategoryGeneralOrNull && (
                    <Text style={[styles.subcategoryText, { color: "#EEE" }]}>
                        {displaySubCategoryText}
                    </Text>
                )}
            </View>
            
            <Text style={[
                styles.cardPlayer, 
                { 
                    color: "#FFF",
                    fontSize: dynamicNameFontSize,
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowRadius: 5
                }
            ]}>
                {player.name}
            </Text>
            <Text style={[styles.tapText, { color: "#FFF" }]}>Toca para ver tu Táctica</Text>
          </View>
        </Animated.View>

        {/* Reverso (La Jugada Secreta) */}
        <Animated.View 
          style={[
            styles.card, 
            { backgroundColor: cardColor }, 
            styles.cardBorderFrame,
            { borderColor: "#FFF", borderWidth: 5 }, // Borde blanco interno en el reverso
            backStyle
          ]}
        >
          <View style={styles.cardContent}>

            {isImpostor ? (
              <View style={styles.impostorContainer}>
                <Text style={[styles.cardBack, { color: "#FFF", fontSize: dynamicWordFontSize, textShadowColor: 'rgba(0,0,0,0.8)' }]}>
                    ¡SIMULADOR!
                </Text>
                
                {hintsEnabled && (
                  <View style={styles.hintBox}>
                    <Text style={styles.hintLabel}>Pista:</Text>
                    <Text style={styles.hintText}>{displayHint}</Text>
                  </View>
                )}
                
                <Text style={[styles.impostorAdvice, { color: "#FFF" }]}>
                    ¡Finge, que no te saquen la Roja!
                </Text>
              </View>
            ) : (
              <View style={{alignItems:'center'}}>
                  <Text style={[styles.cardBack, { color: "#FFF", fontSize: dynamicWordFontSize, textShadowColor: 'rgba(0,0,0,0.8)' }]}>
                    {paramWord}
                  </Text>
                  <Text style={[styles.impostorAdvice, { color: "#EEE", bottom: -60 }]}>
                    Juega en equipo
                  </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={() => {
          if (index === players.length - 1) {
            playSound('start');
          }
          next();
        }}
      >
        <Text style={styles.buttonText}>
          {index === players.length - 1 ? "¡Pitazo Inicial!" : "Siguiente Jugador"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20 
  },
  
  // --- Títulos ---
  title: {
    fontSize: 38, 
    color: "#FFF",
    marginBottom: 20, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: { 
    fontSize: 22,
    color: "#E8F5E9",
    marginBottom: 20, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    opacity: 0.9
  },
  
  // --- Contenedor de Categorías ---
  categoryBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFF", // Línea de cal
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },

  // --- Carta de Revelación (Estilo Cromo FUT) ---
  cardContainer: { 
    width: "85%", // Un poco más estrecha como carta de fútbol
    maxWidth: 380, 
    height: "60%",
    minHeight: 400, 
    marginBottom: 30, 
    perspective: 1000, 
    shadowOpacity: 0.6, 
    shadowRadius: 15, 
    shadowOffset: { width: 0, height: 8 }, 
    elevation: 20,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 5, // Pequeño padding para el borde exterior
  },
  cardBorderFrame: {
    borderWidth: 4, 
    borderColor: '#FFD700', // Dorado por defecto (se sobreescribe dinámicamente)
    backgroundColor: '#1B263B', 
    borderRadius: 20,
    padding: 0, 
  },
  cardContent: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14, // Ligeramente menos que la tarjeta
    backgroundColor: "rgba(0,0,0,0.15)", // Sombreado interno sutil
    width: "100%", 
    height: "100%", 
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)" // Borde interno fino
  },

  // --- Contenido Frente ---
  categoryDisplay: {
    position: 'absolute',
    top: 20, 
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryText: {
    fontSize: 30,
    fontFamily: "LuckiestGuy_400Regular",
    marginTop: 5
  },
  subcategoryText: {
    fontSize: 24, 
    opacity: 0.9,
    fontFamily: "LuckiestGuy_400Regular",
    marginTop: 5
  },

  cardPlayer: {
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    lineHeight: 85,
    marginTop: 40, 
  },
  tapText: {
    position: 'absolute', 
    bottom: 25,
    fontSize: 18, 
    opacity: 0.9, 
    fontFamily: "LuckiestGuy_400Regular",
    textTransform: 'uppercase'
  },
  cardBack: {
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    lineHeight: 60,
    paddingHorizontal: 10
  },
  
  // --- Impostor / VAR ---
  impostorContainer: { 
    alignItems: "center", 
    justifyContent: "center", 
    width: "100%",
    flex: 1, 
    marginTop: 0, 
    position: 'relative', 
  },
  impostorAdvice: { 
    position: 'absolute', 
    bottom: 30, 
    fontSize: 20, 
    opacity: 0.9, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 3
  },
  hintBox: {
    marginTop: 25, 
    padding: 15, 
    backgroundColor: "rgba(0,0,0,0.6)", 
    borderRadius: 10, 
    width: "90%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: '#FFEB3B', 
  },
  hintLabel: {
    fontSize: 20, 
    color: "#FFEB3B", 
    marginBottom: 5,
    fontFamily: "LuckiestGuy_400Regular",
  },
  hintText: {
    fontSize: 28, 
    color: "#FFF", 
    textAlign: "center",
    fontFamily: "LuckiestGuy_400Regular",
  },
  
  // --- Botones ---
  button: {
    width: "100%",
    maxWidth: 380,
    paddingVertical: 18, 
    paddingHorizontal: 20,
    borderRadius: 50, // Botones redondos estilo deporte
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5, 
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)"
  },
  nextButton: {
    backgroundColor: "#FFEB3B", // Amarillo tarjeta
    marginTop: 20, 
    borderColor: "#FBC02D"
  },
  buttonText: {
    color: "#333", // Texto oscuro para botón amarillo
    fontSize: 24, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textTransform: "uppercase"
  },
});