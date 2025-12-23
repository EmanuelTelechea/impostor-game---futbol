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
import { playMusic, playSound } from "../utils/soundManager";
// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🎨 Paleta de colores de Camisetas (Kits)
const crewColors = [
  "#F44336", // Rojo
  "#2196F3", // Azul
  "#FFEB3B", // Amarillo
  "#4CAF50", // Verde
  "#FF9800", // Naranja
  "#9C27B0", // Violeta
  "#00BCD4", // Celeste
  "#795548", // Marrón
  "#607D8B", // Gris
  "#E91E63", // Rosa
  "#CDDC39", // Lima
  "#3F51B5", // Indigo
  "#009688", // Verde Azulado
  "#FFFFFF", // Blanco
  "#000000", // Negro
  "#FF5722", // Naranja fuerte
  "#673AB7", // Morado oscuro
  "#8BC34A", // Verde claro
];

const categoryIcons = {
  general: "football-outline",
  jugadores: "people-outline",
  ligas: "trophy-outline",
  selecciones: "flag-outline",
  clubes: "shield-outline",
  trofeos: "medal-outline",
  partidos: "calendar-outline",
  mundiales: "globe-outline",
  dts: "person-circle-outline",
  europeos: "logo-euro",
  sudamericanos: "earth-outline",
  restoDelMundo: "image-outline",
  actuales: "time-outline",
  historicos: "hourglass-outline",
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
      playMusic(
        "game",
        require("../assets/music/game.mp3"),
        0.3
      );
    }, []);

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
        Alert.alert("Falta de respeto", "El jugador necesita un nombre para la camiseta.");
        return;
    }

    const colorToUse =
      selectedColor ||
      availableColors[Math.floor(Math.random() * Math.max(availableColors.length, 1))] ||
      crewColors[Math.floor(Math.random() * crewColors.length)];

    updatePlayers((prev = []) => {
      if (editingPlayerId) {
         if (prev.some((p) => p.name === trimmed && p.id !== editingPlayerId)) {
            Alert.alert("Nombre ocupado", "Ya hay un jugador con ese nombre en la plantilla.");
            return prev;
         }
         return prev.map(p => 
            p.id === editingPlayerId 
            ? { ...p, name: trimmed, color: colorToUse } 
            : p
         );
      } else {
         if (prev.some((p) => p.name === trimmed)) {
            Alert.alert("Jugador existente", "Ese jugador ya fue convocado.");
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
      Alert.alert("Cancha vacía", "Se necesitan al menos 3 jugadores para el pitazo inicial.");
      return;
    }
    
    if (isImpostorOptionDisabled(impostors)) {
         Alert.alert("Desequilibrio", `Para jugar con ${impostors} simuladores, necesitas al menos ${getMinPlayersForImpostors(impostors)} jugadores.`);
         return;
    }

    const result = typeof ctxStartGame === "function"
      ? ctxStartGame(impostors, category, subCategory)
      : null;

    const fallbackWord =
      defaultWords?.[category]?.[subCategory]?.[
        Math.floor(Math.random() * ((defaultWords?.[category]?.[subCategory]?.length) || 1))
      ] || "Balón de Oro";

    navigation.navigate("WordReveal", {
      word: result?.word || fallbackWord,
      category,
      subCategory,
      impostorIds: result?.impostorIds,
      impostors,
      hintsEnabled,
      hint: result?.hint || "Sin VAR disponible",
    });
  };

  const renderCategoryBox = (item, onPress, selected) => (
    <TouchableOpacity
      style={[styles.categoryBox, selected && styles.categoryBoxSelected]}
      onPress={onPress}
    >
      <Ionicons
        name={categoryIcons[item] || "trophy-outline"}
        size={36}
        color={selected ? "#1B5E20" : "#fff"} // Icono verde oscuro si seleccionado
      />
      <Text style={[styles.categoryBoxText, selected && styles.categoryBoxTextSelected]}>
        {item.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const subCategories = Object.keys(defaultWords[category] || { general: [] });
  const hasSubcategories = subCategories.length > 1;

  return (
    // CAMBIO: Fondo Degradado Verde (Césped)
    <LinearGradient colors={["#66BB6A", "#388E3C", "#1B5E20"]} style={styles.container}>
      
      <FlatList
        data={showPlayerList ? safePlayers : []} 
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>PREVIA DEL PARTIDO 📋</Text>

            {/* Botón Agregar Jugador (Estilo Pizarra) */}
            <TouchableOpacity
                style={[styles.accordionButton, { backgroundColor: "#fff" }]}
                onPress={() => {
                  toggleAddPlayerForm();
                  playSound("click");
                }}
            >
                <Ionicons 
                    name={showAddPlayerForm ? "chevron-up" : "shirt-outline"} 
                    size={24} 
                    color="#2E7D32" 
                />
                <Text style={[styles.accordionButtonText, {color: "#2E7D32"}]}>
                    {editingPlayerId ? "Editar Ficha" : "Convocar Jugador"}
                </Text>
            </TouchableOpacity>

            {showAddPlayerForm && (
                <View style={[styles.card, editingPlayerId && styles.cardEditing]}>
                    <TextInput
                    style={styles.input}
                    placeholder={editingPlayerId ? "Nuevo nombre..." : "Nombre en camiseta..."}
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="done"
                    />
                    <TouchableOpacity
                    style={styles.colorPickerHeader}
                    onPress={() => {
                      playSound("click");
                      setShowColors(!showColors);
                    }}
                    >
                    <Text style={styles.subtitle}>Color del Kit</Text>
                    <View style={[styles.colorPreview, { backgroundColor: selectedColor || "#fff" }]} />
                    <Ionicons name={showColors ? "chevron-up" : "chevron-down"} color="#fff" size={20} />
                    </TouchableOpacity>
                    {showColors && (
                    <View style={styles.colorGrid}>
                        {(availableColors.length ? availableColors : crewColors).map((color) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => {
                              playSound("click");
                              setSelectedColor(color);
                            }}
                            style={[
                            styles.colorOption,
                            {
                                backgroundColor: color,
                                transform: [{ scale: selectedColor === color ? 1.15 : 1 }],
                                borderWidth: selectedColor === color ? 3 : 1,
                                borderColor: selectedColor === color ? "#FFD700" : "rgba(0,0,0,0.2)"
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
                            {editingPlayerId ? "Actualizar Ficha" : "Confirmar Fichaje"}
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

            {/* Botón Lista Plantilla */}
            <TouchableOpacity
                style={[styles.accordionButton, { backgroundColor: "rgba(0,0,0,0.5)", marginBottom: 20, borderWidth: 2, borderColor: '#fff' }]}
                onPress={() => {
                  playSound("click");
                  togglePlayerList();
                }}
            >
                <Ionicons name={showPlayerList ? "chevron-up" : "list-outline"} size={24} color="#fff" />
                <Text style={[styles.accordionButtonText, {color: '#fff'}]}>
                Plantilla Titular ({safePlayers.length})
                </Text>
            </TouchableOpacity>
          </View>
        }

        renderItem={({ item }) => {
             const isEditingThis = editingPlayerId === item.id;
             return (
                <View style={[styles.playerCard, isEditingThis && styles.playerCardEditing]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]}>
                        <Ionicons name="shirt" size={18} color="rgba(0,0,0,0.5)" style={{alignSelf:'center', marginTop:4}} />
                    </View>
                    <Text style={styles.playerText}>{item.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', gap: 15}}>
                        <TouchableOpacity onPress={() => { playSound("click");
                                                          startEditing(item)}}>
                            <Ionicons name="create-outline" size={22} color="#FFEB3B" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          playSound("click");
                          removePlayer(item.id);
                        }}>
                            {/* Icono de Tarjeta Roja */}
                            <View style={styles.redCardIcon}>
                                <View style={{width:12, height:16, backgroundColor:'#D32F2F', borderRadius: 2}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
             );
        }}

        ListFooterComponentStyle={{ flex: 1, justifyContent: 'center' }}
        ListFooterComponent={
          <View style={styles.menuContainer}>
            {/* Configuración - Estilo Marcador */}
            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: "#fff" }]}
                onPress={() => setShowCategoryModal(true)}
            >
                <Ionicons name="trophy" size={24} color="#1B5E20" />
                <View style={{alignItems: 'flex-start'}}>
                    <Text style={styles.menuLabel}>Torneo / Copa</Text>
                    <Text style={[styles.menuValue, {color: '#1B5E20'}]}>{category.toUpperCase()}</Text>
                </View>
            </TouchableOpacity>

            {hasSubcategories && (
                <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: "#FFEB3B" }]}
                onPress={() => {
                  playSound("click");
                  setShowSubCategoryModal(true);
                }}
                >
                <Ionicons name="filter-outline" size={24} color="#333" />
                <View style={{alignItems: 'flex-start'}}>
                    <Text style={styles.menuLabel}>División</Text>
                    <Text style={styles.menuValue}>{subCategory.toUpperCase()}</Text>
                </View>
                </TouchableOpacity>
            )}

            <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                    style={[styles.menuButton, { backgroundColor: "#212121", flex: 1 }]} // Estilo Árbitro
                    onPress={() => {
                      playSound("click");
                      setShowImpostorModal(true);
                    }}
                >
                    <Ionicons name="walk-outline" size={24} color="#fff" />
                    <View>
                        <Text style={[styles.menuLabel, {color: '#ccc'}]}>Simuladores</Text>
                        <Text style={[styles.menuValue, {color: '#fff'}]}>{impostors}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.menuButton, { backgroundColor: hintsEnabled ? "#4CAF50" : "#9E9E9E", flex: 1 }]}
                    onPress={() => {
                      playSound("click");
                      setHintsEnabled(!hintsEnabled);
                    }}
                >
                    <Ionicons name="videocam-outline" size={24} color="#fff" />
                    <View>
                        <Text style={[styles.menuLabel, {color: '#eee'}]}>VAR (Ayuda)</Text>
                        <Text style={[styles.menuValue, {color: '#fff'}]}>{hintsEnabled ? "ACTIVO" : "OFF"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>
        }
      />

      {/* --- Dock Inferior (Botón de Inicio) --- */}
      <View style={styles.bottomDock}>
          <TouchableOpacity 
            style={[styles.startButton, safePlayers.length < 3 && styles.disabledButton]} 
            onPress={() => {
              playSound("click");
              startOfflineGame();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.startText}>PITAZO INICIAL</Text>
          </TouchableOpacity>
      </View>

      {/* --- MODAL SIMULADORES (Estilo Pizarra Táctica Oscura) --- */}
      <Modal visible={showImpostorModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContentImpostors}>
            <Text style={styles.modalTitle}>¿Cuántos simulan?</Text>
            <Text style={styles.modalSubtitle}>
                  Plantilla Total: {safePlayers.length}
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
                      else Alert.alert("Reglamento", `Necesitas al menos ${getMinPlayersForImpostors(num)} jugadores.`);
                    }}
                    activeOpacity={disabled ? 1 : 0.7}
                  >
                      <View style={styles.impostorHeader}>
                          {/* Iconos de tarjetas para representar cantidad */}
                          <View style={{flexDirection:'row'}}>
                            {Array.from({length: num}).map((_, i) => (
                                <View key={i} style={{width:15, height:22, backgroundColor: impostors === num ? '#D32F2F' : '#555', marginRight:2, borderRadius:2}} />
                            ))}
                          </View>
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
                                 VS {crewCount} Honestos
                             </Text>
                          </View>
                      ) : (
                          <Text style={styles.minReqText}>Min {getMinPlayersForImpostors(num)} jugs.</Text>
                      )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={() => {
              playSound("click");
              setShowImpostorModal(false);
            }}>
              <Text style={styles.confirmText}>CONFIRMAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Modal Categoría (Estilo Copa) --- */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Elige la Copa</Text>
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
            <TouchableOpacity style={styles.closeModalButton} onPress={() => 
              {
                playSound("click");
              setShowCategoryModal(false)}}>
              <Text style={styles.closeModalText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Subcategoría */}
      <Modal visible={showSubCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Elige División</Text>
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
            <TouchableOpacity style={styles.closeModalButton} onPress={() => {
              playSound("click");
              setShowSubCategoryModal(false);
            }}>
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
    fontSize: 32, 
    fontWeight: "900",
    color: "#fff", 
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: "LuckiestGuy_400Regular",
    letterSpacing: 1,
  },
  
  // --- Botones Acordeón (Pizarra) ---
  accordionButton: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center", 
    gap: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10, // Menos redondeado para parecer botón físico
    paddingVertical: 14,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  accordionButtonText: { 
    fontSize: 18, 
    fontWeight: "800",
    textTransform: "uppercase",
    fontFamily: "LuckiestGuy_400Regular",
  },

  // --- Formulario (Ficha Técnica) ---
  card: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)", // Oscuro transparente
    borderRadius: 15, 
    padding: 20,
    marginTop: 10, 
    borderWidth: 2,
    borderColor: '#fff', // Línea de cal
  },
  cardEditing: {
      borderColor: "#FFEB3B", 
      backgroundColor: "rgba(0,0,0,0.6)",
  },
  input: {
    backgroundColor: "#fff", 
    borderWidth: 2,
    borderColor: "#ddd", 
    padding: 15,
    borderRadius: 10, 
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    fontFamily: "LuckiestGuy_400Regular",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)", 
    borderRadius: 10,
    marginTop: 15,
    padding: 10,
  },
  colorPreview: { width: 30, height: 30, borderRadius: 4, borderWidth: 2, borderColor: "#fff", marginRight: 10 },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 15,
  },
  colorOption: { width: 40, height: 40, borderRadius: 5, margin: 6 }, // Cuadrados estilo tela
  
  // Botones Acción
  actionButton: {
    backgroundColor: "#FFEB3B", // Amarillo intenso
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#FBC02D"
  },
  cancelButton: {
      backgroundColor: "#D32F2F", 
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: 'center',
      borderBottomWidth: 4,
      borderBottomColor: "#B71C1C"
  },
  actionButtonText: { 
    fontSize: 18, 
    color: "#333", 
    fontFamily: "LuckiestGuy_400Regular",
  },
  
  // Lista Jugadores (Alineación)
  playerCard: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff", // Fondo blanco como lista de papel
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playerCardEditing: {
      borderColor: "#FFEB3B", 
      borderWidth: 3,
  },
  colorDot: { width: 32, height: 32, borderRadius: 5, marginRight: 12, borderWidth: 1, borderColor: '#ddd' },
  playerText: { 
    fontSize: 18, 
    color: "#333", 
    fontFamily: "LuckiestGuy_400Regular",
  },
  redCardIcon: {
      padding: 4,
  },

  // --- MENÚ CENTRAL ---
  menuContainer: {
      marginHorizontal: 20,
      gap: 10,
  },
  menuButton: {
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
  },
  menuLabel: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      opacity: 0.8
  },
  menuValue: {
      fontSize: 18,
      fontWeight: "900",
      fontFamily: "LuckiestGuy_400Regular",
  },

  // --- DOCK INFERIOR ---
  bottomDock: {
      padding: 20,
      paddingBottom: 30, 
      backgroundColor: "#1B5E20", // Verde muy oscuro
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      borderTopWidth: 4,
      borderTopColor: '#fff', // Línea de fondo
  },
  startButton: {
    backgroundColor: "#fff", // Balón blanco
    borderRadius: 30, 
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#333' // Cuero negro clásico
  },
  startText: { 
    fontSize: 24, 
    color: "#333", 
    fontFamily: "LuckiestGuy_400Regular",
  },
  disabledButton: { opacity: 0.5, backgroundColor: '#ccc', borderColor: '#999' },

  // --- MODAL SIMULADORES ---
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentImpostors: {
    backgroundColor: "#212121", // Vestuario oscuro
    borderRadius: 20,
    padding: 25,
    width: "90%",
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalTitle: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "LuckiestGuy_400Regular",
  },
  modalSubtitle: {
      fontSize: 16,
      color: "#aaa",
      marginBottom: 20,
      textAlign: 'center'
  },
  impostorOptionsContainer: {
      width: '100%',
      gap: 15,
  },
  impostorCard: {
      backgroundColor: "#333",
      padding: 15,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#444',
  },
  impostorCardSelected: {
      backgroundColor: "#424242",
      borderColor: "#F44336", // Borde Rojo Tarjeta
  },
  impostorCardDisabled: {
      backgroundColor: "#222",
      opacity: 0.5,
  },
  impostorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  impostorNumber: {
      fontSize: 28,
      fontWeight: '900',
      color: '#ccc',
      fontFamily: "LuckiestGuy_400Regular",
  },
  versusContainer: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
  },
  versusText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#888',
  },
  minReqText: {
      fontSize: 12,
      color: '#777',
      fontStyle: 'italic',
  },
  confirmButton: {
      marginTop: 25,
      backgroundColor: "#4CAF50",
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center'
  },
  confirmText: {
      fontSize: 18,
      color: "#fff",
      fontFamily: "LuckiestGuy_400Regular",
  },

  // --- Modal Categoría ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1B5E20", // Verde oscuro
    borderRadius: 20, 
    padding: 20,
    width: "90%",
    height: "70%",
    borderWidth: 3,
    borderColor: "#fff",
  },
  categoryBox: {
    flex: 1,
    margin: 6, 
    backgroundColor: "rgba(255,255,255,0.1)", 
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryBoxSelected: { 
    backgroundColor: "#fff", 
    borderColor: "#FFEB3B",
  },
  categoryBoxText: { 
    fontSize: 14, 
    marginTop: 8, 
    color: "#fff",
    textAlign: 'center',
    fontFamily: "LuckiestGuy_400Regular",
  },
  categoryBoxTextSelected: { color: "#1B5E20" },
  closeModalButton: {
    marginTop: 15,
    alignSelf: "center",
    padding: 10,
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    paddingHorizontal: 30
  },  
  closeModalText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "LuckiestGuy_400Regular",
  },
});