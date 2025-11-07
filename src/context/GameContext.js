// 🧠 context/GameContext.js
import { createContext, useContext, useEffect, useState } from "react";
export const GameContext = createContext({});

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [impostorId, setImpostorId] = useState(null);
  const [word, setWord] = useState("");
  const [gameWinner, setGameWinner] = useState(null);
  const [alivePlayers, setAlivePlayers] = useState([]); // ✅ nuevo estado

  // 🔄 Mantener vivos sincronizados con los jugadores (solo si está vacío o reiniciado)
  useEffect(() => {
    if (Array.isArray(players) && players.length > 0) {
      setAlivePlayers(players);
    }
  }, [players]);

const defaultWords = {
  general: {
    general: ["Perro", "Gato", "Café", "Playa", "Montaña", "Pizza", "Escuela", "Avión", "PC", "Hospital"],
  },
  futbol: { // 💡 AHORA ES UN OBJETO CON SUBCATEGORÍAS
    general: ["Pelota", "Árbitro", "Arco", "Cancha", "Offside", "Penal", "Hincha", "Campeón"],
    jugadores: ["Messi", "Ronaldo", "Maradona", "Pele", "Haaland", "Mbappé", "Zidane", "Neymar"],
    equipos: ["Real Madrid", "Barcelona", "Boca Juniors", "River Plate", "Manchester City", "Liverpool", "Juventus", "Bayern Múnich"],
  },
  musica: { // 💡 AHORA ES UN OBJETO CON SUBCATEGORÍAS
    general: ["Guitarra", "Batería", "Micrófono", "Concierto", "Rock", "Pop", "Reggaetón", "Nota", "DJ"],
    cantantes: ["Taylor Swift", "Bad Bunny", "Queen", "The Beatles", "Shakira", "Maluma", "Dua Lipa", "Ozuna"],
    canciones: ["Bohemian Rhapsody", "Despacito", "Smells Like Teen Spirit", "Thriller", "Hey Jude", "Havana", "Blinding Lights", "As It Was"],
  },
  cine: { // Mantenemos cine como objeto para uniformidad
    general: ["Actor", "Cámara", "Popcorn", "Acción", "Director", "Drama", "Comedia", "Horror", "Oscar", "Escena"],
  },
};

  const resetGame = () => {
    setPlayers([]);
    setImpostorId(null);
    setWord("");
    setGameWinner(null);
    setAlivePlayers([]); // ✅ limpiar vivos
  };

  // 🧠 context/GameContext.js (función startGame)

const startGame = (impostorCount = 1, category = "general", subCategory = "general") => {
  if (!Array.isArray(players) || players.length === 0) {
    console.warn("❌ No hay jugadores para iniciar el juego");
    return;
  }

  // ✅ Validar categoría
  const chosenCategory = defaultWords[category] ? category : "general";
  const subCategories = defaultWords[chosenCategory];
  const subCategoryKeys = Object.keys(subCategories);

  // ✅ Validar subcategoría
  const chosenSubCategory = subCategoryKeys.includes(subCategory)
    ? subCategory
    : "general";

  const words = subCategories[chosenSubCategory];
  const pick = words[Math.floor(Math.random() * words.length)];
  setWord(pick);

  // 🎭 Elegir impostores
  const impostorCountToUse = Math.min(impostorCount, players.length - 1);
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const impostorPlayers = shuffled.slice(0, impostorCountToUse);
  const impostorIds = impostorPlayers.map((p) => p.id);

  setImpostorId(impostorIds[0]);

  console.log("🕵️ Impostores asignados:", impostorIds);
  console.log("📜 Palabra elegida:", pick, "🗂️ Categoría:", chosenCategory, "/", chosenSubCategory);

  return {
    impostorId: impostorIds[0],
    impostorIds,
    word: pick,
    category: chosenCategory,
    subCategory: chosenSubCategory,
  };
};


  return (
    <GameContext.Provider
      value={{
        players, setPlayers,
        alivePlayers, setAlivePlayers,
        impostorId, setImpostorId,
        startGame, resetGame,
        gameWinner, setGameWinner,
        word, setWord,
        categories: Object.keys(defaultWords), // 🔹 ["general", "futbol", "musica", "cine"]
        getSubCategories: (cat) => Object.keys(defaultWords[cat] || { general: [] }),
        defaultWords,
      }}
    >
      {children}
    </GameContext.Provider>
      );
}

export const useGameContext = () => useContext(GameContext);
