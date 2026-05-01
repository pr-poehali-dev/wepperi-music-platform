export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  cover: string;
  plays: number;
  liked: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  tracksCount: number;
  author: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'upload';
  user: string;
  text: string;
  time: string;
  read: boolean;
  avatar: string;
}

export interface FeedItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  track?: Track;
  playlist?: Playlist;
  time: string;
}

export const GENRES = ['Все', 'Pop', 'Hip-Hop', 'Electronic', 'Rock', 'Jazz', 'R&B', 'Classical', 'Lo-Fi'];

export const MOCK_TRACKS: Track[] = [
  { id: '1', title: 'Neon Nights', artist: 'Synthwave Hero', genre: 'Electronic', duration: '3:42', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', plays: 145200, liked: true },
  { id: '2', title: 'Purple Rain', artist: 'Alex Monroe', genre: 'Pop', duration: '4:15', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', plays: 98400, liked: false },
  { id: '3', title: 'Street Dreams', artist: 'MC Flow', genre: 'Hip-Hop', duration: '3:28', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', plays: 234100, liked: true },
  { id: '4', title: 'Midnight Jazz', artist: 'Cleo Santos', genre: 'Jazz', duration: '5:10', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop', plays: 67800, liked: false },
  { id: '5', title: 'Bass Drop', artist: 'DJ Voltage', genre: 'Electronic', duration: '4:55', cover: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop', plays: 312000, liked: true },
  { id: '6', title: 'Golden Hour', artist: 'The Dreamers', genre: 'Pop', duration: '3:58', cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=300&h=300&fit=crop', plays: 187600, liked: false },
  { id: '7', title: 'Electric Soul', artist: 'Nova Beats', genre: 'R&B', duration: '4:22', cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', plays: 92300, liked: true },
  { id: '8', title: 'Gravity', artist: 'Rock Brigade', genre: 'Rock', duration: '4:01', cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop', plays: 156700, liked: false },
  { id: '9', title: 'Lo-Fi Study', artist: 'Chill Vibes', genre: 'Lo-Fi', duration: '2:48', cover: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', plays: 445000, liked: true },
  { id: '10', title: 'Moonlight Sonata Remix', artist: 'Classical Modern', genre: 'Classical', duration: '6:30', cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop', plays: 34200, liked: false },
  { id: '11', title: 'City Lights', artist: 'Neon Fox', genre: 'Electronic', duration: '3:55', cover: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop', plays: 201400, liked: false },
  { id: '12', title: 'Vibe Check', artist: 'MC Flow', genre: 'Hip-Hop', duration: '3:12', cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop', plays: 178900, liked: true },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: '1', name: 'Вечерняя прогулка', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', tracksCount: 18, author: 'Вы' },
  { id: '2', name: 'Для работы', cover: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', tracksCount: 32, author: 'Вы' },
  { id: '3', name: 'Топ Electronic 2024', cover: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop', tracksCount: 25, author: 'DJ Voltage' },
  { id: '4', name: 'Хиты недели', cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=300&h=300&fit=crop', tracksCount: 15, author: 'Редакция' },
  { id: '5', name: 'Ночной драйв', cover: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop', tracksCount: 22, author: 'Вы' },
  { id: '6', name: 'Chill Zone', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop', tracksCount: 40, author: 'Cleo Santos' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'like', user: 'Alex Monroe', text: 'оценил ваш трек "Neon Nights"', time: '5 мин назад', read: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop' },
  { id: '2', type: 'follow', user: 'DJ Voltage', text: 'подписался на вас', time: '20 мин назад', read: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop' },
  { id: '3', type: 'comment', user: 'Cleo Santos', text: 'прокомментировал ваш трек', time: '1 час назад', read: false, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop' },
  { id: '4', type: 'upload', user: 'MC Flow', text: 'загрузил новый трек "Vibe Check"', time: '2 часа назад', read: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' },
  { id: '5', type: 'like', user: 'Nova Beats', text: 'добавил ваш трек в плейлист', time: '3 часа назад', read: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' },
  { id: '6', type: 'follow', user: 'The Dreamers', text: 'подписался на вас', time: '5 часов назад', read: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop' },
];

export const MOCK_FEED: FeedItem[] = [
  { id: '1', user: 'DJ Voltage', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', action: 'загрузил новый трек', track: MOCK_TRACKS[4], time: '10 мин назад' },
  { id: '2', user: 'Alex Monroe', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop', action: 'создал плейлист', playlist: MOCK_PLAYLISTS[3], time: '30 мин назад' },
  { id: '3', user: 'Cleo Santos', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop', action: 'оценил трек', track: MOCK_TRACKS[8], time: '1 час назад' },
  { id: '4', user: 'MC Flow', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop', action: 'загрузил новый трек', track: MOCK_TRACKS[11], time: '2 часа назад' },
  { id: '5', user: 'Nova Beats', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop', action: 'загрузил новый трек', track: MOCK_TRACKS[6], time: '4 часа назад' },
];
