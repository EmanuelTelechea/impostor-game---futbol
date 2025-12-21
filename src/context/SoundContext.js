import { createContext, useEffect } from "react";
import { registerSound, setSoundEnabled } from "../utils/soundManager";

export const SoundContext = createContext();

export function SoundProvider({ children, enabled }) {

  useEffect(() => {
    // Registrar TODOS los sonidos una sola vez
    registerSound("click", require("../assets/sounds/click.mp3"));
    registerSound("start", require("../assets/sounds/start.mp3"));
    registerSound("vote", require("../assets/sounds/vote.mp3"));
    registerSound("giro", require("../assets/sounds/giro.mp3"));
    registerSound("win", require("../assets/sounds/win.mp3"));
    registerSound("lose", require("../assets/sounds/lose.mp3"));
    registerSound("notImpostor", require("../assets/sounds/notImpostor.mp3"));
    registerSound("wasImpostor", require("../assets/sounds/wasImpostor.mp3"));
  }, []);

  useEffect(() => {
    setSoundEnabled(enabled);
  }, [enabled]);

  return children;
}
