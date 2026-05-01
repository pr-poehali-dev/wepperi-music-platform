import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NAV_ITEMS = [
  { to: '/', icon: 'Home', label: 'Главная' },
  { to: '/feed', icon: 'Radio', label: 'Лента' },
  { to: '/upload', icon: 'Upload', label: 'Загрузка' },
  { to: '/playlists', icon: 'ListMusic', label: 'Плейлисты' },
  { to: '/likes', icon: 'Heart', label: 'Мне нравится' },
  { to: '/notifications', icon: 'Bell', label: 'Уведомления' },
  { to: '/profile', icon: 'User', label: 'Профиль' },
];

export default function Sidebar() {
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
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop"
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-500"
              alt="avatar"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Alex Monroe</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">@alexmonroe</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
