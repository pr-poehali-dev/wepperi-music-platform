import { useState } from 'react';
import Icon from '@/components/ui/icon';
import PlaylistCard from '@/components/music/PlaylistCard';
import { MOCK_PLAYLISTS } from '@/data/mockData';

export default function Playlists() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const myPlaylists = MOCK_PLAYLISTS.filter(p => p.author === 'Вы');
  const savedPlaylists = MOCK_PLAYLISTS.filter(p => p.author !== 'Вы');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Icon name="ListMusic" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Плейлисты</h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">{MOCK_PLAYLISTS.length} плейлистов</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-purple-600 text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-white'}`}
          >
            <Icon name="LayoutGrid" size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-purple-600 text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-white'}`}
          >
            <Icon name="List" size={18} />
          </button>
          <button className="flex items-center gap-2 gradient-bg text-white text-sm font-semibold px-4 py-2 rounded-lg ml-2 hover:opacity-90 transition-opacity">
            <Icon name="Plus" size={16} />
            Создать
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Мои плейлисты</h2>
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
          {myPlaylists.map(pl => (
            view === 'grid' ? (
              <PlaylistCard key={pl.id} playlist={pl} />
            ) : (
              <div key={pl.id} className="flex items-center gap-4 p-3 glass rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                <img src={pl.cover} alt={pl.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">{pl.name}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{pl.tracksCount} треков</p>
                </div>
                <button className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Play" size={14} className="text-white fill-white" />
                </button>
              </div>
            )
          ))}
          <button className={`${view === 'grid' ? 'aspect-square' : 'p-3 h-20'} border-2 border-dashed border-[hsl(var(--border))] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-white/5 transition-all cursor-pointer group`}>
            <Icon name="Plus" size={24} className="text-[hsl(var(--muted-foreground))] group-hover:text-purple-400 transition-colors" />
            {view === 'grid' && <span className="text-xs text-[hsl(var(--muted-foreground))] group-hover:text-purple-400 transition-colors">Новый плейлист</span>}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-4">Сохранённые плейлисты</h2>
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
          {savedPlaylists.map(pl => (
            view === 'grid' ? (
              <PlaylistCard key={pl.id} playlist={pl} />
            ) : (
              <div key={pl.id} className="flex items-center gap-4 p-3 glass rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                <img src={pl.cover} alt={pl.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">{pl.name}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{pl.tracksCount} треков · {pl.author}</p>
                </div>
                <button className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Play" size={14} className="text-white fill-white" />
                </button>
              </div>
            )
          ))}
        </div>
      </section>
    </div>
  );
}
