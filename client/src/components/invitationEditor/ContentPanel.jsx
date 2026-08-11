import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, Heart, MapPin, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { CollapsibleSection, Field, PanelHeader, Toggle } from './EditorControls.jsx';
import { splitNames } from './editorData.js';

const newVenue = (index) => ({ id: `venue-${Date.now()}-${index}`, label: `Վայր ${index + 1}`, time: '18:00', address: '', url: '', subtitle: '', icon: 'location', visible: true });

const createGoogleMapsUrl = (address) => {
  const query = String(address || '').trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
};

const autoGrowTextarea = (textarea) => {
  if (!(textarea instanceof HTMLTextAreaElement)) return;
  textarea.style.height = '0px';
  textarea.style.height = `${Math.max(textarea.scrollHeight, 46)}px`;
};

const editorProfiles = {
  wedding: {
    title: 'Հարսանիքի հրավերի խմբագրում', dualNames: true, firstName: 'Հարսի անունը', secondName: 'Փեսայի անունը', namesLabel: 'Զույգի անունների տեսքը', messageLabel: 'Հարսանեկան հրավերի տեքստ', venueTypes: ['church', 'home', 'party', 'photo', 'location']
  },
  engagement: {
    title: 'Նշանադրության հրավերի խմբագրում', dualNames: true, firstName: 'Առաջին անունը', secondName: 'Երկրորդ անունը', namesLabel: 'Զույգի անունների տեսքը', messageLabel: 'Նշանադրության հրավերի տեքստ', venueTypes: ['home', 'party', 'photo', 'location']
  },
  baptism: {
    title: 'Մկրտության հրավերի խմբագրում', dualNames: false, nameLabel: 'Երեխայի անունը', messageLabel: 'Մկրտության հրավերի տեքստ', venueTypes: ['church', 'home', 'party', 'location']
  },
  birth: {
    title: 'Ծնունդի հրավերի խմբագրում', dualNames: false, nameLabel: 'Հոբելյարի անունը', messageLabel: 'Ծնունդի հրավերի տեքստ', venueTypes: ['home', 'party', 'location']
  },
  corporate: {
    title: 'Կորպորատիվ հրավերի խմբագրում', dualNames: false, nameLabel: 'Միջոցառման անվանումը', messageLabel: 'Կորպորատիվ հրավերի տեքստ', venueTypes: ['party', 'location']
  }
};

const venueTypeLabels = {
  location: 'Վայր', church: 'Եկեղեցի', home: 'Տուն', party: 'Հանդիսություն', photo: 'Ֆոտոսեսիա'
};

export default function ContentPanel() {
  const { activeSection, data, editableContent, focusEditorTarget, template, update } = useEditor();
  const [openSections, setOpenSections] = useState(['hero', 'schedule']);
  const panelRef = useRef(null);
  const [firstName, secondName] = splitNames(data.mainNames);
  const editorType = String(template?.editorType || template?.category || 'wedding').toLowerCase();
  const profile = editorProfiles[editorType] || editorProfiles.wedding;
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
    if (section) focusEditorTarget({ section, field: field || '', scrollPreview: true });
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
  const updateVenue = (index, field, value) => update((draft) => {
    const current = draft.mapLinks[index] || newVenue(index);
    const next = { ...current, [field]: value };
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

  const sectionProps = (id, title, icon, field) => ({
    id,
    title,
    icon,
    open: openSections.includes(id),
    onToggle: () => {
      focusEditorTarget({ section: id, scrollPreview: true });
      toggleOpen(id);
    },
    enabled: field ? data[field] !== false : undefined,
    onEnabledChange: field ? (value) => setVisible(field, value) : undefined
  });

  return (
    <div ref={panelRef} className="invite-editor-panel" onFocusCapture={handleFieldFocus} onPointerDownCapture={handleFieldFocus} onInputCapture={(event) => autoGrowTextarea(event.target)}>
      <PanelHeader title={profile.title} subtitle="Փոփոխությունները ավտոմատ պահպանվում և անմիջապես երևում են նախադիտման մեջ։" />

      <CollapsibleSection {...sectionProps('hero', 'Գլխավոր էկրան', Heart, 'heroVisible')}>
        {profile.dualNames ? (
          <>
            <div className="invite-editor-grid-two">
              <Field label={profile.firstName} editorField="mainName.0"><input value={firstName} onChange={(event) => updateName(0, event.target.value)} /></Field>
              <Field label={profile.secondName} editorField="mainName.1"><input value={secondName} onChange={(event) => updateName(1, event.target.value)} /></Field>
            </div>
            <Field label={profile.namesLabel} editorField="mainNames">
              <input value={data.mainNames || ''} onChange={(event) => setField('mainNames', event.target.value)} />
            </Field>
          </>
        ) : (
          <Field label={profile.nameLabel} editorField="mainNames">
            <input value={data.mainNames || ''} onChange={(event) => setField('mainNames', event.target.value)} />
          </Field>
        )}
        <Field label={profile.messageLabel} editorField="eventMessage"><textarea rows="4" value={data.eventMessage || ''} onChange={(event) => setField('eventMessage', event.target.value)} /></Field>
      </CollapsibleSection>

      {editableContent.texts.length > 0 && (
        <CollapsibleSection {...sectionProps('templateContent', 'Շաբլոնի բոլոր տեքստերը', MessageSquare)}>
          {editableContent.texts.map((item, index) => {
            const overrides = data.templateTextOverrides || {};
            const value = Object.prototype.hasOwnProperty.call(overrides, item.key) ? overrides[item.key] : item.defaultValue;
            return (
              <Field key={item.key} label={`Տեքստ ${index + 1}`} hint={item.defaultValue.slice(0, 54)} editorField={`templateTextOverrides.${item.key}`}>
                <textarea rows={value.length > 70 ? 3 : 2} value={value} onChange={(event) => updateTemplateText(item.key, event.target.value)} />
              </Field>
            );
          })}
        </CollapsibleSection>
      )}

      <CollapsibleSection {...sectionProps('schedule', 'Օր, ժամ և ծրագիր', CalendarDays, 'receptionVisible')}>
        <div className="invite-editor-grid-two">
          <Field label="Ամսաթիվ" editorField="eventDate"><input type="date" value={data.eventDate || ''} onChange={(event) => setField('eventDate', event.target.value)} /></Field>
          <Field label="Հիմնական ժամ" editorField="eventTime"><input type="time" value={data.eventTime || ''} onChange={(event) => updateVenue(0, 'time', event.target.value)} /></Field>
        </div>
        <div className="invite-editor-list-heading"><strong>Միջոցառման ծրագիր</strong><button type="button" onClick={() => update((draft) => { draft.mapLinks.push(newVenue(draft.mapLinks.length)); })}><Plus size={15} /> Ավելացնել</button></div>
        <div className="invite-editor-venue-list">
          {data.mapLinks.map((item, index) => (
            <article key={item.id || `${item.label}-${index}`}>
              <header><span><MapPin size={14} /> {String(index + 1).padStart(2, '0')}</span><div>
                <button type="button" disabled={index === 0} onClick={() => moveVenue(index, -1)} aria-label="Տեղափոխել վեր"><ChevronUp size={14} /></button>
                <button type="button" disabled={index === data.mapLinks.length - 1} onClick={() => moveVenue(index, 1)} aria-label="Տեղափոխել վար"><ChevronDown size={14} /></button>
                <Toggle checked={item.visible !== false} onChange={(value) => updateVenue(index, 'visible', value)} label={`${item.label} ցուցադրել`} />
                <button type="button" className="is-danger" onClick={() => update((draft) => {
                  draft.mapLinks.splice(index, 1);
                  if (!draft.mapLinks.length) draft.mapLinks.push(newVenue(0));
                  draft.eventTime = draft.mapLinks[0]?.time || draft.eventTime;
                  draft.eventLocation = draft.mapLinks[0]?.address || draft.eventLocation;
                  draft.mapLink = draft.mapLinks[0]?.url || '';
                })} aria-label="Ջնջել վայրը"><Trash2 size={14} /></button>
              </div></header>
              <Field label="Անվանում" editorField={`mapLinks.${index}.label`}><input value={item.label || ''} onChange={(event) => updateVenue(index, 'label', event.target.value)} /></Field>
              <div className="invite-editor-grid-two"><Field label="Ժամ" editorField={`mapLinks.${index}.time`}><input type="time" value={item.time || ''} onChange={(event) => updateVenue(index, 'time', event.target.value)} /></Field><Field label="Տեսակ"><select value={profile.venueTypes.includes(item.icon) ? item.icon : profile.venueTypes[0]} onChange={(event) => updateVenue(index, 'icon', event.target.value)}>{profile.venueTypes.map((value) => <option key={value} value={value}>{venueTypeLabels[value]}</option>)}</select></Field></div>
              <Field label="Ենթավերնագիր" hint="ըստ ցանկության" editorField={`mapLinks.${index}.subtitle`}><input value={item.subtitle || ''} onChange={(event) => updateVenue(index, 'subtitle', event.target.value)} /></Field>
              <Field label="Հասցե" editorField={`mapLinks.${index}.address`}><textarea rows="2" value={item.address || ''} onChange={(event) => updateVenue(index, 'address', event.target.value)} /></Field>
              <Field label="Google Maps հղում" editorField={`mapLinks.${index}.url`}><input inputMode="url" value={item.url || ''} onChange={(event) => updateVenue(index, 'url', event.target.value)} /></Field>
            </article>
          ))}
        </div>
      </CollapsibleSection>

    </div>
  );
}
