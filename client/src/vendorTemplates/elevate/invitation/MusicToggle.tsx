import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import type { InvitationData } from "@/data/invitation";
import { cn } from "@/lib/utils";

/** Floating, opt-in ambient music control. Never autoplays. */
export function MusicToggle({ data }: { data: InvitationData }) {
  const { music } = data;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  if (!music.enabled) return null;

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      audioRef.current.volume = 0.35;
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={music.src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Դադարեցնել երաժշտությունը" : "Միացնել երաժշտությունը"}
        aria-pressed={playing}
        className={cn(
          "glass-panel fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full text-primary transition-all duration-500 ease-[var(--ease-elegant)] hover:scale-105 sm:h-14 sm:w-14",
          playing && "border-primary/50",
        )}
      >
        {playing ? (
          <>
            <span aria-hidden className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/50" />
            <Pause className="h-4 w-4" strokeWidth={1.5} />
          </>
        ) : (
          <Music className="h-4 w-4" strokeWidth={1.5} />
        )}
      </button>
    </>
  );
}
