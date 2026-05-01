import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import TrackCard from '@/components/music/TrackCard';
import PlaylistCard from '@/components/music/PlaylistCard';
import { MOCK_TRACKS, MOCK_PLAYLISTS, GENRES } from '@/data/mockData';

const FILTER_TABS = ['Всё', 'Треки', 'Исполнители', 'Плейлисты', 'Жанры'];

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('Всё');
  const [activeGenre, setActiveGenre] = useState('');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const q = query.toLowerCase();

  const matchedTracks = MOCK_TRACKS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artist.toLowerCase().includes(q) ||
    t.genre.toLowerCase().includes(q)
  );

  const matchedPlaylists = MOCK_PLAYLISTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.author.toLowerCase().includes(q)
  );

  const matchedArtists = [...new Set(
    MOCK_TRACKS
      .filter(t => t.artist.toLowerCase().includes(q))
      .map(t => t.artist)
  )];

  const matchedGenres = GENRES.filter(g => g !== 'Все' && g.toLowerCase().includes(q));

  const hasResults = matchedTracks.length > 0 || matchedPlaylists.length > 0 || matchedArtists.length > 0;

  if (!query) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Icon name="Search" size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Поиск</h1>
        </div>

        <p className="text-[hsl(var(--muted-foreground))] mb-6">Найди треки, исполнителей, жанры и плейлисты</p>

        <h2 className="text-lg font-bold text-white mb-3">Жанры</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GENRES.filter(g => g !== 'Все').map((genre, idx) => {
            const colors = [
              'from-purple-600 to-pink-600',
              'from-blue-600 to-purple-600',
              'from-pink-600 to-orange-500',
              'from-green-600 to-teal-500',
              'from-yellow-500 to-orange-500',
              'from-red-600 to-pink-600',
              'from-indigo-600 to-blue-500',
              'from-teal-600 to-green-500',
            ];
            return (
              <button
                key={genre}
                onClick={() => { setQuery(genre); setActiveGenre(genre); }}
                className={`bg-gradient-to-br ${colors[idx % colors.length]} rounded-xl p-5 text-white font-bold text-left hover:scale-105 transition-transform`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-white">
          Результаты для <span className="gradient-text">«{query}»</span>
        </h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === tab
                ? 'gradient-bg text-white'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {!hasResults && (
        <div className="text-center py-16">
          <Icon name="SearchX" size={56} className="text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
          <p className="text-xl font-bold text-white mb-2">Ничего не найдено</p>
          <p className="text-[hsl(var(--muted-foreground))]">Попробуйте другой запрос</p>
        </div>
      )}

      {(activeFilter === 'Всё' || activeFilter === 'Треки') && matchedTracks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Треки</h2>
          <div className="space-y-1">
            {matchedTracks.slice(0, activeFilter === 'Треки' ? 50 : 5).map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} showIndex />
            ))}
          </div>
        </section>
      )}

      {(activeFilter === 'Всё' || activeFilter === 'Исполнители') && matchedArtists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Исполнители</h2>
          <div className="flex flex-wrap gap-3">
            {matchedArtists.map(artist => {
              const track = MOCK_TRACKS.find(t => t.artist === artist);
              return (
                <div key={artist} className="flex items-center gap-3 glass rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
                  <img src={track?.cover} alt={artist} className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-white font-medium">{artist}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {(activeFilter === 'Всё' || activeFilter === 'Плейлисты') && matchedPlaylists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Плейлисты</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {matchedPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </section>
      )}

      {(activeFilter === 'Всё' || activeFilter === 'Жанры') && matchedGenres.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-3">Жанры</h2>
          <div className="flex flex-wrap gap-2">
            {matchedGenres.map(genre => (
              <button
                key={genre}
                className="px-5 py-2.5 rounded-full gradient-bg text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
