import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export default function PlayerVoteRow({ player, onVote, floatStyle, opacity }) {

  // ⬇️ Animación de opacidad para fade-out
  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.playerRow, animatedOpacity]}>
      <Animated.View style={floatStyle}>
        <Image
          source={require("../assets/crewmate.webp")}
          style={[styles.avatar, { tintColor: player.color }]}
        />
      </Animated.View>

      <Text style={styles.name}>{player.name}</Text>

      <TouchableOpacity style={styles.voteBtn} onPress={() => onVote(player.id)}>
        <Text style={styles.voteText}>Votar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  playerRow: {
    backgroundColor: "#1C2038",
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2D3460"
  },
  avatar: { width: 45, height: 52, marginRight: 12 },
  name: { flex: 1, fontSize: 18, color: "#fff", fontWeight: "700" },
  voteBtn: { backgroundColor: "#FF4E6E", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12 },
  voteText: { color: "#fff", fontSize: 16, fontWeight: "900" }
});
