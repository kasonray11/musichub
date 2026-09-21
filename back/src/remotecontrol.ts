import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type remoteCommand = "PlayPause" | "Next" | "Previous" | "ToggleMute" | "VolumeUp" | "VolumeDown";

async function sendRemoteCommand(command: remoteCommand): Promise<void> {
    await execFileAsync("dbus-send", ["--system", "--print-reply", "--type=method_call", "--dest=org.gnome.ShairportSync", "/org/gnome/ShairportSync", `org.gnome.ShairportSync.RemoteControl.${command}`]);
}

export async function playPause(): Promise<void> {
    await sendRemoteCommand("PlayPause");
}

export async function nextTrack(): Promise<void> {
    await sendRemoteCommand("Next");
}

export async function previousTrack(): Promise<void>{
    await sendRemoteCommand("Previous");
}

export async function volumeUp(): Promise<void> {
    await sendRemoteCommand("VolumeUp");
}

export async function volumeDown(): Promise<void> {
    await sendRemoteCommand("VolumeDown");
}

export async function toggleMute(): Promise<void> {
    await sendRemoteCommand("ToggleMute");
}

export async function setVolume(percent: number): Promise<void> {

    const clampedPercent = Math.max(0, Math.min(100, percent));
    const airplayVolume = (clampedPercent / 100) * 30 - 30;
   
    await execFileAsync("dbus-send", [
      "--system",
      "--print-reply",
      "--type=method_call",
      "--dest=org.gnome.ShairportSync",
      "/org/gnome/ShairportSync",
      "org.gnome.ShairportSync.RemoteControl.SetAirplayVolume",

      `double:${airplayVolume.toFixed(2)}`,
    ]);
  }