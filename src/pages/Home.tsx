import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import TrackCard from '@/components/music/TrackCard';
import PlaylistCard from '@/components/music/PlaylistCard';
import { MOCK_TRACKS, MOCK_PLAYLISTS, GENRES } from '@/data/mockData';
import { usePlayer } from '@/context/PlayerContext';

const GET_TRACKS_URL = 'https://functions.poehali.dev/c72a2262-a2d2-409b-acd9-c7cec4b486e1';

interface RealTrack {
  id: number; title: string; artist: string; genre: string;
  duration: number; audio_url: string; cover_url: string; plays: number;
}

export default function Home() {
  const [activeGenre, setActiveGenre] = useState('Все');
  const [realTracks, setRealTracks] = useState<RealTrack[]>([]);
  const { play } = usePlayer();

  useEffect(() => {
    fetch(GET_TRACKS_URL)
      .then(r => r.json())
      .then(d => { if (d.ok) setRealTracks(d.tracks); })
      .catch(() => {});
  }, []);

  const allTracks = realTracks.length > 0 ? realTracks : MOCK_TRACKS as unknown as RealTrack[];

  const filteredTracks = activeGenre === 'Все'
    ? allTracks
    : allTracks.filter(t => t.genre === activeGenre);

  const trendingTracks = [...MOCK_TRACKS].sort((a, b) => b.plays - a.plays).slice(0, 5);

  return (
    <div className="p-6 space-y-8">
      <section className="relative rounded-2xl overflow-hidden min-h-48">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${MOCK_TRACKS[4].cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative z-10 p-8 flex flex-col justify-end h-full">
          <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-widest">Трек дня</p>
          <h1 className="text-3xl font-black text-white mb-1">{MOCK_TRACKS[4].title}</h1>
          <p className="text-white/80 mb-4">{MOCK_TRACKS[4].artist}</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white text-purple-700 font-bold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors">
              <Icon name="Play" size={16} className="fill-purple-700" />
              Слушать
            </button>
            <button className="flex items-center gap-2 glass text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white/15 transition-colors">
              <Icon name="Plus" size={16} />
              В плейлист
            </button>
          </div>
        </div>
        <div className="absolute top-6 right-6 flex gap-2">
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-xs font-medium">312K прослушиваний</span>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Горячие треки</h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors flex items-center gap-1">
            Все <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {trendingTracks.map(track => (
            <div key={track.id} className="group cursor-pointer">
              <div className="relative rounded-xl overflow-hidden mb-2">
                <img src={track.cover} alt={track.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Icon name="Play" size={16} className="text-white fill-white" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-white truncate">{track.title}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Плейлисты для тебя</h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors flex items-center gap-1">
            Все <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOCK_PLAYLISTS.map(pl => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Все треки</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeGenre === genre
                    ? 'gradient-bg text-white'
                    : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {filteredTracks.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} showIndex />
          ))}
        </div>
      </section>
    </div>
  );
}