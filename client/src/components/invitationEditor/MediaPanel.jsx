import React, { useMemo, useRef, useState } from 'react';
import { Check, FileAudio, Image as ImageIcon, ImagePlus, Music2, Pause, Play, Search, Trash2, Upload } from 'lucide-react';
import { resolveTemplateImage } from '../../occasionTemplates/templateAssets.js';
import { useEditor } from './EditorContext.jsx';
import { EmptyState, Field, PanelHeader, Toggle } from './EditorControls.jsx';
import { builtInTracks, MAX_AUDIO_BYTES, MAX_CUSTOM_TRACKS, MAX_GALLERY_IMAGES } from './editorData.js';
import { ACCEPTED_AUDIO_TYPES, prepareImage, readFileAsDataUrl } from './mediaUtils.js';

export default function MediaPanel({ isSingleImageTemplate }) {
  const { data, editableContent, update } = useEditor();
  const [query, setQuery] = useState('');
  const [customTracks, setCustomTracks] = useState(() => data.musicUrl?.startsWith('data:audio/') ? [{ id: 'saved-custom', title: data.musicTitle || 'Իմ երգը', meta: 'Վերբեռնված երգ', src: data.musicUrl }] : []);
  const [playing, setPlaying] = useState('');
  const [error, setError] = useState('');
  const [imageProgress, setImageProgress] = useState(null);
  const audioRef = useRef(null);
  const heroInput = useRef(null);
  const galleryInput = useRef(null);
  const audioInput = useRef(null);
  const gallery = data.gallery || [];
  const orderedGallery = useMemo(
    () => [data.image, ...gallery].filter((image, index, images) => image && images.indexOf(image) === index),
    [data.image, gallery]
  );
  const visibleTracks = useMemo(() => [...builtInTracks, ...customTracks].filter((track) => `${track.title} ${track.artist || ''}`.toLowerCase().includes(query.trim().toLowerCase())), [customTracks, query]);


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

  const addImages = async (files, heroOnly = false) => {
    setError('');
    const source = Array.from(files || []);
    if (!source.length) return;
    const room = heroOnly || isSingleImageTemplate ? 1 : MAX_GALLERY_IMAGES - orderedGallery.length;
    if (room <= 0) { setError(`Կարելի է ավելացնել առավելագույնը ${MAX_GALLERY_IMAGES} նկար։`); return; }
    try {
      const list = source.slice(0, room);
      const images = [];
      for (let index = 0; index < list.length; index += 1) {
        images.push(await prepareImage(list[index]));
        setImageProgress(Math.round(((index + 1) / list.length) * 100));
      }
      update((draft) => {
        if (heroOnly || isSingleImageTemplate) {
          draft.image = images[0];
          draft.gallery = isSingleImageTemplate ? [images[0]] : [images[0], ...draft.gallery.filter((image) => image !== images[0])].slice(0, MAX_GALLERY_IMAGES);
        } else {
          draft.gallery = [...draft.gallery, ...images].filter((image, index, all) => all.indexOf(image) === index).slice(0, MAX_GALLERY_IMAGES);
          if (!draft.image) draft.image = images[0];
        }
      });
    } catch (uploadError) {
      setError(uploadError.message || 'Նկարները չհաջողվեց վերբեռնել։');
    } finally {
      setImageProgress(null);
    }
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

  return (
    <div className="invite-editor-panel">
      <audio ref={audioRef} onEnded={() => setPlaying('')} />
      <PanelHeader title="Մեդիա և երաժշտություն" subtitle="Վերբեռնեք լուսանկարներ և ընտրեք ֆոնային երգ։" />

      <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Հիմնական նկար</strong><small>{orderedGallery.length}/{isSingleImageTemplate ? 1 : MAX_GALLERY_IMAGES}</small></div>
        <button type="button" className="invite-editor-main-image" onClick={() => heroInput.current?.click()}>
          {data.image ? <img src={resolveTemplateImage(data.image)} alt="Ընտրված գլխավոր նկար" /> : <ImageIcon size={30} />}
          <span><Upload size={16} /> Փոխարինել նկարը</span>
        </button>
        <input ref={heroInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { void addImages(event.target.files, true); event.target.value = ''; }} />
      </section>

      {!isSingleImageTemplate && <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Նկարների հերթականություն</strong><small>{orderedGallery.length}/{MAX_GALLERY_IMAGES}</small></div>
        <div className="invite-editor-gallery-grid">
          {orderedGallery.map((image, index) => <article key={`${String(image).slice(0, 35)}-${index}`} data-editor-field={`gallery.${index}`} className={data.image === image ? 'is-selected' : ''}><button type="button" onClick={() => update((draft) => { draft.image = image; })}><img src={resolveTemplateImage(image)} alt={`Նկար ${index + 1}`} /><span>{index + 1}</span></button><button type="button" onClick={() => update((draft) => { const nextImages = [draft.image, ...draft.gallery].filter((item, itemIndex, items) => item && item !== image && items.indexOf(item) === itemIndex); draft.gallery = nextImages; if (draft.image === image) draft.image = nextImages[0] || ''; })} aria-label={`Ջնջել նկար ${index + 1}`}><Trash2 size={13} /></button></article>)}
          {orderedGallery.length < MAX_GALLERY_IMAGES && <button type="button" className="invite-editor-gallery-add" onClick={() => galleryInput.current?.click()}><ImagePlus size={21} /><span>Ավելացնել</span></button>}
        </div>
        <input ref={galleryInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(event) => { void addImages(event.target.files); event.target.value = ''; }} />
        {imageProgress !== null && <div className="invite-editor-progress"><i style={{ width: `${imageProgress}%` }} /></div>}
        <small className="invite-editor-hint">JPG, PNG կամ WEBP · մինչև 5 MB · հնարավոր է միանգամից ընտրել մի քանի նկար</small>
      </section>}

      {editableContent.images.length > 0 && <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Շաբլոնի բոլոր նկարները</strong><small>{editableContent.images.length}</small></div>
        <div className="invite-editor-gallery-grid">
          {editableContent.images.map((item, index) => {
            const overrides = data.templateImageOverrides || {};
            const value = Object.prototype.hasOwnProperty.call(overrides, item.key) ? overrides[item.key] : item.defaultValue;
            return <article key={item.key} data-editor-field={`templateImageOverrides.${item.key}`}>
              <label>
                {value ? <img src={resolveTemplateImage(value)} alt={item.alt || `Նկար ${index + 1}`} /> : <span><ImageIcon size={20} /></span>}
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { void replaceTemplateImage(item.key, event.target.files?.[0]); event.target.value = ''; }} />
              </label>
              <button type="button" onClick={() => update((draft) => { draft.templateImageOverrides = { ...(draft.templateImageOverrides || {}), [item.key]: '' }; })} aria-label={`Ջնջել նկար ${index + 1}`}><Trash2 size={13} /></button>
            </article>;
          })}
        </div>
        <small className="invite-editor-hint">Սեղմեք նկարի վրա՝ այն փոխարինելու համար։ Ջնջված նկարը դատարկ կմնա։</small>
      </section>}

      <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Երաժշտություն</strong><Toggle checked={data.musicEnabled !== false} onChange={(value) => update((draft) => { draft.musicEnabled = value; })} label="Երաժշտություն" /></div>
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
