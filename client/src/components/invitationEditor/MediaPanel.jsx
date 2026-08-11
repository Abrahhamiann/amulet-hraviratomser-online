import React, { useMemo, useRef, useState } from 'react';
import { Check, FileAudio, ImagePlus, Music2, Pause, Play, Search, Trash2 } from 'lucide-react';
import { resolveTemplateImage } from '../../occasionTemplates/templateAssets.js';
import { useEditor } from './EditorContext.jsx';
import { EmptyState, Field, PanelHeader, Toggle } from './EditorControls.jsx';
import { builtInTracks, MAX_AUDIO_BYTES, MAX_CUSTOM_TRACKS } from './editorData.js';
import { ACCEPTED_AUDIO_TYPES, prepareImage, readFileAsDataUrl } from './mediaUtils.js';

export default function MediaPanel() {
  const { data, editableContent, focusEditorTarget, update } = useEditor();
  const [query, setQuery] = useState('');
  const [customTracks, setCustomTracks] = useState(() => data.musicUrl?.startsWith('data:audio/') ? [{ id: 'saved-custom', title: data.musicTitle || 'Իմ երգը', meta: 'Վերբեռնված երգ', src: data.musicUrl }] : []);
  const [playing, setPlaying] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef(null);
  const audioInput = useRef(null);
  const visibleTracks = useMemo(() => [...builtInTracks, ...customTracks].filter((track) => `${track.title} ${track.artist || ''}`.toLowerCase().includes(query.trim().toLowerCase())), [customTracks, query]);

  const setMusicEnabled = (enabled) => {
    if (!enabled) {
      audioRef.current?.pause();
      setPlaying('');
    }
    update((draft) => {
      draft.musicEnabled = enabled;
    });
  };


  const selectTrack = (track) => update((draft) => {
    draft.musicEnabled = true;
    draft.musicUrl = track.src;
    draft.musicTitle = track.artist ? `${track.artist} — ${track.title}` : track.title;
  });

  const previewTrack = (track) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing === track.id) { audio.pause(); setPlaying(''); return; }
    audio.src = track.src;
    audio.currentTime = Math.max(0, Number(data.musicStart) || 0);
    audio.play().then(() => setPlaying(track.id)).catch(() => setError('Երգը չհաջողվեց նվագարկել։'));
  };

  const uploadTrack = async (files) => {
    setError('');
    const file = files?.[0];
    if (!file) return;
    if (customTracks.length >= MAX_CUSTOM_TRACKS) { setError('Կարելի է վերբեռնել առավելագույնը 3 երգ։'); return; }
    if (!ACCEPTED_AUDIO_TYPES.has(file.type)) { setError('Օգտագործեք MP3, WAV, OGG կամ M4A երգ։'); return; }
    if (file.size > MAX_AUDIO_BYTES) { setError('Երգի առավելագույն չափը 5 MB է։'); return; }
    try {
      const track = { id: `custom-${Date.now()}`, title: file.name.replace(/\.[^.]+$/, ''), meta: `${(file.size / 1024 / 1024).toFixed(1)} MB · Ձեր երգը`, src: await readFileAsDataUrl(file) };
      setCustomTracks((items) => [...items, track].slice(0, MAX_CUSTOM_TRACKS));
      selectTrack(track);
    } catch (uploadError) {
      setError(uploadError.message || 'Երգը չհաջողվեց վերբեռնել։');
    }
  };

  const replaceTemplateImage = async (key, file) => {
    if (!file) return;
    setError('');
    try {
      const image = await prepareImage(file);
      update((draft) => {
        draft.templateImageOverrides = { ...(draft.templateImageOverrides || {}), [key]: image };
      });
    } catch (uploadError) {
      setError(uploadError.message || 'Նկարը չհաջողվեց վերբեռնել։');
    }
  };

  const focusMediaField = (event) => {
    const field = event.target.closest('[data-editor-field]')?.dataset.editorField;
    if (field) focusEditorTarget({ section: 'media', field, targetTab: 'media', scrollPreview: true });
  };

  return (
    <div className="invite-editor-panel" onFocusCapture={focusMediaField} onPointerDownCapture={focusMediaField}>
      <audio ref={audioRef} onEnded={() => setPlaying('')} />
      <PanelHeader title="Մեդիա և երաժշտություն" subtitle="Վերբեռնեք լուսանկարներ և ընտրեք ֆոնային երգ։" />

      {editableContent.images.length > 0 && <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Նկարների հերթականություն</strong><small>{editableContent.images.length}</small></div>
        <div className="invite-editor-template-image-list">
          {editableContent.images.map((item, index) => {
            const overrides = data.templateImageOverrides || {};
            const value = Object.prototype.hasOwnProperty.call(overrides, item.key) ? overrides[item.key] : item.defaultValue;
            return <article key={item.key} data-editor-field={`templateImageOverrides.${item.key}`}>
              <strong>{item.label || item.alt || `Հրավերի նկար ${index + 1}`}</strong>
              <div className="invite-editor-template-image-control">
              <label tabIndex={0} role="button" aria-label={`${value ? 'Փոխարինել' : 'Վերբեռնել'}՝ ${item.label || item.alt || `հրավերի նկար ${index + 1}`}`} onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.currentTarget.querySelector('input')?.click();
              }}>
                {value
                  ? <img src={resolveTemplateImage(value)} alt={item.alt || item.label || `Նկար ${index + 1}`} />
                  : <span className="invite-editor-template-image-empty"><ImagePlus size={24} /><b>Վերբեռնել նոր նկար</b><small>Սեղմեք՝ ջնջված նկարը փոխարինելու համար</small></span>}
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { void replaceTemplateImage(item.key, event.target.files?.[0]); event.target.value = ''; }} />
              </label>
              {value && <button type="button" onClick={() => update((draft) => { draft.templateImageOverrides = { ...(draft.templateImageOverrides || {}), [item.key]: '' }; })} aria-label={`Ջնջել՝ ${item.label || item.alt || `նկար ${index + 1}`}`}><Trash2 size={15} /></button>}
              </div>
            </article>;
          })}
        </div>
        <small className="invite-editor-hint">Նկարները ցուցադրված են հրավերի հերթականությամբ։ Սեղմեք նկարի կամ դատարկ տեղի վրա՝ այն անմիջապես փոխարինելու համար։</small>
      </section>}

      <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Երաժշտություն</strong><Toggle checked={data.musicEnabled !== false} onChange={setMusicEnabled} label={`Երաժշտություն՝ ${data.musicEnabled !== false ? 'միացված' : 'անջատված'}`} /></div>
        <Field label="Որոնել երաժշտություն"><div className="invite-editor-search"><Search size={15} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Գրել երգի կամ կատարողի անունը..." /></div></Field>
        <div className="invite-editor-track-list">
          {visibleTracks.map((track) => {
            const selected = data.musicUrl === track.src;
            return <article key={track.id} className={selected ? 'is-selected' : ''}><button type="button" onClick={() => selectTrack(track)} aria-pressed={selected}><span>{selected ? <Check size={13} /> : <Music2 size={13} />}</span><span><strong>{track.artist ? `${track.artist} — ${track.title}` : track.title}</strong><small>{track.meta}</small></span></button><button type="button" onClick={() => previewTrack(track)} aria-label={`${playing === track.id ? 'Դադարեցնել' : 'Լսել'} ${track.title}`}>{playing === track.id ? <Pause size={14} /> : <Play size={14} />}</button>{track.id.startsWith('custom-') || track.id === 'saved-custom' ? <button type="button" className="is-danger" onClick={() => { setCustomTracks((items) => items.filter((item) => item.id !== track.id)); if (data.musicUrl === track.src) update((draft) => { draft.musicUrl = ''; draft.musicTitle = ''; }); }} aria-label={`Ջնջել ${track.title}`}><Trash2 size={13} /></button> : null}</article>;
          })}
          {!visibleTracks.length && <EmptyState title="Երգ չի գտնվել" text="Փորձեք այլ անուն կամ վերբեռնեք Ձեր երգը։" />}
        </div>
        <div className="invite-editor-upload-heading"><span>Ձեր վերբեռնումները</span><b>{customTracks.length}/{MAX_CUSTOM_TRACKS} երգ</b></div>
        <button type="button" className="invite-editor-audio-upload" disabled={customTracks.length >= MAX_CUSTOM_TRACKS} onClick={() => audioInput.current?.click()}><FileAudio size={19} /><span><strong>Վերբեռնել երգ</strong><small>MP3, WAV, OGG կամ M4A · մինչև 5 MB</small></span></button>
        <input ref={audioInput} type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,.m4a" hidden onChange={(event) => { void uploadTrack(event.target.files); event.target.value = ''; }} />
      </section>
      {error && <p className="invite-editor-error" role="alert">{error}</p>}
    </div>
  );
}
