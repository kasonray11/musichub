export interface NowPlaying {
  track: string;
  artist: string;
  album: string;
  isPlaying: boolean;
  elapsedSeconds?: number;
  artworkDataUrl?: string;
  volumePercent?: number;
}

export interface HistoryItem {
  id: number;
  track: string;
  artist: string;
  album: string;
  playedAt: string;
}

export interface MostPlayedItem {
  track: string;
  artist: string;
  playCount: number;
}

export type Page = "now-playing" | "history" | "most-played";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
