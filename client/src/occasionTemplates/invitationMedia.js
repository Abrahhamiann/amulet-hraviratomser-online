import { useEffect, useRef, useState } from 'react';

export const hasCustomInvitationNameStyle = (draft = {}) => {
  const names = draft.textStyles?.names || {};
  return Number(names.fontSize) > 0
    || (names.fontFamily && names.fontFamily !== 'inherit')
    || Boolean(names.color)
    || Number(names.letterSpacing) !== 0
    || Number(names.fontWeight || 400) !== 400
    || names.align === 'left'
    || names.align === 'right'
    || names.italic === true
    || names.uppercase === true;
};

const radiusValues = { square: 0, xs: 4, sm: 8, md: 12, lg: 20, pill: 999 };

const buttonStyles = {
  '01': ['#181716', '#ffffff', '#181716'],
  '02': ['#d8b98e', '#241f19', '#d8b98e'],
  '03': ['transparent', '#181716', '#181716'],
  '04': ['transparent', '#d8b98e', '#d8b98e'],
  '05': ['#f5e9d8', '#31291f', '#f5e9d8'],
  '06': ['#ffffff', '#181716', '#e8e5df'],
  '07': ['transparent', '#ffffff', 'rgba(255,255,255,.75)'],
  '08': ['transparent', '#181716', 'transparent'],
  '09': ['#f3f2ef', '#59544e', '#e4e1dc'],
  '10': ['#4d4038', '#ffffff', '#4d4038'],
  '11': ['transparent', '#181716', '#d8b98e'],
  '12': ['#181716', '#ffffff', '#181716']
};

export const getInvitationDesignVariables = (draft = {}) => {
  const names = draft.textStyles?.names || {};
  const preset = draft.buttonDesign?.preset || '01';
  const [buttonBackground, buttonColor, buttonBorder] = buttonStyles[preset] || buttonStyles['01'];
  return {
    '--invitation-name-font': names.fontFamily || 'inherit',
    '--invitation-name-size': Number(names.fontSize) > 0 ? `${Math.min(120, Number(names.fontSize))}px` : 'inherit',
    '--invitation-name-weight': names.fontWeight || 400,
    '--invitation-name-color': names.color || 'inherit',
    '--invitation-name-line-height': names.lineHeight || 1.05,
    '--invitation-name-letter-spacing': `${Number(names.letterSpacing) || 0}px`,
    '--invitation-name-align': names.align || 'center',
    '--invitation-name-style': names.italic ? 'italic' : 'normal',
    '--invitation-name-transform': names.uppercase ? 'uppercase' : 'none',
    '--invitation-button-background': buttonBackground,
    '--invitation-button-color': buttonColor,
    '--invitation-button-border': buttonBorder,
    '--invitation-button-radius': `${radiusValues[draft.buttonDesign?.radius] ?? 999}px`
  };
};

export const useInvitationMusic = (draft, fallbackSource, volume = .68) => {
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const source = draft?.musicEnabled === false ? '' : (draft?.musicUrl || fallbackSource);
  const start = Math.max(0, Number(draft?.musicStart) || 0);
  const requestedEnd = Math.max(0, Number(draft?.musicEnd) || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const segmentEnd = () => requestedEnd > start ? Math.min(requestedEnd, audio.duration || requestedEnd) : (audio.duration || 0);
    const resetToStart = () => {
      if (Number.isFinite(audio.duration) && start < audio.duration) audio.currentTime = start;
    };
    const handleTimeUpdate = () => {
      const end = segmentEnd();
      if (end > start && audio.currentTime >= end) {
        audio.currentTime = start;
        if (!audio.paused) audio.play().catch(() => setIsMusicPlaying(false));
      }
    };
    const handlePause = () => setIsMusicPlaying(false);
    const handlePlay = () => setIsMusicPlaying(true);
    audio.addEventListener('loadedmetadata', resetToStart);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    return () => {
      audio.removeEventListener('loadedmetadata', resetToStart);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, [requestedEnd, source, start]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const playMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !source) return false;
    const end = requestedEnd > start ? requestedEnd : (audio.duration || Infinity);
    if (!Number.isFinite(audio.currentTime) || audio.currentTime < start || audio.currentTime >= end) audio.currentTime = start;
    try {
      audio.volume = volume;
      await audio.play();
      setIsMusicPlaying(true);
      return true;
    } catch {
      setIsMusicPlaying(false);
      return false;
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !source) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    await playMusic();
  };

  return { audioRef, isMusicPlaying, playMusic, source, toggleMusic };
};
