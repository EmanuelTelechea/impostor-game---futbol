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

// ----------------------------------------------------
// FUNCIÓN DE AJUSTE DINÁMICO DEL TAMAÑO DE FUENTE (PALABRAS)
// ----------------------------------------------------
const getFontSizeForWord = (word) => {
  if (!word) return 55; // Tamaño por defecto si no hay palabra
  const length = word.length;
  
  // Define un tamaño máximo y un tamaño mínimo
  const MAX_FONT_SIZE = 55;
  const MIN_FONT_SIZE = 30;
  
  // Ajuste basado en la longitud (se puede afinar con pruebas)
  let size = MAX_FONT_SIZE - (length * 1.5); 
  
  // Palabras muy largas requieren un ajuste más fuerte
  if (length > 15) {
    size = MAX_FONT_SIZE - (length * 2.5); 
  }

  return Math.max(MIN_FONT_SIZE, Math.floor(size));
};

// ----------------------------------------------------
// FUNCIÓN DE AJUSTE DINÁMICO DEL TAMAÑO DE FUENTE (NOMBRES)
// ----------------------------------------------------
const getFontSizeForName = (name) => {
    if (!name) return 60; // Tamaño por defecto
    const length = name.length;

    // Define un tamaño máximo y un tamaño mínimo
    const MAX_FONT_SIZE = 60;
    const MIN_FONT_SIZE = 35;
    
    // Ajuste más agresivo para nombres, ya que se centran en un área más pequeña.
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
  const displayHint = params.hint ?? "Pista no disponible";
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
    if (paramWord && paramImpostorIds.length > 0) {
      console.log("🔄 Sincronizando Contexto con Parametros:", paramImpostorIds);
      setContextWord(paramWord);
      setContextImpostorIds(paramImpostorIds);
      if (displayHint) setContextHint(displayHint);
    }
    else if (!paramWord && players.length > 0) {
      console.log("⚠️ Datos perdidos, reiniciando lógica interna...");
      startGame(null, paramCategory, paramSubCategory);
    }
  }, [paramWord, paramImpostorIds, setContextWord, setContextImpostorIds, displayHint, players.length, startGame, paramCategory, paramSubCategory, setContextHint]);


  const toggleFlip = () => {
    const newValue = revealed ? 0 : 180;
    flip.value = withTiming(newValue, { duration: 600 });
    setRevealed(!revealed);
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

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#FFD93D" />;

  // ESTADO 1, 2, 3: Lógica de selección de jugadores/categorías (sin cambios significativos)

  // ESTADO 1: No hay jugadores
  if (!Array.isArray(players) || players.length === 0) {
    return (
      <LinearGradient colors={["#2E0249", "#570A57", "#A91079"]} style={styles.container}>
        <Text style={[styles.title, { marginBottom: 30, color: '#FFD93D' }]}>No hay jugadores</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FF595E', width: 250 }]}
          onPress={() => navigation.navigate("OfflineSetup")}
        >
          <Text style={styles.buttonText}>Configurar Jugadores</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // ESTADO 2: Elegir Categoría
  if (!category && !subCategory) {
    return (
      <LinearGradient colors={["#16213E", "#0F3460", "#533483"]} style={styles.container}>
        <Text style={[styles.title, { marginBottom: 30, color: '#B5FF9E' }]}>Elige una categoria</Text>
        <View style={styles.categoryBox}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.button, { backgroundColor: '#FFD93D' }]}
              onPress={() => {
                setCategory(cat);
                if (typeof setGlobalCategory === "function") setGlobalCategory(cat);
              }}
            >
              <Text style={[styles.buttonText, { color: '#1B263B' }]}>{cat.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    );
  }

  // ESTADO 3: Elegir Subcategoría
  if (category && !subCategory) {
    const subs = getSubCategories(category);
    return (
      <LinearGradient colors={["#16213E", "#0F3460", "#533483"]} style={styles.container}>
        <Text style={[styles.title, { marginBottom: 10, color: '#B5FF9E' }]}>{category.toUpperCase()}</Text>
        <Text style={[styles.subtitle, { marginBottom: 30, color: '#FFD93D' }]}>Elegi una subcategoria</Text>
        <View style={styles.categoryBox}>
          {subs.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={[styles.button, { backgroundColor: '#FFD93D' }]}
              onPress={() => {
                setSubCategory(sub);
                startGame(null, category, sub);
              }}
            >
              <Text style={[styles.buttonText, { color: '#1B263B' }]}>{sub.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    );
  }

  // ESTADO 4: Revelación de la Palabra
  const player = players[index];
  if (!player) return <ActivityIndicator size="large" color="#FFD93D" />;
  const cardColor = player.color || "#FFD93D";
  const isImpostor = paramImpostorIds.includes(player.id);
  
  // Establecemos el color del borde y el texto al color del jugador.
  const dynamicTextColor = cardColor; 
  const dynamicBorderColor = cardColor; 
  
  // 1. Cálculo dinámico del tamaño de la fuente para la palabra
  const dynamicWordFontSize = getFontSizeForWord(paramWord); 
  // 2. Cálculo dinámico del tamaño de la fuente para el nombre
  const dynamicNameFontSize = getFontSizeForName(player.name);

  // 3. Lógica condicional de subcategoría
  const isSubCategoryGeneralOrNull = !subCategory || subCategory.trim().toLowerCase() === "general";
  const displaySubCategoryText = isSubCategoryGeneralOrNull ? "" : subCategory.toUpperCase();


  return (
    <LinearGradient colors={["#1A1A2E", "#0F3460", "#4D194D"]} style={styles.container}>
      <Text style={styles.title}>{player.name}, tu turno</Text>

      <TouchableOpacity
        style={[styles.cardContainer, { 
          shadowColor: dynamicBorderColor, 
        }]}
        onPress={toggleFlip}
        activeOpacity={0.9}
      >
        {/* Frente (Muestra Categoría y Nombre del Jugador) */}
        <Animated.View 
          style={[
            styles.card, 
            { backgroundColor: cardColor }, 
            styles.cardBorderFrame,
            { borderColor: dynamicBorderColor }, 
            frontStyle
          ]}
        >
          {/* Contenido centrado dentro de un View */}
          <View style={styles.cardContent}>
            <View style={styles.categoryDisplay}>
                <Text style={[styles.categoryText, { color: dynamicTextColor }]}>{category.toUpperCase()}</Text>
                
                {/* Ocultar si es "General" */}
                {!isSubCategoryGeneralOrNull && (
                    <Text style={[styles.subcategoryText, { color: dynamicTextColor }]}>
                        {displaySubCategoryText}
                    </Text>
                )}
            </View>
            {/* APLICACIÓN DINÁMICA DEL TAMAÑO DE NOMBRE */}
            <Text style={[
                styles.cardPlayer, 
                { 
                    color: dynamicTextColor,
                    fontSize: dynamicNameFontSize, // <--- TAMAÑO AJUSTADO
                }
            ]}>
                {player.name}
            </Text>
            <Text style={[styles.tapText, { color: dynamicTextColor }]}>Toca para ver tu palabra</Text>
          </View>
        </Animated.View>

        {/* Reverso (Muestra Palabra/Impostor) */}
        <Animated.View 
          style={[
            styles.card, 
            { backgroundColor: cardColor }, 
            styles.cardBorderFrame,
            { borderColor: dynamicBorderColor }, 
            backStyle
          ]}
        >
          {/* Contenido centrado dentro de un View */}
          <View style={styles.cardContent}>

            {isImpostor ? (
              <View style={styles.impostorContainer}>
                <Text style={[styles.cardBack, { color: dynamicTextColor, fontSize: dynamicWordFontSize }]}>
                    IMPOSTOR
                </Text>
                
                {hintsEnabled && (
                  <View style={styles.hintBox}>
                    <Text style={styles.hintLabel}>PISTA:</Text>
                    <Text style={styles.hintText}>{displayHint}</Text>
                  </View>
                )}
                
                {/* Mensaje de Impostor en la parte inferior */}
                <Text style={[styles.impostorAdvice, { color: dynamicTextColor }]}>
                    Trata de que no te descubran
                </Text>
              </View>
            ) : (
              <Text style={[styles.cardBack, { color: dynamicTextColor, fontSize: dynamicWordFontSize }]}>
                {paramWord}
              </Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={next}
      >
        <Text style={styles.buttonText}>
          {index === players.length - 1 ? "Listo para jugar" : "Siguiente jugador"}
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
    fontSize: 42, 
    color: "#FFD93D",
    marginBottom: 20, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: { 
    fontSize: 22,
    color: "#F8F9FA",
    marginBottom: 20, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  
  // --- Contenedor de Categorías (fuera de la carta) ---
  categoryBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#415A77",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },

  // --- Carta de Revelación (3D Flip) ---
  cardContainer: { 
    width: "90%",
    maxWidth: 400, 
    height: "65%",
    minHeight: 400, 
    marginBottom: 30, 
    perspective: 1000, 
    shadowOpacity: 1, 
    shadowRadius: 25, 
    shadowOffset: { width: 0, height: 12 }, 
    elevation: 25,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    paddingHorizontal: 20, 
  },
  cardBorderFrame: {
    borderWidth: 10, 
    borderColor: '#FFD93D', 
    backgroundColor: '#1B263B', 
    padding: 12, 
  },
  cardContent: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, 
    backgroundColor: "rgba(0,0,0,0.1)", 
    width: "100%", 
    height: "100%", 
    paddingVertical: 10,
  },

  // --- Contenido de Categoría (solo se usa en el frente de la carta) ---
  categoryDisplay: {
    position: 'absolute',
    top: 25, 
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryText: {
    fontSize: 34,
    fontFamily: "LuckiestGuy_400Regular",
  },
  subcategoryText: {
    fontSize: 30, 
    opacity: 0.7,
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  // --- Textos de la Carta ---
  cardPlayer: {
    // El font size se aplica dinámicamente: fontSize: dynamicNameFontSize
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 1)", 
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 4,
    lineHeight: 85,
    marginTop: 60, 
  },
  tapText: {
    position: 'absolute', 
    bottom: 20,
    fontSize: 18, 
    opacity: 0.7, 
    fontFamily: "LuckiestGuy_400Regular",
  },
  cardBack: {
    // El font size se aplica dinámicamente: fontSize: dynamicWordFontSize
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    lineHeight: 60,
  },
  
  // --- Contenido del Impostor ---
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
    bottom: 20, 
    fontSize: 18, 
    opacity: 0.7, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  hintBox: {
    marginTop: 25, 
    padding: 15, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    borderRadius: 15, 
    width: "90%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: '#FFD93D', 
  },
  hintLabel: {
    fontSize: 22, 
    color: "#FFD93D", 
    fontWeight: "bold",
    opacity: 1,
    marginBottom: 8,
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hintText: {
    fontSize: 32, 
    color: "#FFF", 
    textAlign: "center",
    fontFamily: "LuckiestGuy_400Regular",
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  
  // --- Botones Generales y de Siguiente ---
  button: {
    width: "100%",
    maxWidth: 380,
    paddingVertical: 18, 
    paddingHorizontal: 20,
    borderRadius: 18, 
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.7, 
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  nextButton: {
    backgroundColor: "#FF595E", 
    marginTop: 20, 
  },
  buttonText: {
    color: "#FFF",
    fontSize: 26, 
    fontFamily: "LuckiestGuy_400Regular",
    textAlign: "center",
  },
});