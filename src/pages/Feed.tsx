import Icon from '@/components/ui/icon';
import { MOCK_FEED } from '@/data/mockData';

export default function Feed() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Icon name="Radio" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Лента</h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">Активность людей, на которых вы подписаны</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_FEED.map(item => (
          <div key={item.id} className="glass rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer">
            <div className="flex items-start gap-3">
              <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-purple-500/50" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-semibold">{item.user}</span>{' '}
                  <span className="text-[hsl(var(--muted-foreground))]">{item.action}</span>
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{item.time}</p>
                {item.track && (
                  <div className="mt-3 flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                    <img src={item.track.cover} alt={item.track.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.track.title}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.track.artist} · {item.track.genre}</p>
                    </div>
                    <button className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center hover:scale-105 transition-transform">
                      <Icon name="Play" size={14} className="text-white fill-white" />
                    </button>
                  </div>
                )}
                {item.playlist && (
                  <div className="mt-3 flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                    <img src={item.playlist.cover} alt={item.playlist.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.playlist.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.playlist.tracksCount} треков</p>
                    </div>
                    <Icon name="ListMusic" size={20} className="text-purple-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
