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

export const normalizeInvitationGallery = (_image, gallery = []) => (Array.isArray(gallery) ? gallery : [])
  .filter((item, index, items) => item && items.indexOf(item) === index)
  .slice(0, MAX_GALLERY_IMAGES);

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

const templateColorPalettes = {
  midnight: [
    { id: 'midnight-gold', name: 'Կեսգիշերային ոսկի', description: 'Դասական և հանդիսավոր', colors: { accent: '#d8b98e', text: '#ffffff', overlay: '#202020' } },
    { id: 'midnight-champagne', name: 'Շամպայն', description: 'Փափուկ ու լուսավոր', colors: { accent: '#e7cda8', text: '#fffaf1', overlay: '#3a2f29' } },
    { id: 'midnight-burgundy', name: 'Բորդո', description: 'Խորը և ռոմանտիկ', colors: { accent: '#d6a8a0', text: '#fff8f6', overlay: '#4a1823' } },
    { id: 'midnight-emerald', name: 'Զմրուխտ', description: 'Բնական շքեղություն', colors: { accent: '#d1bd82', text: '#f8fff9', overlay: '#123a31' } },
    { id: 'midnight-blue', name: 'Լուսնային կապույտ', description: 'Ժամանակակից և հանգիստ', colors: { accent: '#b9c9e7', text: '#f8fbff', overlay: '#17243d' } },
    { id: 'midnight-plum', name: 'Թագավորական սալոր', description: 'Ճոխ և խորհրդավոր', colors: { accent: '#e0b4d5', text: '#fff8fd', overlay: '#3f203b' } },
    { id: 'midnight-ruby', name: 'Ռուբին և ոսկի', description: 'Տոնական և ազդեցիկ', colors: { accent: '#e5bd78', text: '#fff9f2', overlay: '#5b1725' } },
    { id: 'midnight-onyx', name: 'Օնիքս և վարդագույն ոսկի', description: 'Ժամանակակից շքեղություն', colors: { accent: '#d9a897', text: '#fffaf7', overlay: '#171719' } }
  ],
  engagement: [
    { id: 'engagement-gold', name: 'Այգու ոսկի', description: 'Տաք և բնական', colors: { accent: '#efe4d8', text: '#ffffff', overlay: '#2b211b' } },
    { id: 'engagement-blush', name: 'Վարդագույն շղարշ', description: 'Նուրբ ու ռոմանտիկ', colors: { accent: '#e8b7b0', text: '#fffafa', overlay: '#58343a' } },
    { id: 'engagement-sage', name: 'Եղեսպակ', description: 'Թարմ և հանգիստ', colors: { accent: '#c7d2b1', text: '#fbfff8', overlay: '#35443a' } },
    { id: 'engagement-lavender', name: 'Նարդոս', description: 'Երազային և մեղմ', colors: { accent: '#cdbfe3', text: '#fffaff', overlay: '#443852' } },
    { id: 'engagement-night', name: 'Երեկոյան երկինք', description: 'Խորը և էլեգանտ', colors: { accent: '#d9c48d', text: '#f8fbff', overlay: '#1d2940' } },
    { id: 'engagement-terracotta', name: 'Տեռակոտա', description: 'Ջերմ և արտահայտիչ', colors: { accent: '#e4b18f', text: '#fffaf6', overlay: '#6a382d' } },
    { id: 'engagement-ocean', name: 'Խորը օվկիանոս', description: 'Թարմ և հանդիսավոր', colors: { accent: '#b7d9d6', text: '#f6ffff', overlay: '#19464b' } },
    { id: 'engagement-pearl', name: 'Մարգարտյա վարդ', description: 'Լուսավոր և նրբաճաշակ', colors: { accent: '#c9929e', text: '#563a42', overlay: '#faeff1' } }
  ],
  baptism: [
    { id: 'baptism-ivory', name: 'Փղոսկր և ոսկի', description: 'Մաքուր ու դասական', colors: { accent: '#d8b98e', text: '#ffffff', overlay: '#241f1a' } },
    { id: 'baptism-sky', name: 'Երկնագույն', description: 'Լուսավոր և խաղաղ', colors: { accent: '#9dc9df', text: '#f8fdff', overlay: '#31566b' } },
    { id: 'baptism-rose', name: 'Փոշոտ վարդ', description: 'Ջերմ ու նուրբ', colors: { accent: '#d8aaa7', text: '#fffafa', overlay: '#624447' } },
    { id: 'baptism-sage', name: 'Բաց եղեսպակ', description: 'Բնական և մեղմ', colors: { accent: '#b8c6a1', text: '#fbfff8', overlay: '#465342' } },
    { id: 'baptism-pearl', name: 'Մարգարտյա մոխրագույն', description: 'Չեզոք և ժամանակակից', colors: { accent: '#d8d2c7', text: '#ffffff', overlay: '#45484d' } },
    { id: 'baptism-lavender', name: 'Օրհնված նարդոս', description: 'Նուրբ և խաղաղ', colors: { accent: '#c8b5dc', text: '#fffaff', overlay: '#4d415f' } },
    { id: 'baptism-navy', name: 'Թագավորական կապույտ', description: 'Խոր և հանդիսավոր', colors: { accent: '#d8bd7e', text: '#f8fbff', overlay: '#1d3557' } },
    { id: 'baptism-champagne', name: 'Շամպայն և կրեմ', description: 'Լուսավոր շքեղություն', colors: { accent: '#bd9563', text: '#544638', overlay: '#fbf4e8' } }
  ],
  sacred: [
    { id: 'sacred-ivory', name: 'Փղոսկր և ոսկի', description: 'Մաքուր և դասական', colors: { accent: '#b89262', text: '#47382a', overlay: '#f5eee4' } },
    { id: 'sacred-sky', name: 'Երկնային կապույտ', description: 'Լուսավոր և խաղաղ', colors: { accent: '#7faec2', text: '#344f5c', overlay: '#edf6f8' } },
    { id: 'sacred-rose', name: 'Նուրբ վարդագույն', description: 'Ջերմ և քնքուշ', colors: { accent: '#c7928e', text: '#5d4545', overlay: '#faefed' } },
    { id: 'sacred-sage', name: 'Եղեսպակ', description: 'Բնական և մեղմ', colors: { accent: '#879578', text: '#465043', overlay: '#f0f3eb' } },
    { id: 'sacred-pearl', name: 'Մարգարտյա', description: 'Ժամանակակից և չեզոք', colors: { accent: '#aaa399', text: '#4b4946', overlay: '#f2f1ee' } },
    { id: 'sacred-lavender', name: 'Նարդոսի լույս', description: 'Երազային և քնքուշ', colors: { accent: '#a58abb', text: '#51445d', overlay: '#f3edf8' } },
    { id: 'sacred-emerald', name: 'Զմրուխտյա օրհնություն', description: 'Հարուստ և բնական', colors: { accent: '#c9a868', text: '#f9fff9', overlay: '#24483d' } },
    { id: 'sacred-royal', name: 'Արքայական կապույտ', description: 'Մաքուր և հանդիսավոր', colors: { accent: '#c9ae72', text: '#f8fbff', overlay: '#243b62' } }
  ],
  birthday: [
    { id: 'birthday-blush', name: 'Վարդագույն փայլ', description: 'Նուրբ և տոնական', colors: { accent: '#d99890', text: '#553f4a', overlay: '#faeee9' } },
    { id: 'birthday-lilac', name: 'Յասամանագույն', description: 'Երազային և պայծառ', colors: { accent: '#a68bbd', text: '#51445d', overlay: '#f3edf8' } },
    { id: 'birthday-champagne', name: 'Շամպայն', description: 'Շքեղ և ջերմ', colors: { accent: '#c49a62', text: '#594a39', overlay: '#fbf3e6' } },
    { id: 'birthday-mint', name: 'Թարմ անանուխ', description: 'Թեթև և ուրախ', colors: { accent: '#72a899', text: '#3e5a54', overlay: '#edf8f4' } },
    { id: 'birthday-night', name: 'Տոնական գիշեր', description: 'Խորը և արտահայտիչ', colors: { accent: '#e2b86e', text: '#fff8eb', overlay: '#392f48' } },
    { id: 'birthday-coral', name: 'Կորալային տոն', description: 'Կենսուրախ և ջերմ', colors: { accent: '#ef8b78', text: '#5b3430', overlay: '#fff0e9' } },
    { id: 'birthday-sapphire', name: 'Շափյուղյա գիշեր', description: 'Փայլուն և ճոխ', colors: { accent: '#e6bd63', text: '#f5f9ff', overlay: '#203a69' } },
    { id: 'birthday-ruby', name: 'Ռուբինե տոն', description: 'Համարձակ և տոնական', colors: { accent: '#efb15f', text: '#fff8f3', overlay: '#6a2434' } }
  ],
  ivory: [
    { id: 'ivory-classic', name: 'Դասական փղոսկր', description: 'Նրբաճաշակ և ջերմ', colors: { accent: '#b28b63', text: '#42372e', overlay: '#f2eadf' } },
    { id: 'ivory-olive', name: 'Ձիթապտղի այգի', description: 'Բնական և էլեգանտ', colors: { accent: '#899073', text: '#414638', overlay: '#eff0e8' } },
    { id: 'ivory-rose', name: 'Հին վարդ', description: 'Ռոմանտիկ և մեղմ', colors: { accent: '#b7837f', text: '#57413f', overlay: '#f6ece9' } },
    { id: 'ivory-stone', name: 'Տաք քար', description: 'Չեզոք և ժամանակակից', colors: { accent: '#9d8d7e', text: '#45403b', overlay: '#f0ede9' } },
    { id: 'ivory-espresso', name: 'Էսպրեսո և ոսկի', description: 'Խորը և հանդիսավոր', colors: { accent: '#c4a06c', text: '#fff9ef', overlay: '#49382e' } },
    { id: 'ivory-navy', name: 'Կեսգիշերային կապույտ', description: 'Արիստոկրատ և խորը', colors: { accent: '#d1b071', text: '#f8fbff', overlay: '#20344f' } },
    { id: 'ivory-plum', name: 'Սալոր և շամպայն', description: 'Ռոմանտիկ շքեղություն', colors: { accent: '#d7b77f', text: '#fff9fc', overlay: '#53384e' } },
    { id: 'ivory-forest', name: 'Անտառային ոսկի', description: 'Բնական և հանդիսավոր', colors: { accent: '#d0b36f', text: '#f8fff6', overlay: '#304438' } }
  ]
};

export const getTemplateColorPalettes = (template = {}) => {
  const key = [template.designKey, template.slug, template.title].filter(Boolean).join(' ').toLowerCase();
  if (key.includes('sacred-beginnings')) return templateColorPalettes.sacred;
  if (key.includes('birthday-sparkle')) return templateColorPalettes.birthday;
  if (key.includes('ivory-vows')) return templateColorPalettes.ivory;
  if (key.includes('baptism') || key.includes('մկրտ')) return templateColorPalettes.baptism;
  if (key.includes('engagement') || key.includes('նշան')) return templateColorPalettes.engagement;
  return templateColorPalettes.midnight;
};

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

const defaultDressCodeColors = [
  { name: 'Փղոսկրագույն', hex: '#F4EEE4' },
  { name: 'Շամպայն', hex: '#E4CFA8' },
  { name: 'Ավազագույն', hex: '#D3BC9A' },
  { name: 'Կավագույն', hex: '#B79274' },
  { name: 'Ձիթապտղային', hex: '#8C9179' },
  { name: 'Էսպրեսո', hex: '#5B4636' }
];

let venueSequence = 0;
const createVenueId = () => `venue-${Date.now()}-${venueSequence += 1}`;

export const cloneEditorDraft = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

export const prepareEditorDraft = (draft = {}) => ({
  ...cloneEditorDraft(draft),
  colors: { accent: '#d8b98e', text: '#ffffff', overlay: '#202020', ...(draft.colors || {}) },
  gallery: normalizeInvitationGallery(draft.image, draft.gallery),
  mapLinks: Array.isArray(draft.mapLinks) && draft.mapLinks.length
    ? draft.mapLinks.map((item, index) => ({
      id: item?.id || createVenueId(),
      label: item?.label ?? `Վայր ${index + 1}`,
      time: item?.time ?? (index === 0 ? draft.eventTime ?? '' : ''),
      address: item?.address ?? (index === 0 ? draft.eventLocation ?? '' : ''),
      url: item?.url ?? (index === 0 ? draft.mapLink ?? '' : ''),
      subtitle: item?.subtitle ?? '',
      icon: item?.icon || 'location',
      visible: item?.visible !== false
    }))
    : [{
      id: createVenueId(),
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
  musicUrl: draft.musicUrl || weddingSong,
  musicTitle: draft.musicTitle || 'Ed Sheeran — Perfect',
  musicStart: Number(draft.musicStart) || 0,
  musicEnd: Number(draft.musicEnd) || 0,
  heroVisible: draft.heroVisible !== false,
  familyVisible: draft.familyVisible !== false,
  openingVisible: draft.openingVisible !== false,
  receptionVisible: draft.receptionVisible !== false,
  questionsVisible: draft.questionsVisible !== false,
  finalMessageVisible: draft.finalMessageVisible !== false,
  dressCodeVisible: draft.dressCodeVisible !== false,
  groomFamilyTitle: draft.groomFamilyTitle || '',
  brideFamilyTitle: draft.brideFamilyTitle || '',
  rsvpQuestion: draft.rsvpQuestion || '',
  dressCode: draft.dressCode || '',
  dressCodeColors: Array.isArray(draft.dressCodeColors)
    ? draft.dressCodeColors.slice(0, 8).map((color, index) => ({
      name: String(color?.name || `Color ${index + 1}`),
      hex: /^#[0-9a-f]{6}$/i.test(String(color?.hex || '')) ? color.hex : '#d8b98e'
    }))
    : defaultDressCodeColors.map((color) => ({ ...color })),
  closingMessage: draft.closingMessage ?? 'Սիրով սպասում ենք Ձեզ։'
});

export const splitNames = (value = '') => {
  const normalized = String(value).replace(/\s*(?:&|\+|և|եւ|,|\/)\s*/gi, '|');
  let parts = normalized.split('|').map((item) => item.trim());
  if (normalized.includes('|')) return [parts[0] || '', parts.slice(1).join(' ') || ''];
  parts = parts.filter(Boolean);
  if (parts.length < 2) {
    const words = String(value).trim().split(/\s+/).filter(Boolean);
    parts = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [words[0] || '', ''];
  }
  return [parts[0] || '', parts.slice(1).join(' ') || ''];
};
