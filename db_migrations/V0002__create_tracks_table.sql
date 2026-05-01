CREATE TABLE IF NOT EXISTS t_p31823890_wepperi_music_platfo.tracks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT NOT NULL DEFAULT 'Other',
  description TEXT DEFAULT '',
  duration INTEGER DEFAULT 0,
  audio_url TEXT NOT NULL,
  cover_url TEXT DEFAULT '',
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
