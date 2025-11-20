import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  LayoutAnimation,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { GameContext } from "../context/GameContext";

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🎨 Paleta de colores cartoon
const crewColors = [
  "#FF6B6B", "#6BFF8B", "#6B8EFF", "#FFF06B", "#AF6BFF", "#FFAB6B",
  "#6BFFED", "#A3A3A3", "#FF6BF0", "#9F6BFF", "#FF6BB0", "#6BB07D",
  "#D56BFF", "#FFFFFF", "#6BD0FF", "#6B6BEB", "#8BBD6B", "#6BFFC9",
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
    players: ctxPlayers = [],
    setPlayers: ctxSetPlayers,
    startGame: ctxStartGame,
    categories = [],
    defaultWords = {},
  } = ctx;

  const [localPlayers, setLocalPlayers] = useState(Array.isArray(ctxPlayers) ? ctxPlayers : []);
  
  useEffect(() => {
    if (Array.isArray(ctxPlayers) && ctxPlayers.length !== localPlayers.length) {
      setLocalPlayers(ctxPlayers);
    }
  }, [ctxPlayers]);

  // UI States
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [showColors, setShowColors] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  
  // Visibilidad
  const [showPlayerList, setShowPlayerList] = useState(false); 
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false); 

  // Configuración de Juego
  const [category, setCategory] = useState("general");
  const [subCategory, setSubCategory] = useState("general");
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  
  const [impostors, setImpostors] = useState(1);
  const [showImpostorModal, setShowImpostorModal] = useState(false);

  const playersSource = Array.isArray(ctxPlayers) && ctxSetPlayers ? ctxPlayers : localPlayers;
  const safePlayers = Array.isArray(playersSource) ? playersSource.filter(Boolean) : [];

  // Ajuste automático de impostores
  useEffect(() => {
      const maxAllowed = Math.floor((safePlayers.length - 1) / 2);
      if (safePlayers.length > 0 && impostors > Math.max(1, maxAllowed)) {
          setImpostors(Math.max(1, maxAllowed));
      }
  }, [safePlayers.length]);

  const usedColors = safePlayers.map((p) => p.color);
  const availableColors = crewColors.filter((c) => {
      if (editingPlayerId) {
          const currentPlayer = safePlayers.find(p => p.id === editingPlayerId);
          if (currentPlayer && currentPlayer.color === c) return true;
      }
      return !usedColors.includes(c);
  });

  const updatePlayers = (updater) => {
    if (typeof ctxSetPlayers === "function") {
      ctxSetPlayers((prev) => {
        try {
          return typeof updater === "function" ? updater(prev || []) : updater;
        } catch {
          return prev || [];
        }
      });
    } else {
      setLocalPlayers((prev) => {
        const next = typeof updater === "function" ? updater(prev || []) : updater;
        return Array.isArray(next) ? next : prev;
      });
    }
  };

  const isImpostorOptionDisabled = (numImpostors) => {
      return (numImpostors * 2) >= safePlayers.length;
  };

  const getMinPlayersForImpostors = (num) => {
      return (num * 2) + 1;
  };

  const togglePlayerList = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPlayerList(!showPlayerList);
  };

  const toggleAddPlayerForm = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAddPlayerForm(!showAddPlayerForm);
  };

  const handleSavePlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) {
        Alert.alert("Atención", "El nombre del jugador no puede estar vacío.");
        return;
    }

    const colorToUse =
      selectedColor ||
      availableColors[Math.floor(Math.random() * Math.max(availableColors.length, 1))] ||
      crewColors[Math.floor(Math.random() * crewColors.length)];

    updatePlayers((prev = []) => {
      if (editingPlayerId) {
         if (prev.some((p) => p.name === trimmed && p.id !== editingPlayerId)) {
            Alert.alert("Nombre ocupado", "Ya existe otro jugador con ese nombre.");
            return prev;
         }
         return prev.map(p => 
            p.id === editingPlayerId 
            ? { ...p, name: trimmed, color: colorToUse } 
            : p
         );
      } else {
         if (prev.some((p) => p.name === trimmed)) {
            Alert.alert("Jugador existente", "Ya existe un jugador con ese nombre.");
            return prev;
         }
         const newPlayer = { id: Date.now().toString(), name: trimmed, color: colorToUse };
         return [...(prev || []), newPlayer];
      }
    });

    resetInputState();
    if (!showPlayerList && editingPlayerId === null) togglePlayerList(); 
  };

  const startEditing = (player) => {
      setName(player.name);
      setSelectedColor(player.color);
      setEditingPlayerId(player.id);
      setShowColors(true);
      if (!showAddPlayerForm) toggleAddPlayerForm();
      if (showPlayerList) togglePlayerList(); 
  };

  const resetInputState = () => {
      setName("");
      setSelectedColor(null);
      setEditingPlayerId(null);
      setShowColors(false);
      Keyboard.dismiss();
  };

  const removePlayer = (playerId) => {
    if (editingPlayerId === playerId) resetInputState();
    updatePlayers((prev = []) => (prev || []).filter((p) => p.id !== playerId));
  };

  const startOfflineGame = () => {
    if (safePlayers.length < 3) {
      Alert.alert("Faltan Jugadores", "Se necesitan al menos 3 jugadores para comenzar.");
      return;
    }
    
    if (isImpostorOptionDisabled(impostors)) {
         Alert.alert("Desequilibrio", `Para jugar con ${impostors} impostores, necesitas al menos ${getMinPlayersForImpostors(impostors)} jugadores.`);
         return;
    }

    const result = typeof ctxStartGame === "function"
      ? ctxStartGame(impostors, category, subCategory)
      : null;

    const fallbackWord =
      defaultWords?.[category]?.[subCategory]?.[
        Math.floor(Math.random() * ((defaultWords?.[category]?.[subCategory]?.length) || 1))
      ] || "Palabra";

    navigation.navigate("WordReveal", {
      word: result?.word || fallbackWord,
      category,
      subCategory,
      impostorIds: result?.impostorIds,
      impostors,
      hintsEnabled,
      hint: result?.hint || "Sin pista disponible",
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
        color={selected ? styles.categoryBoxTextSelected.color : styles.categoryBoxText.color}
      />
      <Text style={[styles.categoryBoxText, selected && styles.categoryBoxTextSelected]}>
        {item.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const subCategories = Object.keys(defaultWords[category] || { general: [] });
  const hasSubcategories = subCategories.length > 1;

  return (
    <LinearGradient colors={["#5a0670", "#0a1f44", "#38206d"]} style={styles.container}>
      
      <FlatList
        data={showPlayerList ? safePlayers : []} 
        keyExtractor={(item) => item.id}
        // Importante: contentContainerStyle con flexGrow para centrar el footer si falta contenido
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>CONFIGURACIÓN DE LA PARTIDA</Text>

            {/* Formulario Agregar */}
            <TouchableOpacity
                style={[styles.accordionButton, { backgroundColor: "#FFD700" }]}
                onPress={toggleAddPlayerForm}
            >
                <Ionicons 
                    name={showAddPlayerForm ? "chevron-up" : "person-add-outline"} 
                    size={24} 
                    color="#333" 
                />
                <Text style={styles.accordionButtonText}>
                    {editingPlayerId ? "Editar Jugador" : "Agregar Jugador"}
                </Text>
            </TouchableOpacity>

            {showAddPlayerForm && (
                <View style={[styles.card, editingPlayerId && styles.cardEditing]}>
                    <TextInput
                    style={styles.input}
                    placeholder={editingPlayerId ? "Nuevo nombre..." : "Nombre del jugador..."}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="done"
                    />
                    <TouchableOpacity
                    style={styles.colorPickerHeader}
                    onPress={() => setShowColors(!showColors)}
                    >
                    <Text style={styles.subtitle}>Color</Text>
                    <View style={[styles.colorPreview, { backgroundColor: selectedColor || "#FFF06B" }]} />
                    <Ionicons name={showColors ? "chevron-up" : "chevron-down"} color="#fff" size={20} />
                    </TouchableOpacity>
                    {showColors && (
                    <View style={styles.colorGrid}>
                        {(availableColors.length ? availableColors : crewColors).map((color) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => setSelectedColor(color)}
                            style={[
                            styles.colorOption,
                            {
                                backgroundColor: color,
                                transform: [{ scale: selectedColor === color ? 1.15 : 1 }],
                                borderWidth: selectedColor === color ? 4 : 0,
                                borderColor: "#fff"
                            },
                            ]}
                        />
                        ))}
                    </View>
                    )}
                    <View style={{flexDirection: 'row', gap: 10, marginTop: 15}}>
                        <TouchableOpacity
                        onPress={handleSavePlayer}
                        disabled={!name.trim()}
                        style={[styles.actionButton, !name.trim() && styles.disabledButton, {flex: 1}]}
                        >
                        <Text style={styles.actionButtonText}>
                            {editingPlayerId ? "Guardar" : "Agregar"}
                        </Text>
                        </TouchableOpacity>
                        {editingPlayerId && (
                            <TouchableOpacity onPress={resetInputState} style={[styles.cancelButton]}>
                                <Ionicons name="close" size={28} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Botón Lista */}
            <TouchableOpacity
                style={[styles.accordionButton, { backgroundColor: "#8AFF70", marginBottom: 20 }]}
                onPress={togglePlayerList}
            >
                <Ionicons name={showPlayerList ? "chevron-up" : "people-outline"} size={24} color="#333" />
                <Text style={styles.accordionButtonText}>
                Lista de Jugadores ({safePlayers.length})
                </Text>
            </TouchableOpacity>
          </View>
        }

        renderItem={({ item }) => {
             const isEditingThis = editingPlayerId === item.id;
             return (
                <View style={[styles.playerCard, isEditingThis && styles.playerCardEditing]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                    <Text style={styles.playerText}>{item.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', gap: 15}}>
                        <TouchableOpacity onPress={() => startEditing(item)}>
                            <Ionicons name="pencil" size={22} color="#FFF06B" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removePlayer(item.id)}>
                            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>
                </View>
             );
        }}

        // Footer con estilo flex: 1 y justifyContent center para centrar verticalmente
        ListFooterComponentStyle={{ flex: 1, justifyContent: 'center' }}
        ListFooterComponent={
          <View style={styles.menuContainer}>
            {/* Configuración */}
            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: "#70C2FF" }]}
                onPress={() => setShowCategoryModal(true)}
            >
                <Ionicons name="albums-outline" size={24} color="#333" />
                <View style={{alignItems: 'flex-start'}}>
                    <Text style={styles.menuLabel}>Categoría</Text>
                    <Text style={styles.menuValue}>{category.toUpperCase()}</Text>
                </View>
            </TouchableOpacity>

            {hasSubcategories && (
                <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: "#FFD700" }]}
                onPress={() => setShowSubCategoryModal(true)}
                >
                <Ionicons name="layers-outline" size={24} color="#333" />
                <View style={{alignItems: 'flex-start'}}>
                    <Text style={styles.menuLabel}>Subcategoría</Text>
                    <Text style={styles.menuValue}>{subCategory.toUpperCase()}</Text>
                </View>
                </TouchableOpacity>
            )}

            <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                    style={[styles.menuButton, { backgroundColor: "#FF6B6B", flex: 1 }]}
                    onPress={() => setShowImpostorModal(true)}
                >
                    <Ionicons name="skull-outline" size={24} color="#333" />
                    <View>
                        <Text style={styles.menuLabel}>Impostores</Text>
                        <Text style={styles.menuValue}>{impostors}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.menuButton, { backgroundColor: hintsEnabled ? "#FFF06B" : "#A3A3A3", flex: 1 }]}
                    onPress={() => setHintsEnabled(!hintsEnabled)}
                >
                    <Ionicons name="bulb-outline" size={24} color="#333" />
                    <View>
                        <Text style={styles.menuLabel}>Pistas</Text>
                        <Text style={styles.menuValue}>{hintsEnabled ? "ON" : "OFF"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>
        }
      />

      {/* --- Dock Inferior Fijo --- */}
      <View style={styles.bottomDock}>
          <TouchableOpacity 
            style={[styles.startButton, safePlayers.length < 3 && styles.disabledButton]} 
            onPress={startOfflineGame}
            activeOpacity={0.8}
          >
            <Text style={styles.startText}>INICIAR PARTIDA</Text>
          </TouchableOpacity>
      </View>

      {/* --- MODALES (Sin cambios funcionales, solo visuales sin emojis) --- */}
      <Modal visible={showImpostorModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContentImpostors}>
            <Text style={styles.modalTitle}>Cantidad de Impostores</Text>
            <Text style={styles.modalSubtitle}>
                 Total Jugadores: {safePlayers.length}
            </Text>
            
            <View style={styles.impostorOptionsContainer}>
              {[1, 2, 3].map((num) => {
                const disabled = isImpostorOptionDisabled(num);
                const crewCount = safePlayers.length - num;
                return (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.impostorCard,
                      impostors === num && styles.impostorCardSelected,
                      disabled && styles.impostorCardDisabled,
                    ]}
                    onPress={() => {
                      if (!disabled) setImpostors(num);
                      else Alert.alert("Aviso", `Necesitas al menos ${getMinPlayersForImpostors(num)} jugadores.`);
                    }}
                    activeOpacity={disabled ? 1 : 0.7}
                  >
                     <View style={styles.impostorHeader}>
                         <Ionicons
                            name={impostors === num ? "skull" : "skull-outline"}
                            size={32}
                            color={disabled ? "#666" : (impostors === num ? "#fff" : "#333")}
                         />
                         <Text style={[
                             styles.impostorNumber, 
                             impostors === num && {color: '#fff'},
                             disabled && {color: '#666'}
                         ]}>
                             {num}
                         </Text>
                     </View>
                     {!disabled ? (
                         <View style={styles.versusContainer}>
                             <Text style={[styles.versusText, impostors === num && {color: '#eee'}]}>
                                 VS {crewCount} Tripulantes
                             </Text>
                         </View>
                     ) : (
                         <Text style={styles.minReqText}>Min {getMinPlayersForImpostors(num)} Jugs.</Text>
                     )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={() => setShowImpostorModal(false)}>
              <Text style={styles.confirmText}>CONFIRMAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Categoría */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Categorías</Text>
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
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.closeModalText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Subcategoría */}
      <Modal visible={showSubCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Subcategorías</Text>
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
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowSubCategoryModal(false)}>
              <Text style={styles.closeModalText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  title: {
    fontSize: 38, 
    fontWeight: "900",
    color: "#FFD700", 
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    fontFamily: "LuckiestGuy_400Regular",
  },
  
  // --- Botones Acordeón (Agregar / Lista) ---
  accordionButton: {
    alignItems: "center",
    justifyContent: "center", 
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 22, 
    paddingVertical: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  accordionButtonText: { 
    fontSize: 18, 
    color: "#333", 
    fontWeight: "800",
  },

  // --- Formulario ---
  card: {
    marginHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.15)", 
    borderRadius: 25, 
    padding: 20,
    marginTop: 10, 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardEditing: {
      borderColor: "#FFD700", 
      borderWidth: 3,
      backgroundColor: "rgba(255, 215, 0, 0.2)",
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.3)", 
    borderWidth: 2,
    borderColor: "#FFF06B", 
    padding: 15,
    borderRadius: 18, 
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 16, 
    color: "#fff", 
    fontWeight: "700", 
    marginRight: 10
  },
  colorPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(112, 194, 255, 0.3)", 
    borderRadius: 15,
    marginTop: 15,
    padding: 10,
  },
  colorPreview: { width: 30, height: 30, borderRadius: 10, borderWidth: 3, borderColor: "#fff", marginRight: 10 },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 15,
  },
  colorOption: { width: 45, height: 45, borderRadius: 14, margin: 6 }, 
  
  // Botones Acción Formulario
  actionButton: {
    backgroundColor: "#8AFF70", 
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: "center",
  },
  cancelButton: {
      backgroundColor: "#FF6B6B", 
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: 'center',
  },
  actionButtonText: { 
    fontSize: 18, 
    fontWeight: "900", 
    color: "#333", 
  },
  
  // Lista Jugadores
  playerCard: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)", 
    borderRadius: 18,
    padding: 14,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  playerCardEditing: {
      borderColor: "#FFF06B", 
      borderWidth: 2,
      backgroundColor: "rgba(255, 240, 107, 0.1)",
  },
  colorDot: { width: 32, height: 32, borderRadius: 12, marginRight: 12, borderWidth: 2, borderColor: '#fff' },
  playerText: { 
    fontSize: 18, 
    color: "#fff", 
    fontWeight: "700",
  },
  
  // --- MENÚ CENTRAL (FOOTER) ---
  menuContainer: {
      marginHorizontal: 20,
      gap: 10,
  },
  menuButton: {
      borderRadius: 22,
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
  },
  menuLabel: {
      fontSize: 12,
      color: "#333",
      fontWeight: "600",
      textTransform: "uppercase",
      opacity: 0.7
  },
  menuValue: {
      fontSize: 18,
      color: "#333",
      fontWeight: "900",
  },

  // --- DOCK INFERIOR FIJO ---
  bottomDock: {
      padding: 20,
      paddingBottom: 30, // Espacio extra para iPhones con home bar
      backgroundColor: "rgba(0,0,0,0.2)",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
  },
  startButton: {
    backgroundColor: "#FF6B6B", 
    borderRadius: 30, 
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startText: { 
    fontSize: 24, 
    fontWeight: "900", 
    color: "#fff", 
    letterSpacing: 1,
  },
  disabledButton: { opacity: 0.5 },

  // --- ESTILOS MODAL IMPOSTORES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentImpostors: {
    backgroundColor: "#222", 
    borderRadius: 30,
    padding: 25,
    width: "100%",
    height: "80%",
    justifyContent: 'center',
    alignItems: 'center',
    top: '20%',
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  modalSubtitle: {
      fontSize: 16,
      color: "#aaa",
      marginBottom: 20,
  },
  impostorOptionsContainer: {
      width: '100%',
      gap: 15,
  },
  impostorCard: {
      backgroundColor: "#eee",
      padding: 15,
      borderRadius: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: 'transparent',
  },
  impostorCardSelected: {
      backgroundColor: "#FF6B6B",
      borderColor: "#fff",
  },
  impostorCardDisabled: {
      backgroundColor: "#444",
      opacity: 0.6,
  },
  impostorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  impostorNumber: {
      fontSize: 28,
      fontWeight: '900',
      color: '#333',
  },
  versusContainer: {
      backgroundColor: 'rgba(0,0,0,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
  },
  versusText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#555',
  },
  minReqText: {
      fontSize: 12,
      color: '#aaa',
      fontStyle: 'italic',
  },
  confirmButton: {
      marginTop: 25,
      backgroundColor: "#8AFF70",
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderRadius: 25,
  },
  confirmText: {
      fontSize: 18,
      fontWeight: "900",
      color: "#333",
  },

  // Estilos Modal Categoría
  modalContent: {
    backgroundColor: "#2A0A57", 
    borderRadius: 30, 
    padding: 20,
    width: "90%",
    height: "70%",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  categoryBox: {
    flex: 1,
    margin: 6, 
    backgroundColor: "#4A067F", 
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryBoxSelected: { 
    backgroundColor: "#FFD700", 
    borderWidth: 2,
    borderColor: "#fff",
  },
  categoryBoxText: { 
    fontSize: 14, 
    fontWeight: "800", 
    marginTop: 8, 
    color: "#fff",
    textAlign: 'center'
  },
  categoryBoxTextSelected: { color: "#333" },
  closeModalButton: {
    marginTop: 15,
    alignSelf: "center",
    padding: 10
  },  
  closeModalText: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "700",
  },
});