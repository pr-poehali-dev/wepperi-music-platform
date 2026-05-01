import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MOCK_NOTIFICATIONS, Notification } from '@/data/mockData';

const ICON_MAP: Record<Notification['type'], { icon: string; color: string; bg: string }> = {
  like: { icon: 'Heart', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  follow: { icon: 'UserPlus', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  comment: { icon: 'MessageCircle', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  upload: { icon: 'Music', color: 'text-green-400', bg: 'bg-green-500/20' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center relative">
            <Icon name="Bell" size={20} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Уведомления</h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              {unreadCount > 0 ? `${unreadCount} новых` : 'Все прочитаны'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Прочитать все
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(notif => {
          const meta = ICON_MAP[notif.type];
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                notif.read ? 'hover:bg-white/5' : 'bg-white/5 border border-purple-500/20 hover:bg-white/10'
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full object-cover" />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${meta.bg}`}>
                  <Icon name={meta.icon} size={11} className={meta.color} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-semibold">{notif.user}</span>{' '}
                  <span className="text-[hsl(var(--muted-foreground))]">{notif.text}</span>
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
