import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { MusicIcon, PauseIcon } from "./icons";

/**
 * Floating music control. Generates a soft, slow ambient chord pad with the
 * Web Audio API (no external asset, never autoplays). Set `src` on the
 * component to use a custom track instead.
 */
export function MusicButton({ src }: { src?: string }) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gain: GainNode; oscs: OscillatorNode[] } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      nodesRef.current?.oscs.forEach((o) => o.stop());
      void ctxRef.current?.close();
    },
    [],
  );

  const startPad = () => {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 3);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1100;
    filter.connect(master);
    master.connect(ctx.destination);

    // Soft major-9th pad — calm, spiritual
    const freqs = [130.81, 196, 261.63, 329.63, 392];
    const oscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;

      const g = ctx.createGain();
      g.gain.value = 0.16 / (i + 1);

      // gentle breathing motion
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.013;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.06 / (i + 1);
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();

      osc.connect(g).connect(filter);
      osc.start();
      return osc;
    });

    nodesRef.current = { gain: master, oscs };
  };

  const stopPad = () => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;
    nodes.gain.gain.cancelScheduledValues(ctx.currentTime);
    nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, ctx.currentTime);
    nodes.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    window.setTimeout(() => {
      nodes.oscs.forEach((o) => o.stop());
      void ctx.close();
      ctxRef.current = null;
      nodesRef.current = null;
    }, 1400);
  };

  const toggle = () => {
    if (src) {
      const el = audioRef.current;
      if (!el) return;
      if (playing) el.pause();
      else void el.play();
      setPlaying(!playing);
      return;
    }
    if (playing) stopPad();
    else startPad();
    setPlaying(!playing);
  };

  return (
    <>
      {src ? <audio ref={audioRef} src={src} loop preload="none" /> : null}
      <motion.button
        type="button"
        onClick={toggle}
        aria-label="Երաժշտություն"
        title="Երաժշտություն"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.8 }}
        className="glass-card fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-gold transition-all duration-500 hover:shadow-halo sm:right-6 sm:bottom-6 sm:h-14 sm:w-14"
      >
        {playing ? (
          <span className="absolute inset-0 rounded-full border border-gold/40 animate-halo" aria-hidden />
        ) : null}
        <motion.span
          className="relative h-5 w-5 sm:h-6 sm:w-6"
          animate={playing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: "easeInOut" }}
        >
          {playing ? <PauseIcon /> : <MusicIcon />}
        </motion.span>
      </motion.button>
    </>
  );
}
