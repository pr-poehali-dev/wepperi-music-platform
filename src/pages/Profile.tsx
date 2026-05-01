import { useState } from 'react';
import Icon from '@/components/ui/icon';
import TrackCard from '@/components/music/TrackCard';
import { MOCK_TRACKS } from '@/data/mockData';
import { AuthUser } from '@/App';

const TABS = ['Треки', 'Плейлисты', 'Подписки'];

function getInitials(name: string) {
  return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
}

interface Props { user: AuthUser; }

export default function Profile({ user }: Props) {
  const [activeTab, setActiveTab] = useState('Треки');
  const myTracks = MOCK_TRACKS.slice(0, 4);

  return (
    <div className="pb-6">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-70" />
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <button className="absolute top-4 right-4 glass rounded-lg px-3 py-1.5 text-white text-sm flex items-center gap-2 hover:bg-white/20 transition-colors">
          <Icon name="Edit3" size={14} />
          Редактировать
        </button>
      </div>

      <div className="px-6">
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl gradient-bg border-4 border-[hsl(var(--background))] flex items-center justify-center text-white text-3xl font-black">
              {getInitials(user.name)}
            </div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-[hsl(var(--background))]" />
          </div>
          <div className="flex gap-2 mb-2">
            <button className="glass rounded-lg px-4 py-2 text-white text-sm flex items-center gap-2 hover:bg-white/20 transition-colors">
              <Icon name="Share2" size={14} />
              Поделиться
            </button>
            <button className="gradient-bg rounded-lg px-4 py-2 text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity glow">
              <Icon name="UserCheck" size={14} />
              Мой профиль
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-white mb-0.5">{user.name}</h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm mb-3">{user.email}</p>
          <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-lg">
            Музыкант и продюсер. Создаю электронную музыку и поп-треки. Слушай, делись, вдохновляйся.
          </p>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="text-white font-bold text-xl">24</p>
              <p className="text-[hsl(var(--muted-foreground))] text-xs">Треков</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">1.2K</p>
              <p className="text-[hsl(var(--muted-foreground))] text-xs">Подписчиков</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">340</p>
              <p className="text-[hsl(var(--muted-foreground))] text-xs">Подписок</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl gradient-text">98K</p>
              <p className="text-[hsl(var(--muted-foreground))] text-xs">Прослушиваний</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-[hsl(var(--secondary))] rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'gradient-bg text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Треки' && (
          <div className="space-y-1">
            {myTracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} showIndex />
            ))}
          </div>
        )}

        {activeTab === 'Плейлисты' && (
          <div className="text-center py-12">
            <Icon name="ListMusic" size={48} className="text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
            <p className="text-white font-semibold">Плейлисты появятся здесь</p>
          </div>
        )}

        {activeTab === 'Подписки' && (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
            <p className="text-white font-semibold">Подписки появятся здесь</p>
          </div>
        )}
      </div>
    </div>
  );
}