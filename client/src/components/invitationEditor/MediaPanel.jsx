import React, { useMemo, useRef, useState } from 'react';
import { Check, FileAudio, ImagePlus, Music2, Pause, Play, RotateCcw, Search, Trash2 } from 'lucide-react';
import { resolveTemplateImage } from '../../occasionTemplates/templateAssets.js';
import { useEditor } from './EditorContext.jsx';
import { EmptyState, Field, PanelHeader, Toggle } from './EditorControls.jsx';
import { builtInTracks, MAX_AUDIO_BYTES, MAX_CUSTOM_TRACKS, MAX_GALLERY_IMAGES } from './editorData.js';
import { ACCEPTED_AUDIO_TYPES, prepareImage, readFileAsDataUrl } from './mediaUtils.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function MediaPanel() {
  const { data, editableContent, focusEditorTarget, update } = useEditor();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [customTracks, setCustomTracks] = useState(() => data.musicUrl?.startsWith('data:audio/') ? [{ id: 'saved-custom', title: data.musicTitle || t('editorMySong'), meta: t('editorUploadedSong'), src: data.musicUrl }] : []);
  const [playing, setPlaying] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef(null);
  const audioInput = useRef(null);
  const galleryInput = useRef(null);
  const visibleTracks = useMemo(() => [...builtInTracks, ...customTracks].filter((track) => `${track.title} ${track.artist || ''}`.toLowerCase().includes(query.trim().toLowerCase())), [customTracks, query]);
  const galleryImages = Array.isArray(data.gallery) ? data.gallery : [];
  const otherImages = useMemo(() => editableContent.images.filter((item) => item.group !== 'gallery' && !item.sourceField?.startsWith('gallery.')), [editableContent.images]);

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
    audio.play().then(() => setPlaying(track.id)).catch(() => setError(t('editorAudioPlayError')));
  };

  const uploadTrack = async (files) => {
    setError('');
    const file = files?.[0];
    if (!file) return;
    if (customTracks.length >= MAX_CUSTOM_TRACKS) { setError(t('editorMaxSongsError')); return; }
    if (!ACCEPTED_AUDIO_TYPES.has(file.type)) { setError(t('editorAudioTypeError')); return; }
    if (file.size > MAX_AUDIO_BYTES) { setError(t('editorAudioSizeError')); return; }
    try {
      const track = { id: `custom-${Date.now()}`, title: file.name.replace(/\.[^.]+$/, ''), meta: `${(file.size / 1024 / 1024).toFixed(1)} MB · ${t('editorYourSong')}`, src: await readFileAsDataUrl(file) };
      setCustomTracks((items) => [...items, track].slice(0, MAX_CUSTOM_TRACKS));
      selectTrack(track);
    } catch (uploadError) {
      setError(uploadError.message?.startsWith('media') ? t(uploadError.message) : (uploadError.message || t('editorAudioUploadError')));
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
      setError(uploadError.message?.startsWith('media') ? t(uploadError.message) : (uploadError.message || t('editorImageUploadError')));
    }
  };

  const replaceGalleryImage = async (index, file) => {
    if (!file) return;
    setError('');
    try {
      const image = await prepareImage(file);
      update((draft) => {
        draft.gallery[index] = image;
        // The first gallery item is the primary/hero image across invitation
        // adapters. Keep the legacy `image` field in sync so templates that
        // still read it update immediately instead of only after remounting.
        if (index === 0) draft.image = image;
      });
    } catch (uploadError) {
      setError(uploadError.message?.startsWith('media') ? t(uploadError.message) : (uploadError.message || t('editorImageUploadError')));
    }
  };

  const addGalleryImages = async (files) => {
    const available = Math.max(0, MAX_GALLERY_IMAGES - galleryImages.length);
    if (!files?.length || !available) return;
    setError('');
    try {
      const images = await Promise.all(Array.from(files).slice(0, available).map(prepareImage));
      update((draft) => {
        const wasEmpty = !(draft.gallery || []).length;
        draft.gallery = [...(draft.gallery || []), ...images]
          .filter((item, index, items) => item && items.indexOf(item) === index)
          .slice(0, MAX_GALLERY_IMAGES);
        if (wasEmpty && draft.gallery[0]) draft.image = draft.gallery[0];
      });
    } catch (uploadError) {
      setError(uploadError.message?.startsWith('media') ? t(uploadError.message) : (uploadError.message || t('editorImageUploadError')));
    }
  };

  const focusMediaField = (event) => {
    const field = event.target.closest('[data-editor-field]')?.dataset.editorField;
    if (field) focusEditorTarget({ section: 'media', field, targetTab: 'media', scrollPreview: true });
  };

  return (
    <div className="invite-editor-panel" onFocusCapture={focusMediaField} onPointerDownCapture={focusMediaField}>
      <audio ref={audioRef} onEnded={() => setPlaying('')} />
      <PanelHeader title={t('editorMediaMusic')} subtitle={t('editorMediaSubtitle')} />

      <section className="invite-editor-card invite-editor-gallery-card">
        <div className="invite-editor-card-title"><strong>{t('editorCarouselImages')}</strong><small>{galleryImages.length}/{MAX_GALLERY_IMAGES}</small></div>
        <p className="invite-editor-card-description">{t('editorCarouselImagesHint')}</p>
        <div className="invite-editor-template-image-list">
          {galleryImages.map((value, index) => <article key={`${value}-${index}`} data-editor-field={`gallery.${index}`}>
            <strong>{t('editorGalleryImage')} {index + 1}</strong>
            <div className="invite-editor-template-image-control">
              <label tabIndex={0} role="button" aria-label={`${t('replace')}: ${t('editorGalleryImage')} ${index + 1}`} onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.currentTarget.querySelector('input')?.click();
              }}>
                <img src={resolveTemplateImage(value)} alt={`${t('editorGalleryImage')} ${index + 1}`} />
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { void replaceGalleryImage(index, event.target.files?.[0]); event.target.value = ''; }} />
              </label>
              <button type="button" onClick={() => update((draft) => {
                draft.gallery.splice(index, 1);
                if (index === 0) draft.image = draft.gallery[0] || '';
              })} aria-label={`${t('delete')}: ${t('editorGalleryImage')} ${index + 1}`}><Trash2 size={15} /></button>
            </div>
          </article>)}
        </div>
        {galleryImages.length < MAX_GALLERY_IMAGES && <button type="button" className="invite-editor-add-gallery" onClick={() => galleryInput.current?.click()}><ImagePlus size={18} /><span><strong>{t('editorAddCarouselImages')}</strong><small>{t('editorImageRequirements')}</small></span></button>}
        <input ref={galleryInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(event) => { void addGalleryImages(event.target.files); event.target.value = ''; }} />
      </section>

      {otherImages.length > 0 && <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>{t('editorOtherImages')}</strong><small>{otherImages.length}</small></div>
        <div className="invite-editor-template-image-list">
          {otherImages.map((item, index) => {
            const overrides = data.templateImageOverrides || {};
            const overrideExists = Object.prototype.hasOwnProperty.call(overrides, item.key);
            const value = overrideExists ? overrides[item.key] : item.defaultValue;
            return <article key={item.key} data-editor-field={`templateImageOverrides.${item.key}`}>
              <strong>{item.label || item.alt || `${t('editorInvitationImage')} ${index + 1}`}</strong>
              <div className="invite-editor-template-image-control">
              <label tabIndex={0} role="button" aria-label={`${value ? t('replace') : t('upload')}: ${item.label || item.alt || `${t('editorInvitationImage')} ${index + 1}`}`} onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.currentTarget.querySelector('input')?.click();
              }}>
                {value
                  ? <img src={resolveTemplateImage(value)} alt={item.alt || item.label || `${t('image')} ${index + 1}`} />
                  : <span className="invite-editor-template-image-empty"><ImagePlus size={24} /><b>{t('editorUploadNewImage')}</b><small>{t('editorReplaceDeletedImage')}</small></span>}
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { void replaceTemplateImage(item.key, event.target.files?.[0]); event.target.value = ''; }} />
              </label>
              {overrideExists && <button type="button" onClick={() => update((draft) => {
                const nextOverrides = { ...(draft.templateImageOverrides || {}) };
                delete nextOverrides[item.key];
                draft.templateImageOverrides = nextOverrides;
              })} aria-label={`${t('editorRestore')}: ${item.label || item.alt || `${t('image')} ${index + 1}`}`}><RotateCcw size={15} /></button>}
              </div>
            </article>;
          })}
        </div>
        <small className="invite-editor-hint">{t('editorOtherImagesHint')}</small>
      </section>}

      <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>{t('music')}</strong><Toggle checked={data.musicEnabled !== false} onChange={setMusicEnabled} label={`${t('music')}: ${data.musicEnabled !== false ? t('enabled') : t('disabled')}`} /></div>
        <Field label={t('editorSearchMusic')}><div className="invite-editor-search"><Search size={15} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('editorSearchMusicPlaceholder')} /></div></Field>
        <div className="invite-editor-track-list">
          {visibleTracks.map((track) => {
            const selected = data.musicUrl === track.src;
            return <article key={track.id} className={selected ? 'is-selected' : ''}><button type="button" onClick={() => selectTrack(track)} aria-pressed={selected}><span>{selected ? <Check size={13} /> : <Music2 size={13} />}</span><span><strong>{track.artist ? `${track.artist} — ${track.title}` : track.title}</strong><small>{track.id.startsWith('custom-') || track.id === 'saved-custom' ? track.meta : t('editorAmuletSelection')}</small></span></button><button type="button" onClick={() => previewTrack(track)} aria-label={`${playing === track.id ? t('pause') : t('listen')} ${track.title}`}>{playing === track.id ? <Pause size={14} /> : <Play size={14} />}</button>{track.id.startsWith('custom-') || track.id === 'saved-custom' ? <button type="button" className="is-danger" onClick={() => { setCustomTracks((items) => items.filter((item) => item.id !== track.id)); if (data.musicUrl === track.src) update((draft) => { draft.musicUrl = ''; draft.musicTitle = ''; }); }} aria-label={`${t('delete')} ${track.title}`}><Trash2 size={13} /></button> : null}</article>;
          })}
          {!visibleTracks.length && <EmptyState title={t('editorNoSongFound')} text={t('editorTryOrUploadSong')} />}
        </div>
        <div className="invite-editor-upload-heading"><span>{t('editorYourUploads')}</span><b>{customTracks.length}/{MAX_CUSTOM_TRACKS} {t('songs')}</b></div>
        <button type="button" className="invite-editor-audio-upload" disabled={customTracks.length >= MAX_CUSTOM_TRACKS} onClick={() => audioInput.current?.click()}><FileAudio size={19} /><span><strong>{t('editorUploadSong')}</strong><small>{t('editorAudioRequirements')}</small></span></button>
        <input ref={audioInput} type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,.m4a" hidden onChange={(event) => { void uploadTrack(event.target.files); event.target.value = ''; }} />
      </section>
      {error && <p className="invite-editor-error" role="alert">{error}</p>}
    </div>
  );
}
