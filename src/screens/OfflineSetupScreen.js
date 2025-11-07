import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GameContext } from "../context/GameContext";

const crewColors = [
  "#FF3B30", "#34C759", "#007AFF", "#FFCC00", "#AF52DE", "#FF9500", "#5AC8FA", "#8E8E93",
  "#FF2D55", "#5856D6", "#00C853", "#FFD600", "#D500F9", "#FF6D00", "#00B0FF", "#7C4DFF"
];

export default function OfflineSetupScreen({ navigation }) {
  const ctx = useContext(GameContext) || {};
  const {
    players = [],
    setPlayers,
    startGame,
    categories = [],
    defaultWords = {}
  } = ctx;

  const safePlayers = Array.isArray(players) ? players.filter(Boolean) : [];

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [showColors, setShowColors] = useState(false);
  const [category, setCategory] = useState("general");
  const [subCategory, setSubCategory] = useState("general");

  const usedColors = safePlayers.map(p => p.color);
  const availableColors = crewColors.filter(c => !usedColors.includes(c));

  const addPlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    let colorToUse =
      selectedColor ||
      availableColors[Math.floor(Math.random() * availableColors.length)] ||
      crewColors[Math.floor(Math.random() * crewColors.length)];

    const newPlayer = { id: Date.now().toString(), name: trimmed, color: colorToUse };
    setPlayers(prev => (Array.isArray(prev) ? [...prev, newPlayer] : [newPlayer]));

    setName("");
    setSelectedColor(null);
  };

  const changePlayerColor = (playerId, color) => {
    setPlayers(prev =>
      Array.isArray(prev)
        ? prev.map(p => (p.id === playerId ? { ...p, color } : p))
        : []
    );
    setEditingPlayerId(null);
  };

  const removePlayer = (playerId) => {
    setPlayers(prev =>
      Array.isArray(prev) ? prev.filter(p => p.id !== playerId) : []
    );
    if (editingPlayerId === playerId) setEditingPlayerId(null);
  };

  const startOfflineGame = () => {
    const impostorCount = safePlayers.length >= 5 ? 2 : 1;
    const result = startGame ? startGame(impostorCount, category, subCategory) : null;

    setShowColors(false);

    if (!result) {
      const fallbackWord = (defaultWords[category] && defaultWords[category][subCategory])
        ? defaultWords[category][subCategory][Math.floor(Math.random() * defaultWords[category][subCategory].length)]
        : "Palabra";
      navigation.navigate("WordReveal", { word: fallbackWord, category, subCategory });
      return;
    }

    navigation.navigate("WordReveal", {
      word: result.word,
      category: result.category,
      subCategory: result.subCategory,
      impostorId: result.impostorId,
      impostorIds: result.impostorIds,
    });
  };

  return (
    <LinearGradient colors={["#1b2335", "#2c3e50"]} style={styles.container}>
      <Text style={styles.title}>👥 Agregar jugadores</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del jugador"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.colorPickerHeader} onPress={() => setShowColors(s => !s)}>
        <Text style={styles.subtitle}>🎨 Elegí tu color</Text>
        <View style={[styles.colorPreview, { backgroundColor: selectedColor || "transparent" }]} />
        <Text style={styles.arrow}>{showColors ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {showColors && (
        <View style={styles.colorGrid}>
          {(availableColors.length ? availableColors : crewColors).map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => { setSelectedColor(color); setShowColors(false); }}
              style={[
                styles.colorOption,
                {
                  backgroundColor: color,
                  borderColor: selectedColor === color ? "#fff" : "#000",
                  borderWidth: selectedColor === color ? 3 : 1
                }
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
        <Text style={styles.addButtonText}>➕ Agregar</Text>
      </TouchableOpacity>

      <FlatList
        style={{ marginTop: 15 }}
        data={safePlayers}
        extraData={editingPlayerId}
        keyExtractor={(item, index) => (item && item.id) ? item.id : String(index)}
        renderItem={({ item }) => {
          if (!item) return null;
          const usedByOthers = safePlayers.filter(p => p.id !== item.id).map(p => p.color);
          const availableForEdit = crewColors.filter(c => !usedByOthers.includes(c) || c === item.color);

          return (
            <View>
              <View style={styles.playerCard}>
                <TouchableOpacity style={styles.playerInfo} onPress={() => setEditingPlayerId(editingPlayerId === item.id ? null : item.id)}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text style={styles.playerText}>{item.name}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => removePlayer(item.id)}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {editingPlayerId === item.id && (
                <View style={styles.editColorRow}>
                  {availableForEdit.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => changePlayerColor(item.id, color)}
                      style={[styles.colorOptionSmall, { backgroundColor: color, borderColor: color === item.color ? "#fff" : "#000" }]}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />

      <Text style={[styles.subtitle, { marginTop: 25 }]}>📂 Categoría:</Text>
      <View style={styles.categoryGrid}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => {
              setCategory(cat);
              setSubCategory("general");
            }}
            style={[
              styles.categoryButton,
              { backgroundColor: category === cat ? "#6C63FF" : "#2C2F40" }
            ]}
          >
            <Text style={styles.categoryText}>{cat.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.subtitle, { marginTop: 15 }]}>🎯 Subcategoría:</Text>
      <View style={styles.categoryGrid}>
        {Object.keys(defaultWords[category] || {}).map(sub => (
          <TouchableOpacity
            key={sub}
            onPress={() => setSubCategory(sub)}
            style={[
              styles.categoryButton,
              { backgroundColor: subCategory === sub ? "#FFD93D" : "#2C2F40" }
            ]}
          >
            <Text style={[styles.categoryText, { color: subCategory === sub ? "#000" : "#fff" }]}>
              {sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {safePlayers.length > 2 && (
        <TouchableOpacity style={styles.startButton} onPress={startOfflineGame}>
          <Text style={styles.startText}>🚀 Comenzar partida</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {  flex: 1, padding: 20, justifyContent: "center" , paddingTop: 40 },
  title: { fontSize: 32, fontWeight: "900", color: "#fff", marginBottom: 15, textAlign: "center", textShadowColor: "#000", textShadowRadius: 10 },
  subtitle: { fontSize: 20, marginVertical: 10, color: "#fff", fontWeight: "600", textAlign: "center" },
  input: { backgroundColor: "#1C1F2E", borderWidth: 2, borderColor: "#2C2F40", padding: 12, borderRadius: 12, fontSize: 18, color: "#fff" },
  colorPickerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1C1F2E", borderRadius: 12, borderWidth: 2, borderColor: "#2C2F40", padding: 10, marginVertical: 8 },
  colorPreview: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: "#fff", marginHorizontal: 8 },
  arrow: { color: "#fff", fontSize: 18 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 15 },
  colorOption: { width: 45, height: 45, borderRadius: 10, margin: 6 },
  addButton: { backgroundColor: "#FFD93D", paddingVertical: 14, borderRadius: 16, alignItems: "center", marginTop: 10, shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 5 },
  disabledButton: { opacity: 0.6 },
  addButtonText: { fontSize: 18, fontWeight: "800", color: "#000" },
  playerCard: { backgroundColor: "#1C1F2E", padding: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", marginVertical: 6, borderWidth: 2, borderColor: "#2C2F40", justifyContent: "space-between" },
  playerInfo: { flexDirection: "row", alignItems: "center" },
  colorDot: { width: 30, height: 30, borderRadius: 8, marginRight: 10 },
  playerText: { fontSize: 18, color: "#fff" },
  deleteButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#2C2F40", borderRadius: 8 },
  deleteText: { color: "#FF6B6B", fontWeight: "700" },
  editColorRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginVertical: 6 },
  colorOptionSmall: { width: 36, height: 36, borderRadius: 8, margin: 4 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  categoryButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, margin: 6 },
  categoryText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  startButton: { backgroundColor: "#6C63FF", paddingVertical: 16, borderRadius: 20, marginTop: 20, shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 6 },
  startText: { fontSize: 20, fontWeight: "900", textAlign: "center", color: "#fff" },
});
