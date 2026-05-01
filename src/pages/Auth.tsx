import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/3a6dd3c1-44d7-424a-81a8-ebbd8f7e7b29';

type Mode = 'login' | 'register';

interface Props {
  onAuth: (user: { id: number; name: string; email: string }) => void;
}

export default function Auth({ onAuth }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.includes('@')) e.email = 'Введите корректный email';
    if (form.password.length < 6) e.password = 'Минимум 6 символов';
    if (mode === 'register') {
      if (!form.name.trim()) e.name = 'Введите имя';
      if (form.password !== form.confirm) e.confirm = 'Пароли не совпадают';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload =
        mode === 'register'
          ? { action: 'register', name: form.name, email: form.email, password: form.password }
          : { action: 'login', email: form.email, password: form.password };

      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = typeof res === 'object' ? await res.json() : {};

      if (!res.ok) {
        setErrors({ form: data.error || 'Ошибка сервера' });
        return;
      }

      localStorage.setItem('wavely_token', data.token);
      localStorage.setItem('wavely_user', JSON.stringify(data.user));
      onAuth(data.user);
      navigate('/');
    } catch {
      setErrors({ form: 'Не удалось подключиться к серверу' });
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex overflow-hidden">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&h=1200&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 z-10">
          <div className="w-16 h-16 rounded-2xl gradient-bg-2 flex items-center justify-center glow mb-6 shadow-2xl">
            <Icon name="Music2" size={30} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-4 text-center leading-tight">
            Wavely
          </h1>
          <p className="text-white/80 text-lg text-center max-w-xs leading-relaxed">
            Открой музыку по-новому. Слушай, загружай, делись с миром.
          </p>

          <div className="mt-12 space-y-4 w-full max-w-xs">
            {[
              { icon: 'Headphones', text: 'Миллионы треков в любом жанре' },
              { icon: 'Upload', text: 'Загружай свою музыку за секунды' },
              { icon: 'Users', text: 'Следи за любимыми артистами' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <Icon name={item.icon} size={18} className="text-white/90" />
                <span className="text-white/90 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
          />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <Icon name="Music2" size={18} className="text-white" />
            </div>
            <span className="text-2xl font-black gradient-text">Wavely</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-1">
              {mode === 'login' ? 'С возвращением!' : 'Присоединяйся'}
            </h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              {mode === 'login'
                ? 'Войди, чтобы продолжить слушать музыку'
                : 'Создай аккаунт и открой мир музыки'}
            </p>
          </div>

          <div className="flex bg-[hsl(var(--secondary))] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setErrors({}); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'login' ? 'gradient-bg text-white shadow-lg' : 'text-[hsl(var(--muted-foreground))] hover:text-white'}`}
            >
              Вход
            </button>
            <button
              onClick={() => { setMode('register'); setErrors({}); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'register' ? 'gradient-bg text-white shadow-lg' : 'text-[hsl(var(--muted-foreground))] hover:text-white'}`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Имя</label>
                <div className="relative">
                  <Icon name="User" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Твоё имя"
                    className={`w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl pl-10 pr-4 py-3 text-sm border transition-colors focus:outline-none ${errors.name ? 'border-red-500' : 'border-[hsl(var(--border))] focus:border-purple-500'}`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Email</label>
              <div className="relative">
                <Icon name="Mail" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  className={`w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl pl-10 pr-4 py-3 text-sm border transition-colors focus:outline-none ${errors.email ? 'border-red-500' : 'border-[hsl(var(--border))] focus:border-purple-500'}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Минимум 6 символов"
                  className={`w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl pl-10 pr-11 py-3 text-sm border transition-colors focus:outline-none ${errors.password ? 'border-red-500' : 'border-[hsl(var(--border))] focus:border-purple-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm text-[hsl(var(--muted-foreground))] mb-1.5">Подтвердите пароль</label>
                <div className="relative">
                  <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={set('confirm')}
                    placeholder="Повторите пароль"
                    className={`w-full bg-[hsl(var(--secondary))] text-white placeholder:text-[hsl(var(--muted-foreground))] rounded-xl pl-10 pr-4 py-3 text-sm border transition-colors focus:outline-none ${errors.confirm ? 'border-red-500' : 'border-[hsl(var(--border))] focus:border-purple-500'}`}
                  />
                </div>
                {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Забыли пароль?
                </button>
              </div>
            )}

            {errors.form && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errors.form}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all glow flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Входим...' : 'Создаём аккаунт...'}
                </>
              ) : (
                <>
                  <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={18} />
                  {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(var(--border))]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[hsl(var(--background))] px-3 text-xs text-[hsl(var(--muted-foreground))]">или продолжи через</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Google', icon: 'Globe' },
              { label: 'VK', icon: 'Users' },
            ].map(s => (
              <button
                key={s.label}
                type="button"
                className="flex items-center justify-center gap-2 bg-[hsl(var(--secondary))] hover:bg-white/10 text-white text-sm font-medium py-3 rounded-xl border border-[hsl(var(--border))] hover:border-purple-500/50 transition-all"
              >
                <Icon name={s.icon} size={16} />
                {s.label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}