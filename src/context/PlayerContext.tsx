import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

export interface PlayerTrack {
  id: number | string;
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url?: string;
  duration?: number;
}

interface PlayerContextValue {
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  duration: number;
  play: (track: PlayerTrack) => void;
  togglePlay: () => void;
  seek: (pct: number) => void;
  setVolume: (v: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const play = useCallback((track: PlayerTrack) => {
    const audio = audioRef.current;
    if (currentTrack?.id === track.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
      return;
    }
    audio.pause();
    audio.src = track.audio_url;
    audio.volume = volume / 100;
    audio.ontimeupdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  }, [currentTrack, isPlaying, volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play(); setIsPlaying(true); }
  }, [currentTrack, isPlaying]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
      setProgress(pct);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    audioRef.current.volume = v / 100;
    setVolumeState(v);
  }, []);

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, progress, volume, duration, play, togglePlay, seek, setVolume, audioRef }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider');
  return ctx;
}
