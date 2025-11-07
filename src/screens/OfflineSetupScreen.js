import { useContext, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GameContext } from "../context/GameContext";

// 🧩 Colores disponibles para jugadores
const crewColors = [
  "#FF3B30", "#34C759", "#007AFF", "#FFCC00", "#AF52DE", "#FF9500", "#5AC8FA", "#8E8E93",
  "#FF2D55", "#5856D6", "#00C853", "#FFD600", "#D500F9", "#FF6D00", "#00B0FF", "#7C4DFF"
];

export default function OfflineSetupScreen({ navigation }) {
  // 🧠 Contexto del juego
  const ctx = useContext(GameContext) || {};
  const {
    players = [],
    setPlayers,
    startGame,
    categories = [],
    defaultWords = {}
  } = ctx;

  const safePlayers = Array.isArray(players) ? players.filter(Boolean) : [];

  // 🎨 Estados locales
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [showColors, setShowColors] = useState(false);

  // 🧭 Categorías
  const [category, setCategory] = useState("general");
  const [subCategory, setSubCategory] = useState("general");

  const usedColors = safePlayers.map(p => p.color);
  const availableColors = crewColors.filter(c => !usedColors.includes(c));

  // 🧍 Agregar jugador
  const addPlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    let colorToUse = selectedColor || availableColors[Math.floor(Math.random() * availableColors.length)] || crewColors[Math.floor(Math.random() * crewColors.length)];

    const newPlayer = { id: Date.now().toString(), name: trimmed, color: colorToUse };
    setPlayers(prev => (Array.isArray(prev) ? [...prev, newPlayer] : [newPlayer]));

    setName("");
    setSelectedColor(null);
  };

  // 🎨 Cambiar color
  const changePlayerColor = (playerId, color) => {
    setPlayers(prev =>
      Array.isArray(prev)
        ? prev.map(p => (p.id === playerId ? { ...p, color } : p))
        : []
    );
    setEditingPlayerId(null);
  };

  // ❌ Eliminar jugador
  const removePlayer = (playerId) => {
    setPlayers(prev =>
      Array.isArray(prev) ? prev.filter(p => p.id !== playerId) : []
    );
    if (editingPlayerId === playerId) setEditingPlayerId(null);
  };

  // 🚀 Iniciar partida
  const startOfflineGame = () => {
    const impostorCount = safePlayers.length >= 5 ? 2 : 1;
    const result = startGame(impostorCount, category, subCategory);

    // cerrar color picker si estaba abierto
    setShowColors(false);

    // navegar a WordReveal con los datos
    navigation.navigate("WordReveal", {
      word: result?.word,
      category,
      subCategory
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Agregar jugadores</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del jugador"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      {/* 🎨 Selector de color */}
      <TouchableOpacity style={styles.colorPickerHeader} onPress={() => setShowColors(s => !s)}>
        <Text style={styles.subtitle}>🎨 Elegí tu color (opcional)</Text>
        <View style={[styles.colorPreview, { backgroundColor: selectedColor || "transparent", borderWidth: selectedColor ? 0 : 1 }]} />
        <Text style={{ color: "#fff", marginLeft: 8 }}>{showColors ? "▲" : "▼"}</Text>
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
                  borderWidth: selectedColor === color ? 3 : 2
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
        <Text style={styles.addButtonText}>➕ Agregar jugador</Text>
      </TouchableOpacity>

      {/* 🧩 Lista de jugadores */}
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
                  <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
              </View>

              {editingPlayerId === item.id && (
                <View style={styles.editColorRow}>
                  {availableForEdit.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => changePlayerColor(item.id, color)}
                      style={[styles.colorOptionSmall, { backgroundColor: color, borderColor: color === item.color ? "#fff" : "#000", borderWidth: color === item.color ? 3 : 1 }]}
                    />
                  ))}
                  <TouchableOpacity onPress={() => setEditingPlayerId(null)} style={styles.cancelEdit}>
                    <Text style={{ color: "#fff" }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* 📚 Selector de categoría */}
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

      {/* 🎯 Subcategoría */}
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

      {/* 🚀 Botón para iniciar partida */}
      {safePlayers.length > 2 && (
        <TouchableOpacity style={styles.startButton} onPress={startOfflineGame}>
          <Text style={styles.startText}>🚀 Comenzar partida</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#101320" },
  title: { fontSize: 30, fontWeight: "900", color: "#fff", marginBottom: 15, textAlign: "center" },
  subtitle: { fontSize: 20, marginVertical: 10, color: "#fff", fontWeight: "600" },
  input: { backgroundColor: "#1C1F2E", borderWidth: 2, borderColor: "#2C2F40", padding: 12, borderRadius: 12, fontSize: 18, color: "#fff" },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  colorOption: { width: 50, height: 50, borderRadius: 12, margin: 6 },
  addButton: { backgroundColor: "#4cd964", paddingVertical: 14, borderRadius: 20, alignItems: "center", marginTop: 5 },
  disabledButton: { backgroundColor: "#3a3a3a" },
  addButtonText: { fontSize: 18, fontWeight: "800", color: "#000" },
  playerCard: { backgroundColor: "#1C1F2E", padding: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", marginVertical: 6, borderWidth: 2, borderColor: "#2C2F40", justifyContent: "space-between" },
  playerInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  colorDot: { width: 30, height: 30, borderRadius: 8, marginRight: 10 },
  playerText: { fontSize: 18, color: "#fff" },
  startButton: { backgroundColor: "#ff3b30", paddingVertical: 16, borderRadius: 20, marginTop: 20 },
  startText: { fontSize: 20, fontWeight: "900", textAlign: "center", color: "#fff" },
  editColorRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginLeft: 8, marginBottom: 8 },
  colorOptionSmall: { width: 36, height: 36, borderRadius: 8, margin: 6 },
  cancelEdit: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#2C2F40", borderRadius: 8, marginLeft: 6 },
  colorPickerHeader: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, backgroundColor: "#1C1F2E", borderRadius: 12, borderWidth: 2, borderColor: "#2C2F40", marginBottom: 10 },
  colorPreview: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: "#fff", marginLeft: 8 },
  deleteButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#2F2F35", borderRadius: 8, marginLeft: 10 },
  deleteText: { color: "#FF6B6B", fontWeight: "700" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  categoryButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, margin: 6 },
  categoryText: { fontSize: 16, fontWeight: "700", color: "#fff" }
});
