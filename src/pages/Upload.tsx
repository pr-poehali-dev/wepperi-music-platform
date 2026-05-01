import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { GENRES } from '@/data/mockData';
import { AuthUser } from '@/App';

const UPLOAD_URL = 'https://functions.poehali.dev/93b306d3-d2ca-494c-9903-283f14af22a3';
const MAX_AUDIO_MB = 50;
const MAX_COVER_MB = 5;

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(audio.duration));
    };
    audio.onerror = () => resolve(0);
  });
}

interface Props {
  user?: AuthUser;
}

export default function Upload({ user }: Props) {
  const navigate = useNavigate();
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', genre: 'Pop', description: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAudioFile = (file: File) => {
    if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
      setError(`Аудио не должно превышать ${MAX_AUDIO_MB} МБ`);
      return;
    }
    setAudioFile(file);
    setError('');
    if (!form.title) {
      const name = file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
      setForm(f => ({ ...f, title: name }));
    }
  };

  const handleCoverFile = (file: File) => {
    if (file.size > MAX_COVER_MB * 1024 * 1024) {
      setError(`Обложка не должна превышать ${MAX_COVER_MB} МБ`);
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith('audio/')) handleAudioFile(file);
    else if (file.type.startsWith('image/')) handleCoverFile(file);
  };

  const handleSubmit = async () => {
    if (!audioFile || !form.title || !form.artist) {
      setError('Заполните название, исполнителя и выберите аудиофайл');
      return;
    }
    if (!user) { setError('Нужно войти в аккаунт'); return; }

    setUploading(true);
    setUploadProgress(10);
    setError('');

    try {
      const [audio_b64, duration] = await Promise.all([
        toBase64(audioFile),
        getAudioDuration(audioFile),
      ]);
      setUploadProgress(40);

      let cover_b64 = '';
      let cover_mime = '';
      if (coverFile) {
        cover_b64 = await toBase64(coverFile);
        cover_mime = coverFile.type;
      }
      setUploadProgress(60);

      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          title: form.title,
          artist: form.artist,
          genre: form.genre,
          description: form.description,
          duration,
          audio_b64,
          audio_mime: audioFile.type || 'audio/mpeg',
          cover_b64,
          cover_mime,
        }),
      });
      setUploadProgress(90);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');

      setUploadProgress(100);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-96">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
          <Icon name="CheckCircle" size={40} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Трек опубликован!</h2>
        <p className="text-[hsl(var(--muted-foreground))]">Переходим на главную...</p>
      </div>
    );
  }

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

      <input ref={audioInputRef} type="file" accept="audio/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleAudioFile(e.target.files[0])} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleCoverFile(e.target.files[0])} />

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !audioFile && audioInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 mb-6 ${
          dragging ? 'border-purple-500 bg-purple-500/10 cursor-copy'
          : audioFile ? 'border-green-500 bg-green-500/10 cursor-default'
          : 'border-[hsl(var(--border))] hover:border-purple-500/50 hover:bg-white/5 cursor-pointer'
        }`}
      >
        {audioFile ? (
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Icon name="Music" size={28} className="text-green-400" />
            </div>
            <p className="text-white font-semibold">{audioFile.name}</p>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              {(audioFile.size / 1024 / 1024).toFixed(1)} МБ
            </p>
            <button
              onClick={e => { e.stopPropagation(); setAudioFile(null); }}
              className="text-purple-400 text-sm hover:text-purple-300"
            >
              Заменить файл
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full gradient-bg-2 flex items-center justify-center mx-auto opacity-80">
              <Icon name="Music" size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Перетащите аудиофайл сюда</p>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">или нажмите для выбора</p>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">MP3, WAV, FLAC, M4A · до {MAX_AUDIO_MB} МБ</p>
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
              placeholder={user?.name || 'Имя артиста...'}
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
            <button
              onClick={() => coverInputRef.current?.click()}
              className="w-16 h-16 rounded-xl bg-[hsl(var(--secondary))] border-2 border-dashed border-[hsl(var(--border))] flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors overflow-hidden flex-shrink-0"
            >
              {coverPreview
                ? <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                : <Icon name="ImagePlus" size={20} className="text-[hsl(var(--muted-foreground))]" />
              }
            </button>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              {coverFile
                ? <><p className="text-white font-medium">{coverFile.name}</p><p>{(coverFile.size / 1024).toFixed(0)} КБ</p></>
                : <><p>JPG, PNG · до {MAX_COVER_MB} МБ</p><p>Рекомендуется 1:1</p></>
              }
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

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <Icon name="AlertCircle" size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
              <span>Загружаем файл...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[hsl(var(--border))] rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading || !audioFile || !form.title || !form.artist}
          className="w-full gradient-bg text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow"
        >
          {uploading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Публикуем...</>
            : <><Icon name="Upload" size={18} />Опубликовать трек</>
          }
        </button>
      </div>
    </div>
  );
}
