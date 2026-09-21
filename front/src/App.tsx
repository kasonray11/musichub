import { useState } from "react";
import { useNowPlaying } from "./hooks/useNowPlaying";
import { NowPlayingDisplay } from "./components/NowPlayingDisplay";
import { ConnectionIndicator } from "./components/ConnectionIndicator";
import { SoundWave } from "./components/SoundWave";
import { PlaybackControls } from "./components/PlaybackControls";
import { VolumeControls } from "./components/volumecontrols";
import { HamburgerMenu } from "./components/hamburgermenu";
import { HistoryPage } from "./components/historypage";
import { MostPlayedPage } from "./components/mostplayedpage";
import type { Page } from "./types";

function App() {
  const { nowPlaying, status } = useNowPlaying();

  const [page, setPage] = useState<Page>("now-playing");

  return (
    <div className="app-shell">
      <div className="amp-panel">
        <HamburgerMenu currentPage={page} onNavigate={setPage} />

        {page === "now-playing" ? (
          <>
            <SoundWave isPlaying={nowPlaying?.isPlaying ?? false} />

            <div className="now-playing-row">
              <NowPlayingDisplay nowPlaying={nowPlaying} />
            </div>

            <PlaybackControls isPlaying={nowPlaying?.isPlaying ?? false} />
            <VolumeControls volumePercent={nowPlaying?.volumePercent} />
            <ConnectionIndicator status={status} />
          </>
        ) : page === "history" ? (
          <HistoryPage />
        ) : (
          <MostPlayedPage />
        )}
      </div>
    </div>
  );
}

export default App;
