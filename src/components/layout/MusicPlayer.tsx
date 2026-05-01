import Icon from '@/components/ui/icon';
import { usePlayer } from '@/context/PlayerContext';

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const { currentTrack, isPlaying, progress, volume, duration, togglePlay, seek, setVolume } = usePlayer();

  const currentSec = duration ? (progress / 100) * duration : 0;

  if (!currentTrack) {
    return (
      <div className="h-20 bg-[hsl(var(--player-bg))] border-t border-[hsl(var(--border))] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
          <Icon name="Music2" size={20} />
          <span className="text-sm">Выберите трек для воспроизведения</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-20 bg-[hsl(var(--player-bg))] border-t border-[hsl(var(--border))] flex items-center px-4 gap-4">
      <div className="flex items-center gap-3 w-64 min-w-0">
        {currentTrack.cover_url ? (
          <img
            src={currentTrack.cover_url}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
            <Icon name="Music2" size={18} className="text-white" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{currentTrack.title}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2 max-w-xl mx-auto">
        <div className="flex items-center gap-5">
          <button className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors opacity-40 cursor-not-allowed">
            <Icon name="SkipBack" size={22} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center hover:scale-105 transition-transform glow"
          >
            <Icon name={isPlaying ? 'Pause' : 'Play'} size={18} className="text-white" />
          </button>
          <button className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors opacity-40 cursor-not-allowed">
            <Icon name="SkipForward" size={22} />
          </button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-[hsl(var(--muted-foreground))] w-8 text-right">
            {formatTime(currentSec)}
          </span>
          <div className="flex-1 h-1.5 bg-[hsl(var(--border))] rounded-full cursor-pointer group relative">
            <div
              className="h-full rounded-full gradient-bg relative pointer-events-none"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={e => seek(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>
          <span className="text-xs text-[hsl(var(--muted-foreground))] w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-40 justify-end">
        <Icon name={volume > 50 ? 'Volume2' : volume > 0 ? 'Volume1' : 'VolumeX'} size={18} className="text-[hsl(var(--muted-foreground))]" />
        <div className="w-20 h-1.5 bg-[hsl(var(--border))] rounded-full cursor-pointer relative group">
          <div className="h-full rounded-full bg-purple-500" style={{ width: `${volume}%` }} />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          />
        </div>
      </div>
    </div>
  );
}
