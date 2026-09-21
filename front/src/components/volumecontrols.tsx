import { useEffect, useRef, useState } from "react";
import { BACKEND_HTTP_URL } from "../config";

interface VolumeControlsProps {
  volumePercent: number | undefined;
}

async function sendCommand(path: string, body?: object): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_HTTP_URL}${path}`, {
      method: "POST",
      ...(body && {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    });
    if (!response.ok) {
      console.error(`Command to ${path} failed with status ${response.status}`);
    }
  } catch (err) {
    console.error(`Command to ${path} failed:`, err);
  }
}

export function VolumeControls({ volumePercent }: VolumeControlsProps) {
  const [localPercent, setLocalPercent] = useState(volumePercent ?? 50);

  useEffect(() => {
    if (volumePercent !== undefined) {
      setLocalPercent(volumePercent);
    }
  }, [volumePercent]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSliderChange(newPercent: number) {
    setLocalPercent(newPercent);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      sendCommand("/control/volume", { percent: newPercent });
    }, 120);
  }

  return (
    <div className="volume-controls">
      <button
        type="button"
        className="control-button control-button--small"
        onClick={() => sendCommand("/control/mute")}
        aria-label="Mute"
      >
        🔇
      </button>

      <input
        type="range"
        className="volume-slider"
        min={0}
        max={100}
        value={localPercent}
        onChange={(event) => handleSliderChange(Number(event.target.value))}
        aria-label="Volume"
        style={{ ["--fill-percent" as string]: `${localPercent}%` }}
      />
    </div>
  );
}