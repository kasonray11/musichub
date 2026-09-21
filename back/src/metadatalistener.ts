import { createReadStream } from "node:fs";
import type { NowPlaying } from "./types.js";

const METADATA_PIPE_PATH = "/tmp/shairport-sync-metadata";

const ITEM_REGEX =
  /<item>\s*<type>([0-9a-f]+)<\/type>\s*<code>([0-9a-f]+)<\/code>\s*<length>(\d+)<\/length>(?:\s*<data(?:[^>]*)>([^<]*)<\/data>)?\s*<\/item>/g;

function hexCodeToString(hex: string): string {
  return Buffer.from(hex, "hex").toString("ascii");
}

function detectImageMimeType(bytes: Buffer): string {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  return "application/octet-stream";
}

let lastPlayStartTime = 0;
const PFLS_DEBOUNCE_MS = 1000;

let currentTrack: Partial<NowPlaying> = {};

export function setPlayingState(isPlaying: boolean): void {
  currentTrack.isPlaying = isPlaying;
  if (isPlaying) {
    lastPlayStartTime = Date.now();
  }
}

export function setVolumePercent(percent: number): void {
  currentTrack.volumePercent = percent;
}

export function listenForMetadata(onUpdate: (data: NowPlaying) => void) {
  const pipeStream = createReadStream(METADATA_PIPE_PATH);
  let buffer = "";

  pipeStream.on("data", (chunk) => {
    buffer += chunk.toString("utf8");

    let match: RegExpExecArray | null;
    while ((match = ITEM_REGEX.exec(buffer)) !== null) {
      const [, typeHex, codeHex, , dataB64] = match;
      const type = hexCodeToString(typeHex);
      const code = hexCodeToString(codeHex);
      handleItem(type, code, dataB64 ?? "", onUpdate);
    }

    const lastItemEnd = buffer.lastIndexOf("</item>");
    if (lastItemEnd !== -1) {
      buffer = buffer.slice(lastItemEnd + "</item>".length);
    }
  });

  pipeStream.on("error", (err) => {
    console.error(
      "Metadata pipe error - is shairport-sync running, and does pipe_name in " +
        "/etc/shairport-sync.conf match METADATA_PIPE_PATH above?",
      err
    );
  });
}

function handleItem(
  type: string,
  code: string,
  base64Data: string,
  onUpdate: (data: NowPlaying) => void
) {
  if (type === "core") {
    const text = base64Data ? Buffer.from(base64Data, "base64").toString("utf8") : "";

    if (code === "minm") {
      if (text !== currentTrack.track) {
        currentTrack.artworkDataUrl = undefined;
      }
      currentTrack.track = text;
    }
    if (code === "asar") currentTrack.artist = text;
    if (code === "asal") currentTrack.album = text;
  }

  if (type === "ssnc") {
    if (code === "pend") currentTrack.isPlaying = false;

    if (code === "pbeg" || code === "pres") {
      currentTrack.isPlaying = true;
      lastPlayStartTime = Date.now();
    }

    if (code === "pfls" && Date.now() - lastPlayStartTime > PFLS_DEBOUNCE_MS) {
      currentTrack.isPlaying = false;
    }

    if (code === "PICT" && base64Data) {
      const rawBytes = Buffer.from(base64Data, "base64");
      const mimeType = detectImageMimeType(rawBytes);
      currentTrack.artworkDataUrl = `data:${mimeType};base64,${base64Data}`;
    }

    if (code === "pvol" && base64Data) {
      const text = Buffer.from(base64Data, "base64").toString("utf8");
      const [airplayVolumeStr] = text.split(",");
      const airplayVolume = parseFloat(airplayVolumeStr);

      if (!Number.isNaN(airplayVolume) && airplayVolume >= -30) {
        currentTrack.volumePercent = Math.round(((airplayVolume + 30) / 30) * 100);
      }
    }
  }

  if (currentTrack.track) {
    onUpdate({
      track: currentTrack.track,
      artist: currentTrack.artist ?? "Unknown Artist",
      album: currentTrack.album ?? "Unknown Album",
      isPlaying: currentTrack.isPlaying ?? true,
      artworkDataUrl: currentTrack.artworkDataUrl,
      volumePercent: currentTrack.volumePercent,
    });
  }
}