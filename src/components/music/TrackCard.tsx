import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Track } from '@/data/mockData';
import { usePlayer, PlayerTrack } from '@/context/PlayerContext';

interface Props {
  track: Track | PlayerTrack;
  index?: number;
  showIndex?: boolean;
}

function formatPlays(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

function formatDuration(val: string | number | undefined) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  const m = Math.floor(val / 60);
  const s = val % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getCover(track: Track | PlayerTrack) {
  if ('cover' in track) return track.cover;
  return (track as PlayerTrack).cover_url || '';
}

function getAudioUrl(track: Track | PlayerTrack): string {
  if ('audio_url' in track) return track.audio_url;
  return '';
}

export default function TrackCard({ track, index, showIndex }: Props) {
  const [liked, setLiked] = useState('liked' in track ? track.liked : false);
  const [hovered, setHovered] = useState(false);
  const { play, currentTrack, isPlaying } = usePlayer();

  const cover = getCover(track);
  const audioUrl = getAudioUrl(track);
  const isActive = currentTrack?.id === track.id;
  const plays = 'plays' in track ? (track.plays as number) : 0;

  const handlePlay = () => {
    if (!audioUrl) return;
    play({ id: track.id, title: track.title, artist: track.artist, genre: track.genre, audio_url: audioUrl, cover_url: cover });
  };

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${isActive ? 'bg-purple-500/10 border border-purple-500/20' : 'hover:bg-white/5'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlay}
    >
      <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {showIndex && !hovered && !isActive ? (
          <span className="text-[hsl(var(--muted-foreground))] text-sm font-medium w-6 text-center">
            {index !== undefined ? index + 1 : ''}
          </span>
        ) : (
          <div className="relative">
            {cover ? (
              <img src={cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <Icon name="Music2" size={14} className="text-white" />
              </div>
            )}
            {(hovered || isActive) && (
              <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                <Icon name={isActive && isPlaying ? 'Pause' : 'Play'} size={16} className="text-white fill-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {!showIndex && (
        cover
          ? <img src={cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          : <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0"><Icon name="Music2" size={14} className="text-white" /></div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-purple-300' : 'text-white group-hover:text-purple-300'}`}>
          {track.title}
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{track.artist}</p>
      </div>

      <span className="text-xs text-[hsl(var(--muted-foreground))] hidden sm:block px-2 py-0.5 rounded-full bg-white/5">
        {track.genre}
      </span>

      {plays > 0 && (
        <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] text-xs hidden md:flex">
          <Icon name="Play" size={12} />
          <span>{formatPlays(plays)}</span>
        </div>
      )}

      <button
        onClick={e => { e.stopPropagation(); setLiked(!liked); }}
        className={`transition-colors ${liked ? 'text-pink-500' : 'text-[hsl(var(--muted-foreground))] hover:text-pink-400'}`}
      >
        <Icon name="Heart" size={16} />
      </button>

      <span className="text-xs text-[hsl(var(--muted-foreground))] w-10 text-right">
        {formatDuration(('duration' in track ? track.duration : undefined) as string | number | undefined)}
      </span>

      <button
        onClick={e => e.stopPropagation()}
        className="text-[hsl(var(--muted-foreground))] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        <Icon name="MoreHorizontal" size={18} />
      </button>
    </div>
  );
}
