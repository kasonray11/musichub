import type { NowPlaying } from "../types";

interface NowPlayingDisplayProps {
  nowPlaying: NowPlaying | null;
}

export function NowPlayingDisplay({ nowPlaying }: NowPlayingDisplayProps) {

  if (!nowPlaying) {
    return (
      <div className="lcd-screen">
        <p className="lcd-line lcd-line--primary">-- no signal --</p>
      </div>
    );
  }

  return (
    <div className="lcd-screen">
    {nowPlaying.artworkDataUrl ? (
      <img src={nowPlaying.artworkDataUrl} alt={'${nowPlaying.album cover art'} className = "album-art" />
    ): ( <div className="album-art album-art--empty" aria-hidden="true" />)}

      <p className="lcd-line lcd-line--primary">{nowPlaying.track}</p>
      <p className="lcd-line lcd-line--secondary">
        {nowPlaying.artist} — {nowPlaying.album}
      </p>
      <p className="lcd-line lcd-line--status">
        {nowPlaying.isPlaying ? "▶ playing" : "⏸ paused"}
      </p>
    </div>
  );
}
