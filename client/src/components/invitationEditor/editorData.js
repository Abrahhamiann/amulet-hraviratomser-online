import weddingSong from '../../assets/audio/ed-sheeran-perfect.mp3';
import engagementSong from '../../assets/audio/john-legend-all-of-you.mp3';
import baptismSong from '../../assets/audio/yiruma-river-flows-in-you.mp3';

export const MAX_GALLERY_IMAGES = 10;
export const MAX_CUSTOM_TRACKS = 3;
export const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

export const builtInTracks = [
  { id: 'perfect', title: 'Perfect', artist: 'Ed Sheeran', meta: 'Amulet ընտրանի', src: weddingSong },
  { id: 'all-of-me', title: 'All of Me', artist: 'John Legend', meta: 'Amulet ընտրանի', src: engagementSong },
  { id: 'river-flows', title: 'River Flows in You', artist: 'Yiruma', meta: 'Amulet ընտրանի', src: baptismSong }
];

export const buttonPresets = [
  { id: '01', label: 'Մուգ', style: { background: '#181716', color: '#fff', border: '1px solid #181716' } },
  { id: '02', label: 'Ոսկեգույն', style: { background: '#d8b98e', color: '#241f19', border: '1px solid #d8b98e' } },
  { id: '03', label: 'Մուգ եզրագիծ', style: { background: 'transparent', color: '#181716', border: '1px solid #181716' } },
  { id: '04', label: 'Ոսկե եզրագիծ', style: { background: 'transparent', color: '#9b7442', border: '1px solid #d8b98e' } },
  { id: '05', label: 'Փափուկ բեժ', style: { background: '#f5e9d8', color: '#31291f', border: '1px solid #f5e9d8' } },
  { id: '06', label: 'Սպիտակ', style: { background: '#fff', color: '#181716', border: '1px solid #e8e5df' } },
  { id: '07', label: 'Թափանցիկ', style: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.75)' } },
  { id: '08', label: 'Մինիմալ', style: { background: 'transparent', color: '#181716', border: '0' } },
  { id: '09', label: 'Մոխրագույն', style: { background: '#f3f2ef', color: '#59544e', border: '1px solid #e4e1dc' } },
  { id: '10', label: 'Շագանակագույն', style: { background: '#4d4038', color: '#fff', border: '1px solid #4d4038' } },
  { id: '11', label: 'Կրկնակի եզր', style: { background: 'transparent', color: '#181716', border: '3px double #d8b98e' } },
  { id: '12', label: 'Բարձրացված', style: { background: '#181716', color: '#fff', border: '1px solid #181716', boxShadow: '0 9px 22px rgba(24,23,22,.2)' } }
];

export const radiusPresets = [
  { id: 'square', label: '0', value: 0 },
  { id: 'xs', label: '4', value: 4 },
  { id: 'sm', label: '8', value: 8 },
  { id: 'md', label: '12', value: 12 },
  { id: 'lg', label: '20', value: 20 },
  { id: 'pill', label: 'Pill', value: 999 }
];

export const fontOptions = [
  { label: 'Կայքի հիմնական', value: 'inherit' },
  { label: 'Հայերեն դասական', value: 'Arial Armenian, Arial, sans-serif' },
  { label: 'Նրբագեղ Serif', value: 'Georgia, Times New Roman, serif' },
  { label: 'Ձեռագիր', value: 'SHK Dzeragir, cursive' }
];

const defaultRsvp = {
  title: 'Հաստատեք Ձեր մասնակցությունը',
  description: 'Խնդրում ենք պատասխանել մինչև նշված վերջնաժամկետը։',
  guestPlaceholder: 'Անուն Ազգանուն',
  attendingLabel: 'Կգամ',
  notAttendingLabel: 'Չեմ կարողանա գալ',
  submitLabel: 'Պատասխանել',
  deadline: '',
  askGuestCount: true,
  askMeal: false
};

export const cloneEditorDraft = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

export const prepareEditorDraft = (draft = {}) => ({
  ...cloneEditorDraft(draft),
  colors: { accent: '#d8b98e', text: '#ffffff', overlay: '#202020', ...(draft.colors || {}) },
  gallery: Array.isArray(draft.gallery) ? [...draft.gallery] : [],
  mapLinks: Array.isArray(draft.mapLinks) && draft.mapLinks.length
    ? draft.mapLinks.map((item, index) => ({
      label: item?.label || `Վայր ${index + 1}`,
      time: item?.time || (index === 0 ? draft.eventTime || '' : ''),
      address: item?.address || (index === 0 ? draft.eventLocation || '' : ''),
      url: item?.url || (index === 0 ? draft.mapLink || '' : ''),
      subtitle: item?.subtitle || '',
      icon: item?.icon || 'location',
      visible: item?.visible !== false
    }))
    : [{
      label: 'Վայր 1',
      time: draft.eventTime || '',
      address: draft.eventLocation || '',
      url: draft.mapLink || '',
      subtitle: '',
      icon: 'location',
      visible: true
    }],
  rsvpSettings: { ...defaultRsvp, ...(draft.rsvpSettings || {}) },
  textStyles: {
    names: { fontFamily: 'inherit', fontSize: 0, fontWeight: 400, color: '', lineHeight: 1.05, letterSpacing: 0, align: 'center', italic: false, uppercase: false },
    ...(draft.textStyles || {})
  },
  buttonDesign: { preset: '01', radius: 'pill', ...(draft.buttonDesign || {}) },
  musicEnabled: draft.musicEnabled !== false,
  musicStart: Number(draft.musicStart) || 0,
  musicEnd: Number(draft.musicEnd) || 0,
  heroVisible: draft.heroVisible !== false,
  familyVisible: draft.familyVisible !== false,
  openingVisible: draft.openingVisible !== false,
  receptionVisible: draft.receptionVisible !== false,
  questionsVisible: draft.questionsVisible !== false,
  finalMessageVisible: draft.finalMessageVisible !== false
});

export const splitNames = (value = '') => {
  const normalized = String(value).replace(/\s*(?:&|\+|և|եւ|,|\/)\s*/gi, '|');
  let parts = normalized.split('|').map((item) => item.trim()).filter(Boolean);
  if (parts.length < 2) {
    const words = String(value).trim().split(/\s+/).filter(Boolean);
    parts = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [words[0] || '', ''];
  }
  return [parts[0] || '', parts.slice(1).join(' ') || ''];
};
