import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_TRACKS } from '@/data/mockData';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [currentTrack] = useState(MOCK_TRACKS[0]);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  return (
    <div className="h-20 bg-[hsl(var(--player-bg))] border-t border-[hsl(var(--border))] flex items-center px-4 gap-4">
      <div className="flex items-center gap-3 w-64 min-w-0">
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{currentTrack.title}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{currentTrack.artist}</p>
        </div>
        <button className="ml-2 text-pink-400 hover:text-pink-300 transition-colors flex-shrink-0">
          <Icon name="Heart" size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2 max-w-xl mx-auto">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`transition-colors ${shuffle ? 'text-purple-400' : 'text-[hsl(var(--muted-foreground))] hover:text-white'}`}
          >
            <Icon name="Shuffle" size={18} />
          </button>
          <button className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors">
            <Icon name="SkipBack" size={22} />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center hover:scale-105 transition-transform glow"
          >
            <Icon name={playing ? 'Pause' : 'Play'} size={18} className="text-white" />
          </button>
          <button className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors">
            <Icon name="SkipForward" size={22} />
          </button>
          <button
            onClick={() => setRepeat(!repeat)}
            className={`transition-colors ${repeat ? 'text-purple-400' : 'text-[hsl(var(--muted-foreground))] hover:text-white'}`}
          >
            <Icon name="Repeat" size={18} />
          </button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-[hsl(var(--muted-foreground))] w-8 text-right">1:18</span>
          <div className="flex-1 h-1.5 bg-[hsl(var(--border))] rounded-full cursor-pointer group relative">
            <div
              className="h-full rounded-full gradient-bg relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>
          <span className="text-xs text-[hsl(var(--muted-foreground))] w-8">{currentTrack.duration}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-40 justify-end">
        <button className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors">
          <Icon name="ListMusic" size={18} />
        </button>
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
