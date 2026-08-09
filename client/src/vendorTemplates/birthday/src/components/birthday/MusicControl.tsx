import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Discreet floating music toggle. Never force-plays: if the browser blocks
 * playback we simply stay muted until the guest taps the control.
 */
export function MusicControl({ src }: { src?: string | undefined }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.35;
  }, []);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el || !src) {
      setPlaying((p) => !p);
      return;
    }
    try {
      if (playing) {
        el.pause();
        setPlaying(false);
      } else {
        await el.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      {src && <audio ref={audioRef} src={src} loop preload="none" />}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        aria-pressed={playing}
        className="glass-card fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:bottom-7 sm:right-7"
      >
        {playing ? (
          <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
        ) : (
          <VolumeX className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
        {playing && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 0 0 color-mix(in oklab, var(--gold) 55%, transparent)",
              animation: "twinkle 2.4s ease-in-out infinite",
            }}
          />
        )}
      </button>
    </>
  );
}
