import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Music2 } from "lucide-react";

const TRACK = "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(TRACK);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "none";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Դադարեցնել ռոմանտիկ երաժշտությունը" : "Միացնել ռոմանտիկ երաժշտությունը"}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-card/85 text-gold backdrop-blur-md transition-transform duration-500 ease-[var(--ease-silk)] hover:scale-105 sm:bottom-8 sm:right-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {playing && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-gold/40"
          animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.span
        animate={playing ? { rotate: 360 } : { rotate: 0 }}
        transition={
          playing ? { duration: 6, repeat: Infinity, ease: "linear" } : { duration: 0.4 }
        }
      >
        <Music2 className="h-4.5 w-4.5" strokeWidth={1.3} />
      </motion.span>
    </button>
  );
}
