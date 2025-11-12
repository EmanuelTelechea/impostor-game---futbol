import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GameContext } from "../context/GameContext";

const crewColors = [
  "#f82418ff", "#34C759", "#007AFF", "#FFCC00", "#AF52DE", "#FF9500",
  "#5AC8FA", "#8E8E93", "#FF2D55", "#7e3df7ff", "#ff006aff", "#275038ff",
  "#D500F9", "#ffffffff", "#00B0FF", "#1013daff", "#000000ff", "#00ffaaff",
];

const categoryIcons = {
  futbol: "football-outline",
  musica: "musical-notes-outline",
  cine: "film-outline",
  videojuegos: "game-controller-outline",
  comida: "fast-food-outline",
  animales: "paw-outline",
  paises: "earth-outline",
  general: "help-circle-outline",
  jugadores: "people-outline",
  equipos: "basket-outline",
  peliculas: "videocam-outline",
  actores: "person-outline",
  series: "tv-outline",
  canciones: "headset-outline",
  cantantes: "mic-outline",
  marcas: "pricetag-outline",
  tecnologia: "laptop-outline",
  autos: "car-outline",
  astronomia: "planet-outline",
  moda: "shirt-outline",
  arte: "color-palette-outline",
  historia: "book-outline",
  ciencia: "flask-outline",
  literatura: "library-outline",
  naturaleza: "leaf-outline",
  deportes: "bicycle-outline",
  juegos: "dice-outline",
  television: "tv-outline",
  lugares: "location-outline",
};

export default function OfflineSetupScreen({ navigation }) {
  const ctx = useContext(GameContext) || {};
  const {
    players = [],
    setPlayers,
    startGame,
    categories = [],
    defaultWords = {},
  } = ctx;

  const safePlayers = Array.isArray(players) ? players.filter(Boolean) : [];

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [showColors, setShowColors] = useState(false);
  const [category, setCategory] = useState("general");
  const [subCategory, setSubCategory] = useState("general");
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);

  const usedColors = safePlayers.map((p) => p.color);
  const availableColors = crewColors.filter((c) => !usedColors.includes(c));

  const addPlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const colorToUse =
      selectedColor ||
      availableColors[Math.floor(Math.random() * availableColors.length)] ||
      crewColors[Math.floor(Math.random() * crewColors.length)];

    const newPlayer = { id: Date.now().toString(), name: trimmed, color: colorToUse };
    setPlayers((prev) => [...prev, newPlayer]);
    setName("");
    setSelectedColor(null);
  };

  const removePlayer = (playerId) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  };

  const startOfflineGame = () => {
    const impostorCount = safePlayers.length >= 5 ? 2 : 1;
    const result = startGame ? startGame(impostorCount, category, subCategory) : null;

    const fallbackWord =
      defaultWords[category]?.[subCategory]?.[
        Math.floor(Math.random() * defaultWords[category][subCategory].length)
      ] || "Palabra";

    navigation.navigate("WordReveal", {
      word: result?.word || fallbackWord,
      category,
      subCategory,
      impostorId: result?.impostorId,
      impostorIds: result?.impostorIds,
      hintsEnabled,
    });
  };

  const renderCategoryBox = (item, onPress, selected) => (
    <TouchableOpacity
      style={[styles.categoryBox, selected && styles.categoryBoxSelected]}
      onPress={onPress}
    >
      <Ionicons
        name={categoryIcons[item] || "help-outline"}
        size={36}
        color={selected ? "#222" : "#fff"}
      />
      <Text
        style={[styles.categoryBoxText, selected && { color: "#222" }]}
      >
        {item.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const subCategories = Object.keys(defaultWords[category] || { general: [] });
  const hasSubcategories = subCategories.length > 1;

  return (
    <LinearGradient colors={["#292D73", "#4338CA", "#6D28D9"]} style={styles.container}>
      <Text style={styles.title}>🎮 Nueva Partida</Text>

      {/* --- Sección: Jugador --- */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del jugador"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          style={styles.colorPickerHeader}
          onPress={() => setShowColors(!showColors)}
        >
          <Text style={styles.subtitle}>🎨 Color del jugador</Text>
          <View style={[styles.colorPreview, { backgroundColor: selectedColor || "#eee" }]} />
          <Ionicons name={showColors ? "chevron-up" : "chevron-down"} color="#fff" size={22} />
        </TouchableOpacity>

        {showColors && (
          <View style={styles.colorGrid}>
            {(availableColors.length ? availableColors : crewColors).map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => {
                  setSelectedColor(color);
                  setShowColors(false);
                }}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    transform: [{ scale: selectedColor === color ? 1.15 : 1 }],
                  },
                ]}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={addPlayer}
          disabled={!name.trim()}
          style={[styles.addButton, !name.trim() && styles.disabledButton]}
        >
          <Text style={styles.addButtonText}>➕ Agregar Jugador</Text>
        </TouchableOpacity>
      </View>

      {/* --- Lista de Jugadores --- */}
      <FlatList
        style={{ marginTop: 15, maxHeight: 180 }}
        data={safePlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.playerText}>{item.name}</Text>
            </View>
            <TouchableOpacity onPress={() => removePlayer(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#FF5252" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* --- Categorías --- */}
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setShowCategoryModal(true)}
      >
        <Ionicons name="albums-outline" size={22} color="#fff" />
        <Text style={styles.categoryButtonText}>
          Categoría: {category.toUpperCase()}
        </Text>
      </TouchableOpacity>

      {/* Subcategoría solo si hay más de una */}
      {hasSubcategories && (
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: "#FFD93D" }]}
          onPress={() => setShowSubCategoryModal(true)}
        >
          <Ionicons name="layers-outline" size={22} color="#000" />
          <Text style={[styles.categoryButtonText, { color: "#000" }]}>
            Subcategoría: {subCategory.toUpperCase()}
          </Text>
        </TouchableOpacity>
      )}

      {/* --- Pista --- */}
      <View style={styles.hintContainer}>
        <Text style={styles.subtitle}>💡 Pista para el impostor</Text>
        <Switch
          value={hintsEnabled}
          onValueChange={setHintsEnabled}
          thumbColor={hintsEnabled ? "#FFD93D" : "#fff"}
          trackColor={{ false: "#555", true: "#8E77FF" }}
        />
      </View>

      {/* --- Comenzar --- */}
      {safePlayers.length > 2 && (
        <TouchableOpacity style={styles.startButton} onPress={startOfflineGame}>
          <Text style={styles.startText}>🚀 Comenzar</Text>
        </TouchableOpacity>
      )}

      {/* --- Modal Categorías --- */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📂 Categorías</Text>
            <FlatList
              numColumns={2}
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderCategoryBox(item, () => {
                  setCategory(item);
                  setSubCategory("general");
                  setShowCategoryModal(false);
                }, category === item)
              }
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Modal Subcategorías --- */}
      <Modal visible={showSubCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🗂️ Subcategorías</Text>
            <FlatList
              numColumns={2}
              data={subCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderCategoryBox(item, () => {
                  setSubCategory(item);
                  setShowSubCategoryModal(false);
                }, subCategory === item)
              }
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowSubCategoryModal(false)}
            >
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFD93D",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 15,
  },
  input: {
    backgroundColor: "#1E1E3C",
    borderWidth: 2,
    borderColor: "#FFD93D",
    padding: 12,
    borderRadius: 16,
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: { fontSize: 18, color: "#fff", fontWeight: "600", marginBottom: 8 },
  colorPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4338CA",
    borderRadius: 16,
    marginTop: 15,
    padding: 10,
    gap: 10,
  },
  colorPreview: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: "#fff" },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  colorOption: { width: 45, height: 45, borderRadius: 14, margin: 6 },
  addButton: {
    backgroundColor: "#FFD93D",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { fontSize: 18, fontWeight: "900", color: "#000" },
  disabledButton: { opacity: 0.5 },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2B2B4F",
    borderRadius: 16,
    padding: 12,
    marginVertical: 5,
  },
  colorDot: { width: 30, height: 30, borderRadius: 10, marginRight: 10 },
  playerText: { fontSize: 18, color: "#fff", fontWeight: "700" },
  categoryButton: {
    backgroundColor: "#6D28D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 18,
    paddingVertical: 14,
    marginTop: 15,
  },
  categoryButtonText: { fontSize: 18, color: "#fff", fontWeight: "800" },
  hintContainer: { alignItems: "center", marginTop: 20 },
  startButton: {
    backgroundColor: "#00C853",
    borderRadius: 24,
    paddingVertical: 16,
    marginTop: 25,
  },
  startText: { textAlign: "center", fontSize: 22, fontWeight: "900", color: "#fff" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1E1E3C",
    borderRadius: 24,
    padding: 20,
    width: "90%",
    height: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFD93D",
    textAlign: "center",
    marginBottom: 15,
  },
  categoryBox: {
    flex: 1,
    margin: 10,
    backgroundColor: "#4338CA",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 25,
  },
  categoryBoxSelected: { backgroundColor: "#FFD93D" },
  categoryBoxText: { fontSize: 15, fontWeight: "800", marginTop: 6, color: "#fff" },
  closeModalButton: {
    backgroundColor: "#FF5252",
    padding: 12,
    borderRadius: 16,
    marginTop: 15,
  },
  closeModalText: { color: "#fff", fontWeight: "800", textAlign: "center" },
});
