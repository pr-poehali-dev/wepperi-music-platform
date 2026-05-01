import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Track } from '@/data/mockData';

interface Props {
  track: Track;
  index?: number;
  showIndex?: boolean;
}

function formatPlays(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

export default function TrackCard({ track, index, showIndex }: Props) {
  const [liked, setLiked] = useState(track.liked);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {showIndex && !hovered ? (
          <span className="text-[hsl(var(--muted-foreground))] text-sm font-medium w-6 text-center">
            {index !== undefined ? index + 1 : ''}
          </span>
        ) : (
          <div className="relative">
            <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
            {hovered && (
              <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                <Icon name="Play" size={16} className="text-white fill-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {!showIndex && (
        <img src={track.cover} alt={track.title} className={`w-10 h-10 rounded-lg object-cover flex-shrink-0 ${showIndex ? 'hidden' : ''}`} />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
          {track.title}
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{track.artist}</p>
      </div>

      <span className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:block px-2 py-0.5 rounded-full bg-white/5">
        {track.genre}
      </span>

      <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] text-xs hidden md:flex">
        <Icon name="Play" size={12} />
        <span>{formatPlays(track.plays)}</span>
      </div>

      <button
        onClick={e => { e.stopPropagation(); setLiked(!liked); }}
        className={`transition-colors ${liked ? 'text-pink-500' : 'text-[hsl(var(--muted-foreground))] hover:text-pink-400'}`}
      >
        <Icon name="Heart" size={16} />
      </button>

      <span className="text-xs text-[hsl(var(--muted-foreground))] w-10 text-right">{track.duration}</span>

      <button className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
        <Icon name="MoreHorizontal" size={18} />
      </button>
    </div>
  );
}
