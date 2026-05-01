import Icon from '@/components/ui/icon';
import { Playlist } from '@/data/mockData';

interface Props {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: Props) {
  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-3">
        <img
          src={playlist.cover}
          alt={playlist.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center glow shadow-xl">
            <Icon name="Play" size={20} className="text-white fill-white" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 glass rounded-full px-2 py-0.5 text-xs text-white">
          {playlist.tracksCount} треков
        </div>
      </div>
      <p className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
        {playlist.name}
      </p>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">{playlist.author}</p>
    </div>
  );
}
