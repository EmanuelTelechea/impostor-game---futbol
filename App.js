import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-reanimated';

import { GameProvider } from "./src/context/GameContext";

import EliminationScreen from "./src/screens/EliminationScreen";
import GameScreen from "./src/screens/GameScreen";
import HomeScreen from "./src/screens/HomeScreen";
import OfflineSetupScreen from "./src/screens/OfflineSetupScreen";
import ResultScreen from "./src/screens/ResultScreen";
import RulesScreen from "./src/screens/RulesScreen";
import Settings from "./src/screens/Settings";
import VotingScreen from "./src/screens/VotingScreen";
import WordRevealScreen from "./src/screens/WordRevealScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="OfflineSetup" component={OfflineSetupScreen} />
          <Stack.Screen name="WordReveal" component={WordRevealScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Voting" component={VotingScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Elimination" component={EliminationScreen} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Rules" component={RulesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
