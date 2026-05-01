import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GENRES } from '@/data/mockData';

export default function Upload() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', genre: 'Pop', description: '' });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Icon name="Upload" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Загрузить трек</h1>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">Поделитесь своей музыкой с миром</p>
        </div>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); setUploaded(true); }}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer mb-6 ${
          dragging
            ? 'border-purple-500 bg-purple-500/10'
            : uploaded
            ? 'border-green-500 bg-green-500/10'
            : 'border-[hsl(var(--border))] hover:border-purple-500/50 hover:bg-white/5'
        }`}
      >
        {uploaded ? (
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Icon name="CheckCircle" size={32} className="text-green-400" />
            </div>
            <p className="text-white font-semibold">Файл загружен!</p>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">my_track.mp3 · 4.2 MB</p>
            <button onClick={() => setUploaded(false)} className="text-purple-400 text-sm hover:text-purple-300">
              Заменить файл
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full gradient-bg-2 flex items-center justify-center mx-auto opacity-80">
              <Icon name="Music" size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Перетащите файл сюда</p>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">или нажмите для выбора</p>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">MP3, WAV, FLAC · до 50 МБ</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Название трека *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Введите название..."
              className="w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl px-4 py-2.5 text-sm border border-[hsl(var(--border))] focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Исполнитель *</label>
            <input
              type="text"
              value={form.artist}
              onChange={e => setForm({ ...form, artist: e.target.value })}
              placeholder="Имя артиста..."
              className="w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl px-4 py-2.5 text-sm border border-[hsl(var(--border))] focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Жанр</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.filter(g => g !== 'Все').map(genre => (
              <button
                key={genre}
                onClick={() => setForm({ ...form, genre })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  form.genre === genre
                    ? 'gradient-bg text-white'
                    : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Обложка</label>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-[hsl(var(--secondary))] border-2 border-dashed border-[hsl(var(--border))] flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
              <Icon name="ImagePlus" size={20} className="text-[hsl(var(--muted-foreground))]" />
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              <p>JPG, PNG · до 5 МБ</p>
              <p>Рекомендуется 1:1</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Описание</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Расскажите о треке..."
            rows={3}
            className="w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl px-4 py-2.5 text-sm border border-[hsl(var(--border))] focus:border-purple-500 focus:outline-none transition-colors resize-none"
          />
        </div>

        <button
          disabled={!form.title || !form.artist}
          className="w-full gradient-bg text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow"
        >
          <Icon name="Upload" size={18} />
          Опубликовать трек
        </button>
      </div>
    </div>
  );
}
