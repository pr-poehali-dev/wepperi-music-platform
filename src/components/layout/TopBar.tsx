import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function TopBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-16 flex items-center px-6 gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md sticky top-0 z-10">
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск треков, исполнителей, жанров, плейлистов..."
            className="w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-full pl-10 pr-4 py-2.5 text-sm border border-transparent focus:border-purple-500 focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-white"
            >
              <Icon name="X" size={15} />
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[hsl(var(--secondary))] transition-colors"
        >
          <Icon name="Bell" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-purple-500 hover:border-pink-500 transition-colors"
        >
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
