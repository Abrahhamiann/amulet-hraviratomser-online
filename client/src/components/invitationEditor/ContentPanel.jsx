import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, CheckSquare2, ChevronDown, ChevronUp, Heart, MapPin, MessageSquare, Plus, Shirt, Trash2, Users } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { CollapsibleSection, Field, PanelHeader, Toggle } from './EditorControls.jsx';
import { MAX_DRESS_CODE_COLORS, splitNames } from './editorData.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { normalizeMapUrl } from '../../utils/mapLinks.js';

const newVenue = (index, label) => ({ id: `venue-${Date.now()}-${index}`, label, time: '18:00', address: '', url: '', subtitle: '', icon: 'location', visible: true });

const createGoogleMapsUrl = (address) => {
  const query = String(address || '').trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
};

const autoGrowTextarea = (textarea) => {
  if (!(textarea instanceof HTMLTextAreaElement)) return;
  textarea.style.height = '0px';
  textarea.style.height = `${Math.max(textarea.scrollHeight, 46)}px`;
};

const normalizeDressColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || ''))
  ? String(value).toLowerCase()
  : '#d8b98e';

const DressColorPicker = ({ value, label, editorField, onCommit }) => {
  const inputRef = useRef(null);
  const onCommitRef = useRef(onCommit);
  const normalizedValue = normalizeDressColor(value);
  const [previewColor, setPreviewColor] = useState(normalizedValue);
  const lastCommittedRef = useRef(normalizedValue);

  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  useEffect(() => {
    setPreviewColor(normalizedValue);
    lastCommittedRef.current = normalizedValue;
    if (inputRef.current && inputRef.current.value !== normalizedValue) {
      inputRef.current.value = normalizedValue;
    }
  }, [normalizedValue]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return undefined;

    const commitColor = () => {
      const nextColor = normalizeDressColor(input.value);
      setPreviewColor(nextColor);
      if (nextColor === lastCommittedRef.current) return;
      lastCommittedRef.current = nextColor;
      onCommitRef.current(nextColor);
    };

    input.addEventListener('change', commitColor);
    input.addEventListener('blur', commitColor);
    return () => {
      input.removeEventListener('change', commitColor);
      input.removeEventListener('blur', commitColor);
    };
  }, []);

  return <label className="invite-editor-color-picker" data-editor-field={editorField} aria-label={label}>
    <input
      ref={inputRef}
      type="color"
      defaultValue={normalizedValue}
      onInput={(event) => setPreviewColor(normalizeDressColor(event.currentTarget.value))}
    />
    <span style={{ backgroundColor: previewColor }} aria-hidden="true" />
  </label>;
};

const editorProfiles = {
  wedding: {
    title: 'editorWeddingTitle', dualNames: true, firstName: 'editorBrideName', secondName: 'editorGroomName', namesLabel: 'editorCoupleNames', messageLabel: 'editorWeddingMessage', venueTypes: ['church', 'home', 'party', 'photo', 'location']
  },
  engagement: {
    title: 'editorEngagementTitle', dualNames: true, firstName: 'editorFirstName', secondName: 'editorSecondName', namesLabel: 'editorCoupleNames', messageLabel: 'editorEngagementMessage', venueTypes: ['home', 'party', 'photo', 'location']
  },
  baptism: {
    title: 'editorBaptismTitle', dualNames: false, nameLabel: 'editorChildName', messageLabel: 'editorBaptismMessage', venueTypes: ['church', 'home', 'party', 'location']
  },
  birth: {
    title: 'editorBirthdayTitle', dualNames: false, nameLabel: 'editorCelebrantName', messageLabel: 'editorBirthdayMessage', venueTypes: ['home', 'party', 'location']
  },
  corporate: {
    title: 'editorCorporateTitle', dualNames: false, nameLabel: 'editorEventName', messageLabel: 'editorCorporateMessage', venueTypes: ['party', 'location']
  },
  military: {
    title: 'editorMilitaryTitle', dualNames: false, nameLabel: 'editorSoldierName', messageLabel: 'editorMilitaryMessage', venueTypes: ['party', 'location']
  }
};

const normalizeTemplateKey = (template = {}) => [template.designKey, template.slug, template.title]
  .filter(Boolean).join(' ').toLowerCase();

const getEditorCapabilities = (template = {}) => {
  const key = normalizeTemplateKey(template);
  const base = {
    mainNames: true, eventMessage: true, heroVisible: true, openingVisible: true,
    family: true, familyVisible: true, groomFamilyTitle: true, brideFamilyTitle: true,
    schedule: true, eventDate: true, eventTime: true, venues: true, receptionVisible: true,
    rsvp: true, questionsVisible: true, rsvpDescription: false, rsvpDeadline: false,
    rsvpQuestion: true, rsvpGuestCount: true, rsvpMeal: true,
    venueAddress: true, venueMapLink: true, maxVenues: null,
    dress: false, dressCodeVisible: false, closing: true, finalMessageVisible: true
  };
  if (key.includes('sacred-beginnings') || key.includes('sacred-baptism')) return {
    ...base, openingVisible: false, familyVisible: false, brideFamilyTitle: false,
    venues: true, rsvpDescription: true, rsvpDeadline: true
  };
  if (key.includes('birthday-sparkle') || key.includes('sparkle-birthday')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true, dress: true
  };
  if (key.includes('birthday-space') || key.includes('space-birthday') || key.includes('cnund1')) return {
    ...base, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    rsvpDescription: true, rsvpDeadline: true, futureDateOnly: true
  };
  if (key.includes('birthday-watercolor') || key.includes('watercolor-birthday') || key.includes('cnund2')) return {
    ...base, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    rsvpDescription: true, rsvpDeadline: true, futureDateOnly: true
  };
  if (key.includes('birthday-crimson') || key.includes('emma-birthday') || key.includes('cnund3')) return {
    ...base, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true, futureDateOnly: true
  };
  if (key.includes('army-ceremonial') || key.includes('amulet-army-invitation') || key.includes('army-camouflage') || key.includes('army-invitation-camouflage')) return {
    ...base, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 1,
    dress: false, dressCodeVisible: false, dressPalette: false,
    closing: true, finalMessageVisible: true
  };
  if (key.includes('ivory-vows') || key.includes('ivory-wedding')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, eventTime: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true
  };
  if (key.includes('divine-blessing')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    rsvpDescription: true, rsvpDeadline: true
  };
  if (key.includes('elevate-invite')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true
  };
  if (key.includes('ever-after')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true
  };
  if (key.includes('everlasting-vows')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true
  };
  if (key.includes('forever-vows')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true
  };
  if (key.includes('silk-vows') || key.includes('armenian-wedding-invitation')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    rsvpDescription: true, rsvpDeadline: true
  };
  if (key.includes('burgundy-roadmap') || key.includes('wedding-burgundy-roadmap')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, eventTime: false, venues: true,
    dress: false, dressCodeVisible: false, dressPalette: false,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: false, rsvpMeal: false, venueAddress: false,
    venueMapLink: false, maxVenues: 4, closing: false, finalMessageVisible: false
  };
  if (key.includes('monochrome-envelope') || key.includes('harsaniq2')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 4,
    closing: false, finalMessageVisible: false
  };
  if (key.includes('love-map-wedding') || key.includes('harsaniq4')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 3,
    closing: false, finalMessageVisible: false
  };
  if (key.includes('angelic-baptism') || key.includes('knunq1')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 2,
    closing: false, finalMessageVisible: false
  };
  if (key.includes('polaroid-engagement') || key.includes('nshanadrutyun1')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: false, dressCodeVisible: false, dressPalette: false,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 1,
    closing: false, finalMessageVisible: false
  };
  if (key.includes('golden-heart-engagement') || key.includes('nshanadrutyun2')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 1,
    closing: false, finalMessageVisible: false
  };
  if (key.includes('cinematic-engagement') || key.includes('nshanadrutyun3')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: true, dressCodeVisible: true, dressPalette: true,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 4,
    closing: false, finalMessageVisible: false
  };
  if (key.includes('last-bell') || key.includes('verjin-zang-1')) return {
    ...base, openingVisible: false, family: false, familyVisible: false,
    groomFamilyTitle: false, brideFamilyTitle: false, venues: true,
    dress: false, dressCodeVisible: false, dressPalette: false,
    rsvpDescription: true, rsvpDeadline: true, rsvpQuestion: false,
    rsvpGuestCount: true, rsvpMeal: false, maxVenues: 2,
    closing: false, finalMessageVisible: false
  };
  if (key.includes('midnight-vows') || key.includes('engagement-serenade') || key.includes('baptism-blessing')) return base;
  return base;
};

export default function ContentPanel() {
  const { activeSection, data, editableContent, focusEditorTarget, template, update } = useEditor();
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState(['hero', 'schedule']);
  const panelRef = useRef(null);
  const lastPreviewFocusRef = useRef({ key: '', at: 0 });
  const [firstName, secondName] = splitNames(data.mainNames);
  const editorType = String(template?.editorType || template?.category || 'wedding').toLowerCase();
  const profile = editorProfiles[editorType] || editorProfiles.wedding;
  const capabilities = getEditorCapabilities(template);
  const now = new Date();
  const minimumEventDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');
  const isBaptismEditor = editorType === 'baptism';
  const dressColorNames = new Set((data.dressCodeColors || []).map((color) => String(color?.name || '').trim()).filter(Boolean));
  const visibleTemplateTexts = editableContent.texts.filter((item) => {
    if (capabilities.dressPalette && item.section === 'dress' && dressColorNames.has(String(item.defaultValue || '').trim())) return false;
    if (!isBaptismEditor) return true;
    const defaultText = String(item.defaultValue || '').replace(/\s+/g, ' ').trim();
    return defaultText !== 'Կնքահայր և կնքամայր';
  });
  const toggleOpen = (id) => setOpenSections((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  useEffect(() => {
    if (!activeSection || activeSection === 'media') return;
    setOpenSections((items) => items.includes(activeSection) ? items : [...items, activeSection]);
  }, [activeSection]);

  useEffect(() => {
    panelRef.current?.querySelectorAll('textarea').forEach(autoGrowTextarea);
  }, [data, editableContent.texts.length, openSections]);

  const handleFieldFocus = (event) => {
    const field = event.target.closest('[data-editor-field]')?.dataset.editorField;
    const section = event.target.closest('[data-editor-section-id]')?.dataset.editorSectionId;
    // Section action buttons (add/delete/reorder/toggle) must not move the
    // preview. Only actual editor fields participate in sidebar -> preview
    // focus scrolling.
    if (!section || !field) return;
    const now = window.performance?.now?.() ?? Date.now();
    const key = `${section}:${field || ''}`;
    if (lastPreviewFocusRef.current.key === key && now - lastPreviewFocusRef.current.at < 250) return;
    lastPreviewFocusRef.current = { key, at: now };
    focusEditorTarget({
      section,
      field: field || '',
      scrollPreview: true,
      focusSidebar: false,
      scrollSidebar: false
    });
  };
  const setVisible = (field, value) => update((draft) => { draft[field] = value; });
  const setField = (field, value) => update((draft) => { draft[field] = value; });
  const updateName = (index, value) => update((draft) => {
    const names = splitNames(draft.mainNames);
    names[index] = value;
    draft.mainNames = names.join(' & ');
  });
  const updateTemplateText = (key, value) => update((draft) => {
    draft.templateTextOverrides = { ...(draft.templateTextOverrides || {}), [key]: value };
  });
  const renderTemplateTextFields = (section) => {
    const items = visibleTemplateTexts.filter((item) => (item.section || 'templateContent') === section);
    if (!items.length) return null;
    return <div className="invite-editor-template-text-fields">
      <div className="invite-editor-list-heading"><strong>{t('editorTemplateTexts')}</strong><small>{items.length}</small></div>
      {items.map((item, index) => {
        const overrides = data.templateTextOverrides || {};
        const rawValue = Object.prototype.hasOwnProperty.call(overrides, item.key) ? overrides[item.key] : item.defaultValue;
        const value = item.inputMode === 'numeric' ? String(rawValue ?? '').replace(/\D/g, '') : String(rawValue ?? '');
        const preview = String(item.defaultValue || '').replace(/\s+/g, ' ').trim();
        return <Field key={item.key} label={preview ? `«${preview.slice(0, 42)}${preview.length > 42 ? '…' : ''}»` : `${t('editorText')} ${index + 1}`} editorField={`templateTextOverrides.${item.key}`}>
          {item.inputMode === 'numeric'
            ? <input type="text" inputMode="numeric" pattern="[0-9]*" value={value} onChange={(event) => updateTemplateText(item.key, event.target.value.replace(/\D/g, ''))} />
            : <textarea rows={value.length > 70 ? 3 : 2} value={value} onChange={(event) => updateTemplateText(item.key, event.target.value)} />}
        </Field>;
      })}
    </div>;
  };
  const updateVenue = (index, field, value) => update((draft) => {
    const current = draft.mapLinks[index] || newVenue(index, `${t('editorVenue')} ${index + 1}`);
    const nextValue = field === 'url' ? (normalizeMapUrl(value) || value) : value;
    const next = { ...current, [field]: nextValue };
    if (field === 'address') {
      const previousAutoUrl = createGoogleMapsUrl(current.address);
      if (!current.url || current.url === previousAutoUrl) next.url = createGoogleMapsUrl(value);
    }
    draft.mapLinks[index] = next;
    if (index === 0) {
      draft.eventTime = next.time || draft.eventTime;
      draft.eventLocation = next.address || '';
      draft.mapLink = next.url || '';
    }
  });

  const moveVenue = (index, direction) => update((draft) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= draft.mapLinks.length) return;
    const [item] = draft.mapLinks.splice(index, 1);
    draft.mapLinks.splice(nextIndex, 0, item);
    draft.eventTime = draft.mapLinks[0]?.time || draft.eventTime;
    draft.eventLocation = draft.mapLinks[0]?.address || draft.eventLocation;
    draft.mapLink = draft.mapLinks[0]?.url || '';
  });

  const sectionProps = (id, title, icon, field, canToggle = true) => ({
    id,
    title,
    icon,
    open: openSections.includes(id),
    onToggle: () => {
      focusEditorTarget({ section: id, scrollPreview: true });
      toggleOpen(id);
    },
    enabled: field && canToggle ? data[field] !== false : undefined,
    onEnabledChange: field && canToggle ? (value) => setVisible(field, value) : undefined
  });

  return (
    <div ref={panelRef} className="invite-editor-panel" onFocusCapture={handleFieldFocus} onPointerDownCapture={handleFieldFocus} onInputCapture={(event) => autoGrowTextarea(event.target)}>
      <PanelHeader title={t(profile.title)} subtitle={t('editorSessionSubtitle')} />

      <CollapsibleSection {...sectionProps('hero', t('editorMainScreen'), Heart, 'heroVisible')}>
        {profile.dualNames ? (
          <>
            <div className="invite-editor-grid-two">
              <Field label={t(profile.firstName)} editorField="mainName.0"><input value={firstName} onChange={(event) => updateName(0, event.target.value)} /></Field>
              <Field label={t(profile.secondName)} editorField="mainName.1"><input value={secondName} onChange={(event) => updateName(1, event.target.value)} /></Field>
            </div>
            <Field label={t(profile.namesLabel)} editorField="mainNames">
              <input value={data.mainNames || ''} onChange={(event) => setField('mainNames', event.target.value)} />
            </Field>
          </>
        ) : (
          <Field label={t(profile.nameLabel)} editorField="mainNames">
            <input value={data.mainNames || ''} onChange={(event) => setField('mainNames', event.target.value)} />
          </Field>
        )}
        {capabilities.eventMessage && <Field label={t(profile.messageLabel)} editorField="eventMessage"><textarea rows="4" value={data.eventMessage || ''} onChange={(event) => setField('eventMessage', event.target.value)} /></Field>}
        {capabilities.openingVisible && <div className="invite-editor-toggle-row"><span>{t('editorShowOpening')}</span><Toggle checked={data.openingVisible !== false} onChange={(value) => setVisible('openingVisible', value)} label={t('editorOpeningMessage')} /></div>}
        {renderTemplateTextFields('hero')}
      </CollapsibleSection>

      {(capabilities.family || visibleTemplateTexts.some((item) => item.section === 'family')) && <CollapsibleSection {...sectionProps('family', t('editorFamilies'), Users, 'familyVisible', capabilities.familyVisible)}>
        {capabilities.groomFamilyTitle && <Field label={profile.dualNames ? t('editorFirstFamilyText') : t('editorFamilyText')} hint={t('optional')} editorField="groomFamilyTitle">
          <textarea rows="2" value={data.groomFamilyTitle || ''} onChange={(event) => setField('groomFamilyTitle', event.target.value)} />
        </Field>}
        {profile.dualNames && capabilities.brideFamilyTitle && <Field label={t('editorSecondFamilyText')} hint={t('optional')} editorField="brideFamilyTitle">
          <textarea rows="2" value={data.brideFamilyTitle || ''} onChange={(event) => setField('brideFamilyTitle', event.target.value)} />
        </Field>}
        {renderTemplateTextFields('family')}
      </CollapsibleSection>}

      {visibleTemplateTexts.some((item) => (item.section || 'templateContent') === 'templateContent') && (
        <CollapsibleSection {...sectionProps('templateContent', t('editorAllTemplateTexts'), MessageSquare)}>
          {renderTemplateTextFields('templateContent')}
        </CollapsibleSection>
      )}

      <CollapsibleSection {...sectionProps('schedule', t('editorDateTimeSchedule'), CalendarDays, 'receptionVisible', capabilities.receptionVisible)}>
        <div className="invite-editor-grid-two">
          {capabilities.eventDate && <Field label={t('date')} editorField="eventDate"><input type="date" min={capabilities.futureDateOnly ? minimumEventDate : undefined} value={data.eventDate || ''} onChange={(event) => {
            const value = event.target.value;
            if (capabilities.futureDateOnly && value && value < minimumEventDate) return;
            setField('eventDate', value);
          }} /></Field>}
          {capabilities.eventTime && <Field label={t('editorMainTime')} editorField="eventTime"><input type="time" value={data.eventTime || ''} onChange={(event) => capabilities.venues ? updateVenue(0, 'time', event.target.value) : setField('eventTime', event.target.value)} /></Field>}
        </div>
        {!capabilities.venues && <Field label={t('address')} editorField="eventLocation"><textarea rows="2" value={data.eventLocation || ''} onChange={(event) => setField('eventLocation', event.target.value)} /></Field>}
        {capabilities.venues && <><div className="invite-editor-list-heading"><strong>{t('editorEventSchedule')}</strong><button type="button" disabled={Number.isFinite(capabilities.maxVenues) && data.mapLinks.length >= capabilities.maxVenues} onClick={() => update((draft) => {
          if (!Array.isArray(draft.mapLinks)) draft.mapLinks = [];
          draft.mapLinks.push(newVenue(draft.mapLinks.length, `${t('editorVenue')} ${draft.mapLinks.length + 1}`));
        })}><Plus size={15} /> {t('add')}</button></div>
        <div className="invite-editor-venue-list">
          {data.mapLinks.map((item, index) => (
            <article key={item.id || `${item.label}-${index}`}>
              <header><span><MapPin size={14} /> {String(index + 1).padStart(2, '0')}</span><div>
                <button type="button" disabled={index === 0} onClick={() => moveVenue(index, -1)} aria-label={t('moveUp')}><ChevronUp size={14} /></button>
                <button type="button" disabled={index === data.mapLinks.length - 1} onClick={() => moveVenue(index, 1)} aria-label={t('moveDown')}><ChevronDown size={14} /></button>
                <Toggle checked={item.visible !== false} onChange={(value) => updateVenue(index, 'visible', value)} label={`${item.label}: ${t('show')}`} />
                <button type="button" className="is-danger" onClick={() => update((draft) => {
                  draft.mapLinks.splice(index, 1);
                  if (!draft.mapLinks.length) draft.mapLinks.push(newVenue(0, `${t('editorVenue')} 1`));
                  draft.eventTime = draft.mapLinks[0]?.time || draft.eventTime;
                  draft.eventLocation = draft.mapLinks[0]?.address || draft.eventLocation;
                  draft.mapLink = draft.mapLinks[0]?.url || '';
                })} aria-label={t('editorDeleteVenue')}><Trash2 size={14} /></button>
              </div></header>
              <Field label={t('name')} editorField={`mapLinks.${index}.label`}><input value={item.label || ''} onChange={(event) => updateVenue(index, 'label', event.target.value)} /></Field>
              <Field label={t('time')} editorField={`mapLinks.${index}.time`}><input type="time" value={item.time || ''} onChange={(event) => updateVenue(index, 'time', event.target.value)} /></Field>
              {capabilities.venueAddress && <Field label={t('address')} editorField={`mapLinks.${index}.address`}><textarea rows="2" value={item.address || ''} onChange={(event) => updateVenue(index, 'address', event.target.value)} /></Field>}
              {capabilities.venueMapLink && <Field label={t('editorGoogleMapsLink')} editorField={`mapLinks.${index}.url`}><input inputMode="url" value={item.url || ''} onChange={(event) => updateVenue(index, 'url', event.target.value)} /></Field>}
            </article>
          ))}
        </div></>}
        {renderTemplateTextFields('schedule')}
      </CollapsibleSection>

      <CollapsibleSection {...sectionProps('rsvp', t('editorRsvp'), CheckSquare2, 'questionsVisible')}>
        <Field label={t('editorSectionTitle')} editorField="rsvpSettings.title"><input value={data.rsvpSettings?.title || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.title = event.target.value; })} /></Field>
        {capabilities.rsvpDescription && <Field label={t('description')} editorField="rsvpSettings.description"><textarea rows="2" value={data.rsvpSettings?.description || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.description = event.target.value; })} /></Field>}
        {capabilities.rsvpDeadline && <Field label={t('editorResponseDeadline')} hint={t('optional')} editorField="rsvpSettings.deadline"><input value={data.rsvpSettings?.deadline || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.deadline = event.target.value; })} /></Field>}
        <Field label={t('editorGuestNameHint')} editorField="rsvpSettings.guestPlaceholder"><input value={data.rsvpSettings?.guestPlaceholder || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.guestPlaceholder = event.target.value; })} /></Field>
        <div className="invite-editor-grid-two">
          <Field label={t('editorAttendingOption')} editorField="rsvpSettings.attendingLabel"><input value={data.rsvpSettings?.attendingLabel || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.attendingLabel = event.target.value; })} /></Field>
          <Field label={t('editorNotAttendingOption')} editorField="rsvpSettings.notAttendingLabel"><input value={data.rsvpSettings?.notAttendingLabel || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.notAttendingLabel = event.target.value; })} /></Field>
        </div>
        <Field label={t('editorButtonText')} editorField="rsvpSettings.submitLabel"><input value={data.rsvpSettings?.submitLabel || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.submitLabel = event.target.value; })} /></Field>
        {capabilities.rsvpQuestion && <Field label={t('editorExtraQuestion')} hint={t('optional')} editorField="rsvpQuestion"><textarea rows="2" value={data.rsvpQuestion || ''} onChange={(event) => setField('rsvpQuestion', event.target.value)} /></Field>}
        {capabilities.rsvpGuestCount && <div className="invite-editor-toggle-row"><span>{t('editorAskGuestCount')}</span><Toggle checked={data.rsvpSettings?.askGuestCount !== false} onChange={(value) => update((draft) => { draft.rsvpSettings = { ...(draft.rsvpSettings || {}), askGuestCount: value }; })} label={t('guestCount')} /></div>}
        {capabilities.rsvpMeal && <div className="invite-editor-toggle-row"><span>{t('editorAskMeal')}</span><Toggle checked={data.rsvpSettings?.askMeal === true} onChange={(value) => update((draft) => { draft.rsvpSettings = { ...(draft.rsvpSettings || {}), askMeal: value }; })} label={t('editorMealPreference')} /></div>}
        {renderTemplateTextFields('rsvp')}
      </CollapsibleSection>

      {capabilities.dress && <CollapsibleSection {...sectionProps('dress', t('editorDressCode'), Shirt, 'dressCodeVisible', capabilities.dressCodeVisible)}>
          <Field label={t('editorDressCode')} editorField="dressCode"><textarea rows="3" value={data.dressCode || ''} onChange={(event) => setField('dressCode', event.target.value)} /></Field>
          {capabilities.dressPalette && <div className="invite-editor-dress-colors">
            <div className="invite-editor-list-heading"><strong>{t('editorDressCodeColors')}</strong><button type="button" disabled={(data.dressCodeColors || []).length >= MAX_DRESS_CODE_COLORS} onClick={() => update((draft) => {
              if (!Array.isArray(draft.dressCodeColors)) draft.dressCodeColors = [];
              draft.dressCodeColors.push({ name: t('editorNewColor'), hex: '#d8b98e' });
            })}><Plus size={15} /> {t('add')}</button></div>
            {(data.dressCodeColors || []).map((color, index) => <article key={index} data-editor-field={`dressCodeColors.${index}`}>
              <DressColorPicker
                value={color.hex}
                label={`${t('editorDressColor')} ${index + 1}`}
                editorField={`dressCodeColors.${index}.hex`}
                onCommit={(hex) => update((draft) => {
                  if (draft.dressCodeColors?.[index]) draft.dressCodeColors[index].hex = hex;
                })}
              />
              <Field label={`${t('editorDressColor')} ${index + 1}`} editorField={`dressCodeColors.${index}.name`}><input value={color.name || ''} onChange={(event) => update((draft) => { draft.dressCodeColors[index].name = event.target.value; })} /></Field>
              <button type="button" className="is-danger" onClick={() => update((draft) => { draft.dressCodeColors.splice(index, 1); })} aria-label={`${t('delete')}: ${color.name || `${t('editorDressColor')} ${index + 1}`}`}><Trash2 size={15} /></button>
            </article>)}
          </div>}
          {renderTemplateTextFields('dress')}
        </CollapsibleSection>}

      {capabilities.closing && <CollapsibleSection {...sectionProps('closing', t('editorClosingWords'), MessageSquare, 'finalMessageVisible')}>
        <Field label={t('editorClosingMessage')} editorField="closingMessage"><textarea rows="3" value={data.closingMessage || ''} onChange={(event) => setField('closingMessage', event.target.value)} /></Field>
        {renderTemplateTextFields('closing')}
      </CollapsibleSection>}

    </div>
  );
}
