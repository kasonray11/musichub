import { useState } from "react";
import { BACKEND_HTTP_URL } from "../config";

interface PlaybackControlsProps {
    isPlaying: boolean;
}

async function sendCommand(path: string): Promise<void> {
  try {
      const response = await fetch(`${BACKEND_HTTP_URL}${path}`, { method: "POST" });
      if (!response.ok) {
          console.error(`command to ${path} failed with status ${response.status}`);
      }
  } catch (err) {
      console.error(`command to ${path} failed:`, err);
  }
}

export function PlaybackControls({ isPlaying}: PlaybackControlsProps) {
    const [pressedButton, setPressedButton] = useState<string | null>(null);

    function handlePress(label: string, path: string) {
        setPressedButton(label);
        sendCommand(path);
        setTimeout(() => setPressedButton(null), 200);
    }

    return (
        <div className="playback-controls">
      <button
        type="button"
        className={`control-button ${pressedButton === "previous" ? "control-button--pressed" : ""}`}
        onClick={() => handlePress("previous", "/control/previous")}
        aria-label="Previous track"
      >
        ⏮
      </button>
 
      <button
        type="button"
        className={`control-button control-button--primary ${pressedButton === "playpause" ? "control-button--pressed" : ""}`}
        onClick={() => handlePress("playpause", "/control/playpause")}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
 
      <button
        type="button"
        className={`control-button ${pressedButton === "next" ? "control-button--pressed" : ""}`}
        onClick={() => handlePress("next", "/control/next")}
        aria-label="Next track"
      >
        ⏭
      </button>
    </div>
  );
}