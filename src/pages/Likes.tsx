import { useState } from 'react';
import Icon from '@/components/ui/icon';
import TrackCard from '@/components/music/TrackCard';
import { MOCK_TRACKS } from '@/data/mockData';

export default function Likes() {
  const [search, setSearch] = useState('');
  const likedTracks = MOCK_TRACKS.filter(t => t.liked);

  const filtered = likedTracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-pink">
          <Icon name="Heart" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Мне нравится</h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">{likedTracks.length} треков</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden mb-6 p-4 flex items-center gap-6">
        <button className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center glow hover:scale-105 transition-transform">
          <Icon name="Play" size={22} className="text-white fill-white" />
        </button>
        <div>
          <p className="text-white font-semibold">Играть все понравившиеся</p>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">
            {likedTracks.reduce((acc, t) => {
              const [m, s] = t.duration.split(':').map(Number);
              return acc + m * 60 + s;
            }, 0) > 60
              ? `${Math.floor(likedTracks.reduce((acc, t) => { const [m] = t.duration.split(':').map(Number); return acc + m; }, 0) / 60)} ч ${likedTracks.reduce((acc, t) => { const [m] = t.duration.split(':').map(Number); return acc + m; }, 0) % 60} мин`
              : ''
            }
          </p>
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors">
            <Icon name="Shuffle" size={16} />
            Случайный порядок
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск в понравившихся..."
          className="w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl pl-9 pr-4 py-2.5 text-sm border border-[hsl(var(--border))] focus:border-purple-500 focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-1">
        {filtered.length > 0 ? (
          filtered.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} showIndex />
          ))
        ) : (
          <div className="text-center py-12">
            <Icon name="HeartOff" size={48} className="text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
            <p className="text-white font-semibold">Ничего не найдено</p>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">Попробуйте другой запрос</p>
          </div>
        )}
      </div>
    </div>
  );
}
