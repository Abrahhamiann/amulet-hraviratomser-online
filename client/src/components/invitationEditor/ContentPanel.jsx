import React, { useEffect, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, ClipboardList, Heart, MapPin, MessageSquare, Plus, Sparkles, Trash2, Users } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { CollapsibleSection, Field, PanelHeader, Toggle, TypographyEditor } from './EditorControls.jsx';
import { splitNames } from './editorData.js';

const newVenue = (index) => ({ id: `venue-${Date.now()}-${index}`, label: `Վայր ${index + 1}`, time: '18:00', address: '', url: '', subtitle: '', icon: 'location', visible: true });

export default function ContentPanel() {
  const { activeSection, data, focusEditorTarget, update } = useEditor();
  const [openSections, setOpenSections] = useState(['hero', 'schedule']);
  const [firstName, secondName] = splitNames(data.mainNames);
  const toggleOpen = (id) => setOpenSections((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  useEffect(() => {
    if (!activeSection || activeSection === 'media') return;
    setOpenSections((items) => items.includes(activeSection) ? items : [...items, activeSection]);
  }, [activeSection]);

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
    draft.mainNames = names.filter(Boolean).join(' & ');
  });
  const updateTextStyle = (patch) => update((draft) => {
    draft.textStyles.names = { ...(draft.textStyles.names || {}), ...patch };
  });

  const updateVenue = (index, field, value) => update((draft) => {
    draft.mapLinks[index] = { ...draft.mapLinks[index], [field]: value };
    if (index === 0) {
      if (field === 'time') draft.eventTime = value;
      if (field === 'address') draft.eventLocation = value;
      if (field === 'url') draft.mapLink = value;
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
    <div className="invite-editor-panel" onFocusCapture={handleFieldFocus}>
      <PanelHeader title="Հրավերի խմբագրում" subtitle="Փոփոխությունները անմիջապես երևում են նախադիտման մեջ։" />

      <CollapsibleSection {...sectionProps('hero', 'Գլխավոր էկրան', Heart, 'heroVisible')}>
        <div className="invite-editor-grid-two">
          <Field label="Առաջին անունը" editorField="mainNames"><input value={firstName} onChange={(event) => updateName(0, event.target.value)} /></Field>
          <Field label="Երկրորդ անունը" editorField="mainNames"><input value={secondName} onChange={(event) => updateName(1, event.target.value)} /></Field>
        </div>
        <Field label="Անունների տեսքը" editorField="mainNames" action={<TypographyEditor value={data.textStyles.names || {}} onChange={updateTextStyle} />}>
          <input value={data.mainNames || ''} onChange={(event) => setField('mainNames', event.target.value)} />
        </Field>
        <Field label="Հրավերի հիմնական տեքստ" editorField="eventMessage"><textarea rows="4" value={data.eventMessage || ''} onChange={(event) => setField('eventMessage', event.target.value)} /></Field>
      </CollapsibleSection>

      <CollapsibleSection {...sectionProps('family', 'Ընտանեկան տվյալներ', Users, 'familyVisible')}>
        <Field label="Առաջին ընտանիքը" editorField="groomFamilyTitle"><input value={data.groomFamilyTitle || ''} onChange={(event) => setField('groomFamilyTitle', event.target.value)} /></Field>
        <Field label="Երկրորդ ընտանիքը" editorField="brideFamilyTitle"><input value={data.brideFamilyTitle || ''} onChange={(event) => setField('brideFamilyTitle', event.target.value)} /></Field>
      </CollapsibleSection>

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
              <div className="invite-editor-grid-two"><Field label="Ժամ" editorField={`mapLinks.${index}.time`}><input type="time" value={item.time || ''} onChange={(event) => updateVenue(index, 'time', event.target.value)} /></Field><Field label="Տեսակ"><select value={item.icon || 'location'} onChange={(event) => updateVenue(index, 'icon', event.target.value)}><option value="location">Վայր</option><option value="church">Եկեղեցի</option><option value="home">Տուն</option><option value="party">Հանդիսություն</option><option value="photo">Ֆոտոսեսիա</option></select></Field></div>
              <Field label="Ենթավերնագիր" hint="ըստ ցանկության" editorField={`mapLinks.${index}.subtitle`}><input value={item.subtitle || ''} onChange={(event) => updateVenue(index, 'subtitle', event.target.value)} /></Field>
              <Field label="Հասցե" editorField={`mapLinks.${index}.address`}><textarea rows="2" value={item.address || ''} onChange={(event) => updateVenue(index, 'address', event.target.value)} /></Field>
              <Field label="Google Maps հղում" editorField={`mapLinks.${index}.url`}><input inputMode="url" value={item.url || ''} onChange={(event) => updateVenue(index, 'url', event.target.value)} /></Field>
            </article>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection {...sectionProps('rsvp', 'Հյուրերի պատասխաններ', ClipboardList, 'questionsVisible')}>
        <Field label="Վերնագիր" editorField="rsvpSettings.title"><input value={data.rsvpSettings.title} onChange={(event) => update((draft) => { draft.rsvpSettings.title = event.target.value; })} /></Field>
        <Field label="Բացատրություն" editorField="rsvpSettings.description"><textarea rows="3" value={data.rsvpSettings.description} onChange={(event) => update((draft) => { draft.rsvpSettings.description = event.target.value; })} /></Field>
        <Field label="Անվան դաշտ" editorField="rsvpSettings.guestPlaceholder"><input value={data.rsvpSettings.guestPlaceholder} onChange={(event) => update((draft) => { draft.rsvpSettings.guestPlaceholder = event.target.value; })} /></Field>
        <div className="invite-editor-grid-two"><Field label="Կգամ" editorField="rsvpSettings.attendingLabel"><input value={data.rsvpSettings.attendingLabel} onChange={(event) => update((draft) => { draft.rsvpSettings.attendingLabel = event.target.value; })} /></Field><Field label="Չեմ գա" editorField="rsvpSettings.notAttendingLabel"><input value={data.rsvpSettings.notAttendingLabel} onChange={(event) => update((draft) => { draft.rsvpSettings.notAttendingLabel = event.target.value; })} /></Field></div>
        <Field label="Ուղարկելու կոճակ" editorField="rsvpSettings.submitLabel"><input value={data.rsvpSettings.submitLabel} onChange={(event) => update((draft) => { draft.rsvpSettings.submitLabel = event.target.value; })} /></Field>
        <Field label="Վերջնաժամկետ"><input type="date" value={data.rsvpSettings.deadline || ''} onChange={(event) => update((draft) => { draft.rsvpSettings.deadline = event.target.value; })} /></Field>
        <div className="invite-editor-toggle-row"><span>Հյուրերի քանակ</span><Toggle checked={data.rsvpSettings.askGuestCount !== false} onChange={(value) => update((draft) => { draft.rsvpSettings.askGuestCount = value; })} label="Հյուրերի քանակ" /></div>
        <div className="invite-editor-toggle-row"><span>Սննդի նախընտրություն</span><Toggle checked={data.rsvpSettings.askMeal === true} onChange={(value) => update((draft) => { draft.rsvpSettings.askMeal = value; })} label="Սննդի նախընտրություն" /></div>
        <Field label="Լրացուցիչ հարց" editorField="rsvpQuestion"><input value={data.rsvpQuestion || ''} onChange={(event) => setField('rsvpQuestion', event.target.value)} /></Field>
      </CollapsibleSection>

      <CollapsibleSection {...sectionProps('dress', 'Հագուստի կանոնակարգ', Sparkles, 'dressCodeVisible')}>
        <Field label="Dress code" editorField="dressCode"><textarea rows="4" value={data.dressCode || ''} onChange={(event) => setField('dressCode', event.target.value)} /></Field>
      </CollapsibleSection>

      <CollapsibleSection {...sectionProps('closing', 'Վերջնական խոսք', MessageSquare, 'finalMessageVisible')}>
        <Field label="Շնորհակալական հաղորդագրություն" editorField="closingMessage"><textarea rows="4" value={data.closingMessage || ''} onChange={(event) => setField('closingMessage', event.target.value)} /></Field>
      </CollapsibleSection>
    </div>
  );
}
