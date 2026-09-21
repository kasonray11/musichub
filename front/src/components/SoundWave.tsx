interface SoundWaveProps {
  isPlaying: boolean;
}

const BAR_COUNT = 32;

export function SoundWave({ isPlaying }: SoundWaveProps) {
  return (
    <div
      className={`sound-wave ${isPlaying ? "sound-wave--active" : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${(i % 5) * 0.12}s` }}></span>
      ))}
    </div>
  );
}