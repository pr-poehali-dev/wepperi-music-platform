import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { AuthUser } from '@/App';

const NAV_ITEMS = [
  { to: '/', icon: 'Home', label: 'Главная' },
  { to: '/feed', icon: 'Radio', label: 'Лента' },
  { to: '/upload', icon: 'Upload', label: 'Загрузка' },
  { to: '/playlists', icon: 'ListMusic', label: 'Плейлисты' },
  { to: '/likes', icon: 'Heart', label: 'Мне нравится' },
  { to: '/notifications', icon: 'Bell', label: 'Уведомления' },
  { to: '/profile', icon: 'User', label: 'Профиль' },
];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

interface Props {
  user: AuthUser;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: Props) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-[hsl(var(--sidebar-border))]">
        {!collapsed && (
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center glow">
              <Icon name="Music2" size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Wavely</span>
          </button>
        )}
        {collapsed && (
          <button onClick={() => navigate('/')} className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center glow mx-auto">
            <Icon name="Music2" size={16} className="text-white" />
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[hsl(var(--sidebar-foreground))] hover:text-white transition-colors ml-auto"
        >
          <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'gradient-bg text-white font-semibold glow'
                  : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white'
              }`
            }
          >
            <Icon name={item.icon} size={20} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 py-4 border-t border-[hsl(var(--sidebar-border))]">
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 border-2 border-purple-500 text-white text-xs font-bold">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              title="Выйти"
              className="text-[hsl(var(--muted-foreground))] hover:text-red-400 transition-colors flex-shrink-0"
            >
              <Icon name="LogOut" size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}