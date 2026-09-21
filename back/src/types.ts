export interface NowPlaying {
    track: string;
    artist: string;
    album: string;
    isPlaying: boolean;
    elapsedSeconds?: number;
    artworkDataUrl?: string;
    volumePercent?: number;

}