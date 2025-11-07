import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-reanimated';

import { GameProvider } from "./src/context/GameContext";

import EliminationScreen from "./src/screens/EliminationScreen";
import GameScreen from "./src/screens/GameScreen";
import HomeScreen from "./src/screens/HomeScreen";
import OfflineSetupScreen from "./src/screens/OfflineSetupScreen";
import ResultScreen from "./src/screens/ResultScreen";
import Settings from "./src/screens/Settings";
import VotingScreen from "./src/screens/VotingScreen";
import WordRevealScreen from "./src/screens/WordRevealScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: "Impostor Game" }}
          />
          <Stack.Screen 
            name="OfflineSetup" 
            component={OfflineSetupScreen}
            options={{ title: "Configurar Jugadores" }}
          />
          <Stack.Screen 
            name="WordReveal" 
            component={WordRevealScreen}
            options={{ title: "Palabra Secreta" }}
          />
          <Stack.Screen
           name="Game" 
           component={GameScreen} 
           options={{ title: "Ronda" }} 
           />
          <Stack.Screen 
          name="Voting" 
          component={VotingScreen} 
          options={{ title: "Votar" }} 
          />
          <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{ title: "Resultado" }} 
          />
          <Stack.Screen 
          name="Elimination" 
          component={EliminationScreen} 
          options={{ headerShown: false }} 
          />
          <Stack.Screen 
          name="Settings" 
          component={Settings} 
          />

        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
