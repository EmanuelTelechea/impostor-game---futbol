import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import "react-native-reanimated";

import { initInterstitial } from "./src/ads/interstitialManager";
import { GameProvider } from "./src/context/GameContext";
import { SoundProvider } from "./src/context/SoundContext";

import AppLoadingScreen from "./src/screens/AppLoadingScreen";

import EliminationScreen from "./src/screens/EliminationScreen";
import GameScreen from "./src/screens/GameScreen";
import HomeScreen from "./src/screens/HomeScreen";
import OfflineSetupScreen from "./src/screens/OfflineSetupScreen";
import ResultScreen from "./src/screens/ResultScreen";
import RulesScreen from "./src/screens/RulesScreen";
import VotingScreen from "./src/screens/VotingScreen";
import WordRevealScreen from "./src/screens/WordRevealScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OfflineSetup" component={OfflineSetupScreen} />
        <Stack.Screen name="WordReveal" component={WordRevealScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Voting" component={VotingScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Elimination" component={EliminationScreen} />
        <Stack.Screen name="Rules" component={RulesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    initInterstitial();
  }, []);
  
  return (
    <GameProvider>
      <SoundProvider enabled={true}>
        {appReady ? (
          <AppNavigator />
        ) : (
          <AppLoadingScreen onFinish={() => setAppReady(true)} />
        )}
      </SoundProvider>
    </GameProvider>
  );
}
