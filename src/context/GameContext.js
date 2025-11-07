// 🧠 context/GameContext.js
import { createContext, useContext, useEffect, useState } from "react";
export const GameContext = createContext({});

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [impostorId, setImpostorId] = useState(null);
  const [word, setWord] = useState("");
  const [gameWinner, setGameWinner] = useState(null);
  const [alivePlayers, setAlivePlayers] = useState([]); // ✅ nuevo estado
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);

  // 🔄 Mantener vivos sincronizados con los jugadores (solo si está vacío o reiniciado)
  useEffect(() => {
    if (Array.isArray(players) && players.length > 0) {
      setAlivePlayers(players);
    }
  }, [players]);

const defaultWords = {
  general: {
    general: [
      "Perro", "Gato", "Mate", "Café", "Playa", "Montaña", "Pizza", "Escuela", "Avión", "Computadora",
      "Hospital", "Libro", "Reloj", "Teléfono", "Cine", "Museo", "Jardín", "Supermercado", "Helado", "Amigo",
      "Familia", "Trabajo", "Fiesta", "Chocolate", "Sombrero", "Ventana", "Camisa", "Auto", "Moto", "Bicicleta",
      "Lluvia", "Sol", "Nieve", "Ciudad", "Campo", "Río", "Bosque", "Casa", "Hotel", "Cama", "Radio",
      "Televisor", "Comida", "Puerta", "Zapato", "Mesa", "Silla", "Lámpara", "Escalera", "Puente", "Carpeta",
      // 🇺🇾🇦🇷 Locales:
      "Asado", "Parrilla", "Ferné", "Termo", "Bombilla", "Ñeri", "Che", "Boliche", "Colectivo", "Camioneta",
      "Barrio", "Panchería", "Fiambrería", "Kiosco", "Mate dulce", "Yerba", "Refresco", "Pancho", "Empanada", "Milanga",
    ],
  },

  futbol: {
    general: [
      "Pelota", "Árbitro", "Arco", "Cancha", "Offside", "Penal", "Hincha", "Campeón", "Tiro libre", "Corner",
      "Gol", "Expulsión", "VAR", "Final", "Mundial", "Camiseta", "Botines", "Entrenador", "Capitán", "Cambio",
      "Lesión", "Tribuna", "Clásico", "Derrota", "Victoria", "Empate", "Táctica", "Defensa", "Ataque", "Medio campo",
      "Bombonera", "Monumental", "Centenario", "Campeón del Siglo", "Celeste", "Albiceleste", "Charrúa", "Barras", "Hinchas", "Mate en la cancha",
      "Picado", "Fútbol 5", "Cancha de barrio", "Clásico del Río de la Plata", "Final del mundo", "Selección", "DT", "Golero", "Patadura", "Pelotazo",
    ],
    jugadores: [
      "Maradona", "Pelé", "Zidane", "Ronaldinho", "Ronaldo Nazário", "Henry", "Beckham", "Baresi", "Cannavaro", "Buffon",
        "Iniesta", "Xavi", "Pirlo", "Totti", "Del Piero", "Raúl", "Casillas", "Kaká", "Shevchenko", "Maldini",
        "Batistuta", "Riquelme", "Crespo", "Aimar", "Simeone", "Tevez", "Gallardo", "Verón", "Francescoli", "Forlán",
        "Recoba", "Rubén Sosa", "Obdulio Varela", "Ghiggia", "Luis Cubilla", "Enzo Francescoli", "El Loco Abreu", "Higuita", "Valderrama", "Puyol",
        "Roberto Carlos", "Cafu", "Van Nistelrooy", "Lampard", "Gerrard", "Scholes", "Cantona", "Vieira", "Zamorano", "Stoichkov",
      "Messi", "Cristiano Ronaldo", "Neymar", "Mbappé", "Haaland", "Vinicius Jr", "Rodrygo", "Bellingham", "Valverde", "Enzo Fernández",
        "Julián Álvarez", "Lautaro Martínez", "Di María", "De Paul", "Otamendi", "Romero", "Martínez", "Paredes", "Garnacho", "Dybala",
        "Suárez", "Cavani", "Núñez", "Araujo", "De La Cruz", "Bentancur", "Ugarte", "Torres", "Vecino", "Giménez",
        "Modric", "Kroos", "Rodri", "Pedri", "Gavi", "Lewandowski", "Kane", "Saka", "Foden", "Barella",
        "Osimhen", "Giroud", "Griezmann", "Upamecano", "Koundé", "Hakimi", "Onana", "Rashford", "Bruno Fernandes", "Rice",
        "Musiala", "Coman", "Chiesa", "Son Heung-min", "Trossard", "Martín Cáceres", "Brian Rodríguez", "Maxi Araújo", "Facundo Torres", "Viña",
    ],
    equipos: [
      "Boca Juniors", "River Plate", "Peñarol", "Nacional", "Defensor Sporting", "Danubio", "Liverpool (URU)", "Racing Club", "Independiente",
      "San Lorenzo", "Estudiantes", "Newell's", "Rosario Central", "Colón", "Gimnasia", "Lanús", "Talleres", "Vélez", "Argentinos Juniors", "Racing (URU)",
      "Real Madrid", "Barcelona", "PSG", "Manchester City", "Juventus", "Bayern Múnich", "Inter", "Napoli", "Flamengo", "Palmeiras",
      "Benfica", "Chelsea", "Arsenal", "Liverpool", "Atlético de Madrid", "Borussia Dortmund", "Ajax", "Porto", "AC Milan", "Roma",
    ],
  },

  musica: {
    general: [
      "Guitarra", "Batería", "Micrófono", "Concierto", "Rock", "Pop", "Reggaetón", "Nota", "DJ", "Melodía",
      "Ritmo", "Disco", "Grabación", "Escenario", "Auriculares", "Altavoz", "Festival", "Baile", "Letra", "Coro",
      "Instrumento", "Piano", "Violín", "Bajo", "Ensayo", "Cumbia", "Murga", "Tambor", "Milonga", "Folklore",
      
    ],
    cantantes: [
      "Abel Pintos", "Soledad", "Chano", "Wos", "Nicki Nicole", "Bizarrap", "Trueno", "Duki", "Maria Becerra", "Tini",
      "Callejeros", "No Te Va Gustar", "La Vela Puerca", "El Cuarteto de Nos", "Lucas Sugo", "Jaime Roos", "Rombai", "Marama",
      "Los Auténticos Decadentes", "Los Fabulosos Cadillacs", "Soda Stereo", "Gustavo Cerati", "Ciro", "Andrés Calamaro", "Fito Páez",
      "La Renga", "Patricio Rey", "Tan Biónica", "Bersuit", "Axel",
      "Taylor Swift", "Bad Bunny", "Queen", "The Beatles", "Shakira", "Maluma", "Dua Lipa", "Ozuna", "Adele", "Bruno Mars",
      "Billie Eilish", "Ed Sheeran", "Rauw Alejandro", "Karol G", "Beyoncé", "Michael Jackson", "The Weeknd", "Coldplay",
      "Rosalía", "Justin Bieber", "Harry Styles", "Nirvana", "Selena Gomez", "Post Malone", "Drake", "Luis Fonsi", "Daddy Yankee",
      "Jennifer Lopez", "Camila Cabello", "Imagine Dragons", "Eminem", "Katy Perry",
    ],
    canciones: [
      "La Cumbia de los Trapos", "De Música Ligera", "En el Balcón", "Ciudad Mágica", "Me Hace Bien", "Brindis", "Todo Cambia", 
      "Arrancármelo", "Ella Baila Sola", "Loco", "Y Sin Embargo", "Don", "Crimen", "Color Esperanza", "Mi Princesa", "La Noche",
      "Cielito Lindo", "Cuando Pase el Temblor", "Persiana Americana", "Madura", "Bipolar", "Universo Paralelo",
      "Bohemian Rhapsody", "Despacito", "Smells Like Teen Spirit", "Thriller", "Hey Jude", "Havana", "Blinding Lights", "As It Was",
      "Shape of You", "Uptown Funk", "Someone Like You", "Levitating", "Flowers", "Dance Monkey", "Tusa", "La Canción",
      "Rolling in the Deep", "Bad Guy", "Perfect", "Viva la Vida", "Peaches", "Señorita", "Calma", "Tití Me Preguntó",
      "Stay", "Shallow", "Rockstar", "Dákiti", "Montero", "Umbrella",
    ],
  },

  cine: {
    general: [
      "Actor", "Cámara", "Palomitas", "Acción", "Director", "Drama", "Comedia", "Terror", "Oscar", "Escena",
      "Guión", "Rodaje", "Tráiler", "Cineasta", "Pantalla", "Butaca", "Proyector", "Crítica", "Vestuario", "Maquillaje",
      "Efectos especiales", "Sonido", "Clímax", "Secuela", "Película", "Serie", "Documental", "Netflix", "Estreno", "Spoiler",
      "Popcorn", "Cinépolis", "Sala", "Protagonista", "Cortometraje",
    ],
    peliculas: [
      "Titanic", "Avatar", "Avengers", "El Padrino", "Star Wars", "Jurassic Park", "Matrix", "Inception", "Toy Story", "Frozen",
      "Spider-Man", "Batman", "Harry Potter", "Shrek", "Coco", "Cars", "Oppenheimer", "Barbie", "Encanto", "Los Increíbles",
      "Relatos Salvajes", "El Secreto de Sus Ojos", "Nueve Reinas", "Whisky", "Mr. Kaplan", "Mi Mundial", "El Robo del Siglo",
    ],
    actores: [
      "Leonardo DiCaprio", "Tom Hanks", "Robert Downey Jr.", "Scarlett Johansson", "Emma Stone", "Will Smith", "Brad Pitt", "Johnny Depp",
      "Morgan Freeman", "Anne Hathaway", "Ricardo Darín", "Guillermo Francella", "Nancy Dupláa", "Luis Brandoni", "Natalia Oreiro",
      "César Troncoso", "China Zorrilla", "Hugh Jackman", "Zendaya", "Dwayne Johnson", "Chris Evans", "Meryl Streep",
    ],
  },

  comida: {
    general: [
      "Pizza", "Hamburguesa", "Papas fritas", "Helado", "Empanada", "Asado", "Milanesa", "Chivito", "Pancho", "Tarta",
      "Pastel", "Tortilla", "Fainá", "Choripán", "Panchito", "Lasaña", "Ñoquis", "Ravioles", "Parrilla", "Dulce de leche",
      "Bizcocho", "Medialuna", "Pan", "Mate", "Alfajor", "Facturas", "Postre", "Torta frita", "Sanguche", "Canelones",
    ],
  },

  tecnologia: {
    general: [
      "Computadora", "Mouse", "Teclado", "Celular", "Tablet", "Wi-Fi", "Cable", "Internet", "Pantalla", "App",
      "Red social", "Videojuego", "Carga", "Bluetooth", "Auriculares", "Robot", "ChatGPT", "Impresora", "USB", "Cámara",
      "Reproductor", "Consola", "Control", "Tecla", "Programador", "Código", "Bug", "Pantallazo", "Servidor", "Nube",
    ],
  },

  paises: {
    general: [
      "Uruguay", "Argentina", "Brasil", "Chile", "Paraguay", "Bolivia", "Perú", "Ecuador", "Colombia", "Venezuela",
      "México", "Estados Unidos", "España", "Italia", "Francia", "Alemania", "Portugal", "Japón", "China", "Rusia",
      "Canadá", "Australia", "Suiza", "Grecia", "Irlanda", "Holanda", "Suecia", "Corea del Sur", "Sudáfrica", "Egipto",
    ],
  },

  videojuegos: {
    general: [
      "PlayStation", "Xbox", "Nintendo", "Mario", "Zelda", "Minecraft", "FIFA", "GTA", "Counter Strike", "Valorant",
      "Fortnite", "Call of Duty", "Among Us", "The Sims", "LOL", "PUBG", "Rocket League", "Pokémon", "Tetris", "Sonic",
      "Pac-Man", "Guitar Hero", "Crash Bandicoot", "Red Dead", "Roblox", "Fall Guys", "Free Fire", "Skyrim", "Halo", "Overwatch",
    ],
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
        category, setCategory,
        subCategory, setSubCategory,
      }}
    >
      {children}
    </GameContext.Provider>
      );
}

export const useGameContext = () => useContext(GameContext);
