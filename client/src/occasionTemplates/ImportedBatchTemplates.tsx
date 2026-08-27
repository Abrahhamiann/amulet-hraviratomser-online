import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';

import HarsaniqFourApp from '../vendorTemplates/harsaniq4/src/App.jsx';
import harsaniqFourStyles from '../vendorTemplates/harsaniq4/src/styles.css?inline';
import harsaniqFourBubble from '../vendorTemplates/harsaniq4/src/assets/fonts/BubbleSans.otf?url';
import harsaniqFourBlackWilliam from '../vendorTemplates/harsaniq4/src/assets/fonts/BlackWilliam.otf?url';
import harsaniqFourCoupleOne from '../vendorTemplates/harsaniq4/src/assets/images/couple-one.jpg';
import harsaniqFourCoupleTwo from '../vendorTemplates/harsaniq4/src/assets/images/couple-two.jpg';

import BaptismOneApp from '../vendorTemplates/knunq1/src/App.jsx';
import baptismOneStyles from '../vendorTemplates/knunq1/src/styles.css?inline';
import baptismOneFont from '../vendorTemplates/knunq1/src/assets/fonts/BubbleSans.otf?url';
import baptismOneBaby from '../vendorTemplates/knunq1/src/assets/images/baby.jpg';
import baptismOneMusic from '../vendorTemplates/knunq1/src/assets/audio/baptism-music.mp3';

import EngagementOneApp from '../vendorTemplates/nshanadrutyun1/src/App.jsx';
import engagementOneStyles from '../vendorTemplates/nshanadrutyun1/src/styles.css?inline';
import engagementOneFont from '../vendorTemplates/nshanadrutyun1/src/assets/fonts/Vrdznagir.otf?url';
import engagementOneCoupleOne from '../vendorTemplates/nshanadrutyun1/src/assets/images/couple-1.jpg';
import engagementOneCoupleTwo from '../vendorTemplates/nshanadrutyun1/src/assets/images/couple-2.jpg';
import engagementOneRestaurant from '../vendorTemplates/nshanadrutyun1/src/assets/images/restaurant.png';
import engagementOneMusic from '../vendorTemplates/nshanadrutyun1/src/assets/audio/music.mp3';

import EngagementTwoApp from '../vendorTemplates/nshanadrutyun2/src/App.jsx';
import engagementTwoStyles from '../vendorTemplates/nshanadrutyun2/src/styles.css?inline';
import engagementTwoFont from '../vendorTemplates/nshanadrutyun2/src/assets/fonts/Vrdznagir.otf?url';
import engagementTwoMountain from '../vendorTemplates/nshanadrutyun2/src/assets/images/couple-mountain.jpg';
import engagementTwoFlowers from '../vendorTemplates/nshanadrutyun2/src/assets/images/couple-flowers.jpg';
import engagementTwoMusic from '../vendorTemplates/nshanadrutyun2/src/assets/audio/invitation-song.mp3';

import EngagementThreeApp from '../vendorTemplates/nshanadrutyun3/src/App.jsx';
import engagementThreeStyles from '../vendorTemplates/nshanadrutyun3/src/styles.css?inline';
import engagementThreeFont from '../vendorTemplates/nshanadrutyun3/src/assets/fonts/BubbleSans.otf?url';
import engagementThreeCoupleOne from '../vendorTemplates/nshanadrutyun3/src/assets/images/couple-1.jpg';
import engagementThreeCoupleTwo from '../vendorTemplates/nshanadrutyun3/src/assets/images/couple-2.jpg';
import engagementThreeCoupleThree from '../vendorTemplates/nshanadrutyun3/src/assets/images/couple-3.jpg';
import engagementThreeCoupleFour from '../vendorTemplates/nshanadrutyun3/src/assets/images/couple-4.jpg';
import engagementThreeCoupleFive from '../vendorTemplates/nshanadrutyun3/src/assets/images/couple-5.jpg';
import engagementThreeRestaurant from '../vendorTemplates/nshanadrutyun3/src/assets/images/restaurant.png';

import LastBellApp from '../vendorTemplates/verjinzang1/src/App.jsx';
import lastBellStyles from '../vendorTemplates/verjinzang1/src/styles.css?inline';
import lastBellFont from '../vendorTemplates/verjinzang1/src/assets/fonts/davel-aghvor.otf?url';
import lastBellHero from '../vendorTemplates/verjinzang1/src/assets/bell-photo.jpg';
import lastBellSchool from '../vendorTemplates/verjinzang1/src/assets/school.jpg';
import lastBellVenue from '../vendorTemplates/verjinzang1/src/assets/venue.jpg';
import lastBellMusic from '../vendorTemplates/verjinzang1/src/assets/verjin-zang.mp3';
import fallbackWeddingMusic from '../assets/audio/ed-sheeran-perfect.mp3';

import { OriginalTemplateSurface, TemplateShell } from './OriginalTypeScriptTemplates.tsx';
import { resolveTemplateImage, templateDefaultGalleryIds } from './templateAssets.js';

type Venue = { id?: string; label?: string; time?: string; address?: string; url?: string; visible?: boolean };
type Draft = {
  mainNames?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventMessage?: string;
  image?: string;
  gallery?: string[];
  mapLinks?: Venue[];
  musicEnabled?: boolean;
  musicUrl?: string;
  musicTitle?: string;
  musicStart?: number;
  musicEnd?: number;
  colors?: { accent?: string; text?: string; overlay?: string };
  colorPaletteId?: string;
  heroVisible?: boolean;
  receptionVisible?: boolean;
  questionsVisible?: boolean;
  dressCodeVisible?: boolean;
  dressCode?: string;
  dressCodeColors?: Array<{ name?: string; hex?: string }>;
  rsvpSettings?: {
    title?: string;
    description?: string;
    deadline?: string;
    guestPlaceholder?: string;
    attendingLabel?: string;
    notAttendingLabel?: string;
    submitLabel?: string;
    askGuestCount?: boolean;
  };
};
type TemplateProps = {
  draft?: Draft;
  mode?: 'preview' | 'public' | 'studio';
  price?: number;
  loading?: boolean;
  onHome?: () => void;
  onEdit?: () => void;
  onOrder?: () => void;
  onRsvpSubmit?: (payload: Record<string, unknown>) => Promise<unknown> | unknown;
};
type Spec = {
  key: string;
  label: string;
  kind: 'couple' | 'single';
  css: string;
  fontImport: string;
  globalFonts: string;
  Component: ComponentType<any>;
  aliases: Partial<Record<'accent' | 'text' | 'overlay', string[]>>;
  defaults: {
    mainNames: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventMessage: string;
    venues: Venue[];
    images: string[];
    musicUrl: string;
    musicTitle: string;
    dressCode?: string;
    dressCodeColors?: Array<{ name: string; hex: string }>;
    rsvpTitle: string;
    rsvpDescription: string;
    rsvpDeadline: string;
  };
  supplementalMusic?: boolean;
};

const stripFontFaces = (css: string) => css.replace(/@font-face\s*\{[\s\S]*?\}/g, '');
const armenianMonths = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
const splitNames = (value = '') => value.split(/\s*(?:&|և|\+|,|\/|·)\s*/).map((part) => part.trim()).filter(Boolean);
const shortDate = (value: string) => {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}.${month}.${year}` : value;
};
const countdownValues = (date: string, time: string) => {
  const diff = Math.max(0, new Date(`${date}T${time || '18:00'}:00+04:00`).getTime() - Date.now());
  return [
    String(Math.floor(diff / 86400000)).padStart(2, '0'),
    String(Math.floor((diff / 3600000) % 24)).padStart(2, '0'),
    String(Math.floor((diff / 60000) % 60)).padStart(2, '0'),
    String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
  ];
};

const SPECS: Record<string, Spec> = {
  'love-map-wedding': {
    key: 'love-map-wedding', label: 'Love Map wedding invitation', kind: 'couple',
    css: stripFontFaces(harsaniqFourStyles),
    fontImport: ":host{--font-body:'BubbleSans',Arial,sans-serif;--font-display:'BubbleSans',Arial,sans-serif;--foreground:#171513;--background:#efe8df;font-size:16px;line-height:normal}",
    globalFonts: `@font-face{font-family:"BubbleSans";src:url("${harsaniqFourBubble}") format("opentype");font-display:swap}@font-face{font-family:"BlackWilliam";src:url("${harsaniqFourBlackWilliam}") format("opentype");font-display:swap}`,
    Component: HarsaniqFourApp, aliases: { accent: ['--red', '--red-dark'], text: ['--ink'], overlay: ['--paper', '--paper-soft', '--white'] }, supplementalMusic: true,
    defaults: {
      mainNames: 'Աննա & Արմեն', eventDate: '2027-08-27', eventTime: '17:00', eventLocation: '«ՎԱՆ» ռեստորան',
      eventMessage: 'Սիրով հրավիրում ենք Ձեզ կիսելու մեզ հետ մեր կյանքի ամենակարևոր օրը։ Ձեր ներկայությունը մեր տոնին կտա այն ջերմությունը, որը ցանկանում ենք հիշել ամբողջ կյանքում։',
      venues: [
        { label: 'Պսակադրություն', time: '15:00', address: 'Սուրբ Գրիգոր Նարեկացի եկեղեցի, Վանաձոր', url: 'https://maps.google.com', visible: true },
        { label: 'Հյուրերի դիմավորում', time: '16:30', address: '«ՎԱՆ» ռեստորան, Վանաձոր, Աբովյան 104', url: 'https://maps.google.com', visible: true },
        { label: 'Հարսանեկան խնջույք', time: '17:00', address: '«ՎԱՆ» ռեստորան, Վանաձոր', url: 'https://maps.google.com', visible: true }
      ], images: [harsaniqFourCoupleOne, harsaniqFourCoupleTwo], musicUrl: fallbackWeddingMusic, musicTitle: 'Perfect · Wedding Song',
      dressCode: 'Եթե ցանկանում եք՝ ընտրեք հանգիստ, մոնոխրոմ կամ գինեգույն երանգներ։',
      dressCodeColors: [{ name: 'Մուգ', hex: '#2b2220' }, { name: 'Գինի', hex: '#6b4942' }, { name: 'Կարմիր', hex: '#a02f2f' }, { name: 'Վարդ', hex: '#c8897c' }, { name: 'Բեժ', hex: '#d8c9b8' }, { name: 'Կրեմ', hex: '#f4efe8' }],
      rsvpTitle: 'Հաստատեք Ձեր ներկայությունը', rsvpDescription: 'Խնդրում ենք պատասխանել մինչև', rsvpDeadline: '20.08.2027'
    }
  },
  'angelic-baptism': {
    key: 'angelic-baptism', label: 'Angelic baptism invitation', kind: 'single',
    css: stripFontFaces(baptismOneStyles),
    fontImport: ":host{--font-body:'BubbleSans',Arial,sans-serif;--font-display:'BubbleSans',Arial,sans-serif;--foreground:#26221f;--background:#eee5dc;font-size:16px;line-height:normal}",
    globalFonts: `@font-face{font-family:"BubbleSans";src:url("${baptismOneFont}") format("opentype");font-display:swap}`,
    Component: BaptismOneApp, aliases: { accent: ['--beige', '--beige-dark'], text: ['--ink'], overlay: ['--paper', '--paper-light', '--white'] },
    defaults: {
      mainNames: 'Մարիա', eventDate: '2027-10-22', eventTime: '15:00', eventLocation: 'Սուրբ Գրիգոր Լուսավորիչ մայր եկեղեցի',
      eventMessage: 'Մեզ հետ կիսելու Մարիայի կյանքի այս լուսավոր ու օրհնված օրը՝ Սուրբ Մկրտության խորհուրդը։ Ձեր ներկայությունը մեր տոնը կդարձնի ավելի ջերմ և հիշարժան։',
      venues: [
        { label: 'Սուրբ Մկրտություն', time: '15:00', address: 'Սուրբ Գրիգոր Լուսավորիչ մայր եկեղեցի, ք. Երևան, Երվանդ Քոչարի փ.', url: 'https://maps.google.com', visible: true },
        { label: 'Տոնական ընթրիք', time: '17:00', address: 'DVIN MUSIC HALL, ք. Երևան, Պարոնյան 40', url: 'https://maps.google.com', visible: true }
      ], images: [baptismOneBaby], musicUrl: baptismOneMusic, musicTitle: 'Baptism Music',
      dressCode: 'Սիրով խնդրում ենք տոնին ներկայանալ խաղաղ, բաց և նուրբ երանգներով։ Ամենաթանկ նվերը մեզ համար Ձեր ներկայությունն ու օրհնությունն է։',
      dressCodeColors: [{ name: 'Անտրացիտ', hex: '#2f3031' }, { name: 'Մոխրագույն', hex: '#6a6562' }, { name: 'Թոփ', hex: '#9b8f87' }, { name: 'Բեժ', hex: '#c8aa96' }, { name: 'Կրեմ', hex: '#e4d2c1' }, { name: 'Փղոսկր', hex: '#f6f0e9' }],
      rsvpTitle: 'Հաստատեք Ձեր ներկայությունը', rsvpDescription: 'Խնդրում ենք պատասխանել մինչև', rsvpDeadline: '01.10.2027'
    }
  },
  'polaroid-engagement': {
    key: 'polaroid-engagement', label: 'Polaroid engagement invitation', kind: 'couple',
    css: stripFontFaces(engagementOneStyles),
    fontImport: ":host{--font-body:'Vrdznagir',Arial,sans-serif;--font-display:'Vrdznagir',Arial,sans-serif;--foreground:#26211e;--background:#f5f0e9;font-size:16px;line-height:normal}",
    globalFonts: `@font-face{font-family:"Vrdznagir";src:url("${engagementOneFont}") format("opentype");font-display:swap}`,
    Component: EngagementOneApp, aliases: { accent: ['--gold'], text: ['--ink'], overlay: ['--paper', '--paper2'] },
    defaults: {
      mainNames: 'Տիգրան & Լիլիթ', eventDate: '2027-09-12', eventTime: '18:00', eventLocation: 'Afina Hall by Palladium',
      eventMessage: 'Մեզ համար շատ կարևոր է այս գեղեցիկ օրը կիսել այն մարդկանց հետ, ովքեր մեր կողքին են եղել ամենաջերմ պահերին։ Սիրով հրավիրում ենք Ձեզ մեր նշանադրության տոնին։',
      venues: [{ label: 'Նշանադրության հանդիսություն', time: '18:00', address: 'Afina Hall by Palladium, ք. Երևան, Գլինկա 17/5', url: 'https://maps.google.com', visible: true }],
      images: [engagementOneCoupleOne, engagementOneCoupleTwo, engagementOneRestaurant], musicUrl: engagementOneMusic, musicTitle: 'Engagement Music',
      rsvpTitle: 'Կսպասենք Ձեր պատասխանին', rsvpDescription: 'Խնդրում ենք հաստատել ներկայությունը մինչև', rsvpDeadline: '01.09.2027'
    }
  },
  'golden-heart-engagement': {
    key: 'golden-heart-engagement', label: 'Golden Heart engagement invitation', kind: 'couple',
    css: stripFontFaces(engagementTwoStyles),
    fontImport: ":host{--font-body:'Vrdznagir','Segoe UI',Arial,sans-serif;--font-display:'Vrdznagir','Segoe UI',Arial,sans-serif;--foreground:#342519;--background:#f7f3ea;font-size:16px;line-height:normal}",
    globalFonts: `@font-face{font-family:"Vrdznagir";src:url("${engagementTwoFont}") format("opentype");font-display:swap}`,
    Component: EngagementTwoApp, aliases: { accent: ['--gold', '--gold-soft'], text: ['--ink'], overlay: ['--paper', '--paper-deep', '--white'] },
    defaults: {
      mainNames: 'Արտավազդ & Անի', eventDate: '2027-09-10', eventTime: '18:00', eventLocation: 'Dvin Music Hall',
      eventMessage: 'Սիրելի՛ հարազատներ և ընկերներ, մեր կյանքի ամենանուրբ «այո»-ներից մեկը ցանկանում ենք նշել հենց Ձեզ հետ։ Սիրով հրավիրում ենք մեր նշանադրության երեկոյին։',
      venues: [{ label: 'Նշանադրության երեկո', time: '18:00', address: 'Dvin Music Hall, ք. Երևան, Պարոնյան 40', url: 'https://maps.google.com/?q=Dvin+Music+Hall+Yerevan', visible: true }],
      images: [engagementTwoMountain, engagementTwoFlowers], musicUrl: engagementTwoMusic, musicTitle: 'Invitation Song',
      dressCode: 'Հագուստի համար առաջարկում ենք հանգիստ, բնական և տոնական երանգներ։',
      dressCodeColors: [{ name: 'Ivory', hex: '#f1eadf' }, { name: 'Champagne', hex: '#d7c7ae' }, { name: 'Taupe', hex: '#b9a58d' }, { name: 'Dusty rose', hex: '#a7837b' }, { name: 'Մուգ', hex: '#5d5149' }],
      rsvpTitle: 'Սպասելու ենք Ձեր պատասխանին', rsvpDescription: 'Լրացրեք փոքրիկ ձևը, որպեսզի կարողանանք ամեն ինչ պատրաստել սիրով և ուշադրությամբ։', rsvpDeadline: '03.09.2027'
    }
  },
  'cinematic-engagement': {
    key: 'cinematic-engagement', label: 'Cinematic engagement invitation', kind: 'couple',
    css: stripFontFaces(engagementThreeStyles),
    fontImport: ":host{--font-body:'Bubble Sans',Arial,sans-serif;--font-display:'Bubble Sans',Arial,sans-serif;--foreground:#1b1715;--background:#fbf5eb;font-size:16px;line-height:normal}",
    globalFonts: `@font-face{font-family:"Bubble Sans";src:url("${engagementThreeFont}") format("opentype");font-display:swap}`,
    Component: EngagementThreeApp, aliases: { accent: ['--wine', '--wine-deep', '--wine-soft', '--gold'], text: ['--ink'], overlay: ['--paper', '--cream'] }, supplementalMusic: true,
    defaults: {
      mainNames: 'Կարեն & Աննա', eventDate: '2027-09-05', eventTime: '18:00', eventLocation: 'DVIN MUSIC HALL',
      eventMessage: 'Մեր պատմության ամենագեղեցիկ էջերից մեկը ցանկանում ենք սկսել Ձեր ներկայությամբ։ Սիրով հրավիրում ենք միասին նշելու մեր նշանադրության օրը։',
      venues: [
        { label: 'Հյուրերի դիմավորում', time: '18:00', address: 'DVIN MUSIC HALL, ք․ Երևան, Պարոնյան 40', url: 'https://maps.google.com', visible: true },
        { label: 'Նշանադրության արարողություն', time: '18:30', address: '', url: '', visible: true },
        { label: 'Ընթրիք և կենացներ', time: '19:00', address: '', url: '', visible: true },
        { label: 'Երաժշտություն և պար', time: '21:00', address: '', url: '', visible: true }
      ], images: [engagementThreeCoupleOne, engagementThreeCoupleTwo, engagementThreeCoupleThree, engagementThreeCoupleFour, engagementThreeCoupleFive, engagementThreeRestaurant],
      musicUrl: fallbackWeddingMusic, musicTitle: 'Perfect · Engagement Song', dressCode: 'Ուրախ կլինենք, եթե Ձեր կերպարում օգտագործեք այս գունապնակին մոտ երանգներ։',
      dressCodeColors: [{ name: 'Մուգ', hex: '#160708' }, { name: 'Գինի', hex: '#4b1118' }, { name: 'Բորդո', hex: '#71131f' }, { name: 'Վարդ', hex: '#9e4d50' }, { name: 'Բեժ', hex: '#ddcfc1' }],
      rsvpTitle: 'Կլինե՞ք մեզ հետ', rsvpDescription: 'Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև', rsvpDeadline: '01.09.2027'
    }
  },
  'last-bell': {
    key: 'last-bell', label: 'Last Bell graduation invitation', kind: 'single',
    css: stripFontFaces(lastBellStyles),
    fontImport: ":host{--font-body:'Davel Aghvor',Arial,sans-serif;--font-display:'Davel Aghvor',Arial,sans-serif;--foreground:#262622;--background:#f7f6ee;font-size:16px;line-height:normal}",
    globalFonts: `@font-face{font-family:"Davel Aghvor";src:url("${lastBellFont}") format("opentype");font-display:swap}`,
    Component: LastBellApp, aliases: { accent: ['--green', '--green-dark', '--green-light'], text: ['--ink'], overlay: ['--cream', '--cream-2', '--green-soft', '--white'] },
    defaults: {
      mainNames: '9-ի Բ դասարան', eventDate: '2027-05-25', eventTime: '11:00', eventLocation: 'Դպրոցի հանդիսությունների դահլիճ',
      eventMessage: 'Սիրով հրավիրում ենք միասին նշելու մեր «Վերջին զանգը»՝ մի օր, որտեղ կխառնվեն հուզմունքը, շնորհակալությունն ու նոր ճանապարհի սպասումը։',
      venues: [
        { label: 'Ավարտական միջոցառում', time: '11:00', address: 'Մեր դպրոցի հանդիսությունների դահլիճ', url: 'https://www.google.com/maps', visible: true },
        { label: 'Ավարտական խնջույք', time: '17:30', address: '«Afina by Palladium» ռեստորան', url: 'https://www.google.com/maps/search/?api=1&query=Afina+by+Palladium', visible: true }
      ], images: [lastBellHero, lastBellSchool, lastBellVenue], musicUrl: lastBellMusic, musicTitle: 'Վերջին զանգ',
      rsvpTitle: 'ՀԱՐՑԱԹԵՐԹԻԿ', rsvpDescription: 'Խնդրում ենք լրացնել կարճ ձևաթուղթը, որպեսզի կարողանանք ճիշտ կազմակերպել օրը։', rsvpDeadline: ''
    }
  }
};

const buildData = (spec: Spec, draft: Draft) => {
  const names = splitNames(draft.mainNames || spec.defaults.mainNames);
  const date = draft.eventDate || spec.defaults.eventDate;
  const [year, month, day] = date.split('-');
  const gallery = (draft.gallery || []).map(resolveTemplateImage).filter(Boolean);
  const venues = draft.mapLinks?.length ? draft.mapLinks : spec.defaults.venues;
  return {
    names: spec.kind === 'single' ? [draft.mainNames || spec.defaults.mainNames] : [names[0] || splitNames(spec.defaults.mainNames)[0], names[1] || splitNames(spec.defaults.mainNames)[1]],
    date, year, month, day, monthName: armenianMonths[Math.max(0, Number(month) - 1)] || armenianMonths[0],
    time: draft.eventTime || venues[0]?.time || spec.defaults.eventTime,
    eventMessage: draft.eventMessage || spec.defaults.eventMessage,
    venues,
    images: spec.defaults.images.map((fallback, index) => gallery[index] || (index === 0 ? resolveTemplateImage(draft.image) : '') || fallback),
    musicEnabled: draft.musicEnabled !== false,
    musicUrl: draft.musicUrl || spec.defaults.musicUrl,
    musicStart: Number(draft.musicStart) || 0,
    musicEnd: Number(draft.musicEnd) || 0,
    dressCode: draft.dressCode || spec.defaults.dressCode || '',
    dressCodeVisible: draft.dressCodeVisible !== false,
    dressCodeColors: draft.dressCodeColors?.length ? draft.dressCodeColors : spec.defaults.dressCodeColors || [],
    rsvp: {
      title: draft.rsvpSettings?.title || spec.defaults.rsvpTitle,
      description: draft.rsvpSettings?.description || spec.defaults.rsvpDescription,
      deadline: draft.rsvpSettings?.deadline || spec.defaults.rsvpDeadline,
      guestPlaceholder: draft.rsvpSettings?.guestPlaceholder || 'Ձեր անունը / ազգանունը',
      attendingLabel: draft.rsvpSettings?.attendingLabel || 'Այո, սիրով կմասնակցեմ',
      notAttendingLabel: draft.rsvpSettings?.notAttendingLabel || 'Ցավոք, չեմ կարող մասնակցել',
      submitLabel: draft.rsvpSettings?.submitLabel || 'Ուղարկել',
      askGuestCount: draft.rsvpSettings?.askGuestCount !== false
    }
  };
};

function SupplementalMusic({ enabled, url, start, end }: { enabled: boolean; url: string; start: number; end: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || enabled) return;
    audio.pause();
    setPlaying(false);
  }, [enabled]);
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !enabled) return;
    if (audio.paused) {
      if (audio.currentTime < start || (end > 0 && audio.currentTime >= end)) audio.currentTime = start;
      try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
    } else { audio.pause(); setPlaying(false); }
  };
  return enabled ? <>
    <audio ref={audioRef} src={url} loop preload="metadata" data-amulet-supplemental onTimeUpdate={(event) => {
      const audio = event.currentTarget;
      if (end > 0 && audio.currentTime >= end) audio.currentTime = start;
    }} />
    <button type="button" className={`amulet-import-music${playing ? ' is-playing' : ''}`} onClick={toggle} aria-label={playing ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>
    </button>
  </> : null;
}

const setText = (root: HTMLElement, selector: string, value: unknown, field?: string) => {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) return;
  const next = String(value ?? '');
  if (element.textContent !== next) element.textContent = next;
  if (field) element.dataset.editorField = field;
};
const bindSection = (root: HTMLElement, selector: string, name: string, visible = true) => {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) return;
  element.dataset.editorSection = name;
  element.hidden = !visible;
};
const bindImage = (root: HTMLElement, selector: string, source: string, index: number) => {
  root.querySelectorAll<HTMLImageElement>(selector).forEach((image) => {
    if (source && image.src !== new URL(source, document.baseURI).href) image.src = source;
    image.dataset.templateGalleryIndex = String(index);
    image.dataset.editorHotspotSelf = '';
  });
};
const bindVenue = (root: HTMLElement, item: Element | null, venue: Venue | undefined, index: number, selectors: { label: string; time: string; address: string; link: string }) => {
  if (!(item instanceof HTMLElement)) return;
  item.hidden = !venue || venue.visible === false;
  if (!venue || venue.visible === false) return;
  const label = item.querySelector<HTMLElement>(selectors.label);
  const time = item.querySelector<HTMLElement>(selectors.time);
  const address = item.querySelector<HTMLElement>(selectors.address);
  const link = item.querySelector<HTMLAnchorElement>(selectors.link);
  if (label) {
    const value = venue.label || `Վայր ${index + 1}`;
    if (label.textContent !== value) label.textContent = value;
    label.dataset.editorField = `mapLinks.${index}.label`;
  }
  if (time) {
    const value = venue.time || '';
    if (time.textContent !== value) time.textContent = value;
    time.dataset.editorField = `mapLinks.${index}.time`;
  }
  if (address) {
    const value = venue.address || '';
    if (address.textContent !== value) address.textContent = value;
    address.dataset.editorField = `mapLinks.${index}.address`;
  }
  if (link) { link.href = venue.url || '#'; link.hidden = !venue.url; link.dataset.editorField = `mapLinks.${index}.url`; }
};
const bindImages = (root: HTMLElement, key: string, images: string[]) => {
  if (key === 'love-map-wedding') {
    bindImage(root, '.hero-photo, .large-photo > img:first-child', images[0], 0);
    bindImage(root, '.first-photo > img, .cheers-photo img, .footer > img', images[1], 1);
  } else if (key === 'angelic-baptism') {
    bindImage(root, '.hero-photo, .countdown-photo > img', images[0], 0);
  } else if (key === 'polaroid-engagement') {
    bindImage(root, '.hero-polaroid .polaroid-photo, .photo-left .polaroid-photo', images[0], 0);
    bindImage(root, '.photo-right .polaroid-photo', images[1], 1);
    bindImage(root, '.restaurant', images[2], 2);
  } else if (key === 'golden-heart-engagement') {
    bindImage(root, '.hero-card > img, .details-photo img', images[0], 0);
    bindImage(root, '.photo-panel img', images[1], 1);
  } else if (key === 'cinematic-engagement') {
    images.slice(0, 4).forEach((source, index) => bindImage(root, `.hero-grid figure:nth-child(${index + 1}) img`, source, index));
    [1, 2, 3].forEach((galleryIndex, index) => bindImage(root, `.diagonal-frame:nth-child(${index + 1}) img`, images[galleryIndex], galleryIndex));
    [4, 0, 3, 2].forEach((galleryIndex, index) => bindImage(root, `.slider-window img:nth-child(${index + 1})`, images[galleryIndex], galleryIndex));
    bindImage(root, '.venue-image', images[5], 5);
  } else if (key === 'last-bell') {
    bindImage(root, '.bell-photo', images[0], 0);
    bindImage(root, '.event-card:nth-child(1) .event-image', images[1], 1);
    bindImage(root, '.event-card:nth-child(2) .event-image', images[2], 2);
  }
};

const bindReveal = (root: HTMLElement) => {
  const host = root as HTMLElement & { __amuletRevealObserver?: IntersectionObserver };
  if (!host.__amuletRevealObserver) {
    host.__amuletRevealObserver = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in', 'visible');
        if (!entry.target.classList.contains('route-stop')) activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  }
  root.querySelectorAll<HTMLElement>('.reveal, .venue-reveal').forEach((element) => {
    if (element.dataset.amuletRevealBound === 'true') return;
    element.dataset.amuletRevealBound = 'true';
    host.__amuletRevealObserver?.observe(element);
  });
};
const bindCountdown = (root: HTMLElement, selector: string, date: string, time: string) => {
  const values = countdownValues(date, time);
  root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
    if (index < 4 && element.textContent !== values[index]) element.textContent = values[index];
  });
};
const bindSelectedCalendarDay = (root: HTMLElement, selector: string, day: string) => {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) return;
  const textNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
  if (textNode && textNode.textContent !== day) textNode.textContent = day;
  else if (element.textContent !== day) element.textContent = day;
};
const bindMusic = (root: HTMLElement, data: ReturnType<typeof buildData>) => {
  const audio = root.querySelector<HTMLAudioElement>('audio:not([data-amulet-supplemental])');
  const button = root.querySelector<HTMLElement>('.music-button, .music');
  if (!audio) return;
  const source = data.musicEnabled ? data.musicUrl : '';
  if (source && audio.src !== new URL(source, document.baseURI).href) audio.src = source;
  audio.dataset.musicStart = String(data.musicStart);
  audio.dataset.musicEnd = String(data.musicEnd);
  if (!data.musicEnabled && !audio.paused) audio.pause();
  if (button) { button.hidden = !data.musicEnabled; button.dataset.editorIgnore = 'music'; }
  if ((audio as any).__amuletRangeBound) return;
  (audio as any).__amuletRangeBound = true;
  audio.addEventListener('play', () => {
    const start = Number(audio.dataset.musicStart) || 0;
    if (audio.currentTime < start) audio.currentTime = start;
  });
  audio.addEventListener('timeupdate', () => {
    const end = Number(audio.dataset.musicEnd) || 0;
    if (end > 0 && audio.currentTime >= end) audio.currentTime = Number(audio.dataset.musicStart) || 0;
  });
};
const bindRsvp = (root: HTMLElement, data: ReturnType<typeof buildData>, onSubmit?: TemplateProps['onRsvpSubmit']) => {
  const section = root.querySelector<HTMLElement>('.rsvp-section, .rsvp');
  const form = section?.querySelector<HTMLFormElement>('form');
  if (!section || !form) return;
  section.dataset.editorSection = 'rsvp';
  const heading = section.querySelector<HTMLElement>('h2');
  if (heading) {
    if (heading.textContent !== data.rsvp.title) heading.textContent = data.rsvp.title;
    heading.dataset.editorField = 'rsvpSettings.title';
  }
  const description = section.querySelector<HTMLElement>('.rsvp-note, .rsvp-copy, .rsvp-heading > p:last-child, .rsvp-top > p');
  if (description) {
    const value = [data.rsvp.description, data.rsvp.deadline].filter(Boolean).join(' ');
    if (description.textContent !== value) description.textContent = value;
    description.dataset.editorField = 'rsvpSettings.description';
  }
  const name = form.querySelector<HTMLInputElement>('input[type="text"]');
  if (name) name.placeholder = data.rsvp.guestPlaceholder;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const replaceControlText = (element: HTMLElement | null, value: string) => {
    if (!element) return;
    const directText = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    const target = element.querySelector<HTMLElement>('strong, .choice-label, .option-title') || null;
    if (target) {
      if (target.textContent !== value) target.textContent = value;
    } else if (directText && directText.textContent !== value) directText.textContent = value;
    else if (!directText && element.textContent !== value) element.textContent = value;
  };
  if (submit) {
    replaceControlText(submit, data.rsvp.submitLabel);
    submit.dataset.editorField = 'rsvpSettings.submitLabel';
  }
  const choices = [...form.querySelectorAll<HTMLElement>('button:not([type="submit"]), label')]
    .filter((element) => element.matches('button') || element.querySelector('input[type="radio"]'));
  choices.forEach((choice) => {
    const text = choice.textContent || '';
    if (choice.dataset.editorField === 'rsvpSettings.notAttendingLabel' || (!choice.dataset.editorField && /ցավոք|չեմ|ոչ|\bno\b/i.test(text))) {
      replaceControlText(choice, data.rsvp.notAttendingLabel);
      choice.dataset.editorField = 'rsvpSettings.notAttendingLabel';
    } else if (choice.dataset.editorField === 'rsvpSettings.attendingLabel' || (!choice.dataset.editorField && /այո|սիրով|կմասնակց|\byes\b/i.test(text))) {
      replaceControlText(choice, data.rsvp.attendingLabel);
      choice.dataset.editorField = 'rsvpSettings.attendingLabel';
    }
  });
  const guestCount = form.querySelector<HTMLElement>('input[type="number"], select');
  const guestCountField = guestCount?.closest<HTMLElement>('.field, .form-field, label') || guestCount;
  if (guestCountField) guestCountField.hidden = !data.rsvp.askGuestCount;
  const mutableForm = form as HTMLFormElement & {
    __amuletRsvpBound?: boolean;
    __amuletRsvpSubmit?: TemplateProps['onRsvpSubmit'];
  };
  mutableForm.__amuletRsvpSubmit = onSubmit;
  if (mutableForm.__amuletRsvpBound) return;
  mutableForm.__amuletRsvpBound = true;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const activeButton = form.querySelector<HTMLButtonElement>('.attendance .active, .choice-row .active');
    const checked = form.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    const declined = checked?.value === 'no' || Boolean(activeButton && /ոչ|չեմ|ցավոք/i.test(activeButton.textContent || ''));
    const guestCountField = form.querySelector<HTMLInputElement | HTMLSelectElement>('input[type="number"], select');
    const message = form.querySelector<HTMLTextAreaElement>('textarea')?.value || '';
    await mutableForm.__amuletRsvpSubmit?.({
      guestName: name?.value.trim() || '', guestSide: 'other', status: declined ? 'declined' : 'attending',
      guestCount: declined ? 0 : Number(guestCountField?.value || 1), message: message.trim()
    });
  }, true);
};

const applySpecific = (root: HTMLElement, key: string, data: ReturnType<typeof buildData>, draft: Draft) => {
  const eventVisible = draft.receptionVisible !== false;
  const heroVisible = draft.heroVisible !== false;
  if (key === 'love-map-wedding') {
    bindSection(root, '.hero', 'hero', heroVisible); bindSection(root, '.invite-section', 'opening'); bindSection(root, '.roadmap-section', 'schedule', eventVisible); bindSection(root, '.memory-section', 'dressCode', data.dressCodeVisible);
    setText(root, '.invite-copy h2', `${data.names[0]} & ${data.names[1]}`, 'mainNames');
    setText(root, '.invite-copy > p', data.eventMessage, 'eventMessage');
    setText(root, '.date-line', `${Number(data.day)} ${data.monthName}, ${data.year}`);
    setText(root, '.calendar-title', `${data.monthName.toUpperCase()} ${data.year}`);
    setText(root, '.memory-copy > p', data.dressCode, 'dressCode');
    setText(root, '.footer > p', `${data.names[0]} & ${data.names[1]}`, 'mainNames');
    setText(root, '.footer > small', shortDate(data.date));
    root.querySelectorAll('.route-stop').forEach((item, index) => bindVenue(root, item, data.venues[index], index, { label: 'h3', time: 'strong', address: '.route-card > p', link: 'a' }));
    bindCountdown(root, '.countdown-card .countdown-item strong', data.date, data.time);
    bindSelectedCalendarDay(root, '.calendar-card .selected-day b', String(Number(data.day)));
    root.querySelector<HTMLElement>('.calendar-card')?.setAttribute('data-editor-ignore', 'calendar');
  } else if (key === 'angelic-baptism') {
    bindSection(root, '.hero', 'hero', heroVisible); bindSection(root, '.invitation-section', 'opening'); bindSection(root, '.locations-section', 'schedule', eventVisible); bindSection(root, '.blessing-section', 'dressCode', data.dressCodeVisible);
    setText(root, '.hero-name', data.names[0], 'mainNames'); setText(root, '.footer h2', data.names[0], 'mainNames');
    setText(root, '.invitation-copy > p', data.eventMessage, 'eventMessage');
    setText(root, '.date-emblem span', Number(data.day)); setText(root, '.date-emblem strong', data.monthName.toUpperCase()); setText(root, '.date-emblem small', data.year);
    setText(root, '.blessing-copy > p', data.dressCode, 'dressCode');
    root.querySelectorAll('.event-card').forEach((item, index) => bindVenue(root, item, data.venues[index], index, { label: 'h3', time: '.event-time', address: '.event-copy > p', link: 'a' }));
    bindCountdown(root, '.photo-countdown .countdown-grid strong', data.date, data.time);
  } else if (key === 'polaroid-engagement') {
    bindSection(root, '.hero', 'hero', heroVisible); bindSection(root, '.story', 'opening'); bindSection(root, '.venue-section', 'schedule', eventVisible); bindSection(root, '.gallery', 'media');
    setText(root, '.names span:first-child', data.names[0], 'mainName.0'); setText(root, '.names span:last-child', data.names[1], 'mainName.1');
    setText(root, '.story-copy > p:last-child', data.eventMessage, 'eventMessage'); setText(root, '.hero-date', shortDate(data.date));
    setText(root, '.calendar-section > h2', data.monthName.toUpperCase()); setText(root, '.footer h2', `${data.names[0]} & ${data.names[1]}`, 'mainNames'); setText(root, '.footer > span', shortDate(data.date));
    bindVenue(root, root.querySelector('.venue-section'), data.venues[0], 0, { label: '.venue-script', time: '.venue-time', address: '.venue-address', link: 'a' });
    bindCountdown(root, '.countdown .countdown-grid strong', data.date, data.time);
    bindSelectedCalendarDay(root, '.calendar .selected span', String(Number(data.day)));
    root.querySelector<HTMLElement>('.calendar')?.setAttribute('data-editor-ignore', 'calendar');
  } else if (key === 'golden-heart-engagement') {
    bindSection(root, '.invite-hero', 'hero', heroVisible); bindSection(root, '.story-section', 'opening'); bindSection(root, '.venue-section', 'schedule', eventVisible); bindSection(root, '.details-section', 'dressCode', data.dressCodeVisible);
    setText(root, '.heart-reveal strong', shortDate(data.date)); setText(root, '.gate-names .gate-groom', data.names[0], 'mainName.0'); setText(root, '.gate-names .gate-bride', data.names[1], 'mainName.1');
    setText(root, '.hero-card .hero-groom', data.names[0], 'mainName.0'); setText(root, '.hero-card .hero-bride', data.names[1], 'mainName.1'); setText(root, '.invite-footer h2', `${data.names[0]} & ${data.names[1]}`, 'mainNames');
    setText(root, '.story-copy > p:last-child', data.eventMessage, 'eventMessage'); setText(root, '.hero-date', shortDate(data.date)); setText(root, '.invite-footer > span', shortDate(data.date));
    setText(root, '.date-block > h2', `${data.monthName} ${data.year}`); setText(root, '.details-copy > p:last-of-type', data.dressCode, 'dressCode');
    bindVenue(root, root.querySelector('.venue-card'), data.venues[0], 0, { label: 'h3', time: 'h2', address: '.venue-card > p:not(.section-eyebrow)', link: 'a' });
    bindCountdown(root, '.countdown-section .countdown-item strong', data.date, data.time);
    bindSelectedCalendarDay(root, '.calendar-strip .calendar-heart span', String(Number(data.day)));
    root.querySelector<HTMLElement>('.calendar-strip')?.setAttribute('data-editor-ignore', 'calendar');
  } else if (key === 'cinematic-engagement') {
    bindSection(root, '.hero', 'hero', heroVisible); bindSection(root, '.intro', 'opening'); bindSection(root, '.location-section', 'schedule', eventVisible); bindSection(root, '.dress-section', 'dressCode', data.dressCodeVisible);
    setText(root, '.hero-info .hero-groom', data.names[0], 'mainName.0'); setText(root, '.hero-info .hero-bride', data.names[1], 'mainName.1'); setText(root, '.closing h2', `${data.names[0]} և ${data.names[1]}`, 'mainNames'); setText(root, '.hero-info > p', shortDate(data.date));
    setText(root, '.intro > p:last-child', data.eventMessage, 'eventMessage'); setText(root, '.calendar-section .section-heading-wrap h2', data.monthName.toUpperCase()); setText(root, '.calendar-year', data.year);
    setText(root, '.dress-copy', data.dressCode, 'dressCode');
    bindVenue(root, root.querySelector('.venue-card'), data.venues[0], 0, { label: 'h3', time: '.venue-time', address: '.venue-card > p:last-of-type', link: 'a' });
    root.querySelectorAll<HTMLElement>('.timeline-row').forEach((item, index) => {
      const venue = data.venues[index];
      item.hidden = !venue;
      if (!venue) return;
      setText(item, 'strong', venue.time, `mapLinks.${index}.time`);
      setText(item, 'span', venue.label, `mapLinks.${index}.label`);
    });
    bindCountdown(root, '.countdown .countdown-cell strong', data.date, data.time);
    bindSelectedCalendarDay(root, '.calendar .calendar-cell.selected span', String(Number(data.day)));
    root.querySelector<HTMLElement>('.calendar')?.setAttribute('data-editor-ignore', 'calendar');
  } else if (key === 'last-bell') {
    bindSection(root, '.hero-section', 'hero', heroVisible); bindSection(root, '.welcome-section', 'opening'); bindSection(root, '.events-section', 'schedule', eventVisible);
    setText(root, '.hero-title-wrap > p', data.names[0], 'mainNames'); setText(root, 'footer > p', `Սիրով՝ ${data.names[0]}`, 'mainNames'); setText(root, '.hero-year', data.year);
    setText(root, '.welcome-section .lead', data.eventMessage, 'eventMessage'); setText(root, '.calendar-card h3', `${data.monthName} ${data.year}`);
    root.querySelectorAll('.event-card').forEach((item, index) => bindVenue(root, item, data.venues[index], index, { label: '.event-copy > p', time: '.event-copy > strong', address: '.event-copy > .event-address', link: 'a' }));
    bindCountdown(root, '.countdown-section .countdown-grid strong', data.date, data.time);
    bindSelectedCalendarDay(root, '.calendar-card .calendar-day.active', String(Number(data.day)));
    root.querySelector<HTMLElement>('.calendar-card')?.setAttribute('data-editor-ignore', 'calendar');
  }
  root.querySelectorAll<HTMLElement>('.palette i, .palette span, .dress-code i, .swatches span').forEach((swatch, index) => {
    const color = data.dressCodeColors[index];
    if (!color) return;
    swatch.style.backgroundColor = color.hex || '';
    swatch.dataset.dressColorIndex = String(index);
    swatch.title = color.name || '';
  });
  bindSection(root, '.rsvp-section, .rsvp', 'rsvp', draft.questionsVisible !== false);
};

const IMPORT_ADAPTER_CSS = `
  :host,.original-template-document{width:100%;min-width:0;overflow-x:clip}
  .amulet-import-music{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));z-index:120;width:52px;height:52px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.7);border-radius:50%;background:rgba(20,20,20,.78);color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.2);backdrop-filter:blur(12px);cursor:pointer}
  .amulet-import-music svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .amulet-import-music.is-playing{animation:amulet-import-pulse 2.4s ease-in-out infinite}
  @keyframes amulet-import-pulse{50%{transform:scale(1.06)}}
  @media(prefers-reduced-motion:reduce){.amulet-import-music{animation:none!important}.reveal,.venue-reveal{transition:none!important}}
`;

function ImportedTemplate({ spec, props }: { spec: Spec; props: TemplateProps }) {
  const { draft = {} } = props;
  const data = useMemo(() => buildData(spec, draft), [draft, spec]);
  const hasCustomPalette = Boolean(draft.colorPaletteId && draft.colors?.accent && draft.colors?.text && draft.colors?.overlay);
  const customize = useCallback((root: HTMLDivElement) => {
    bindReveal(root);
    bindImages(root, String(spec.key), data.images);
    applySpecific(root, String(spec.key), data, draft);
    bindMusic(root, data);
    bindRsvp(root, data, props.onRsvpSubmit);
  }, [data, draft, props.onRsvpSubmit, spec.key]);
  const Component = spec.Component;
  const studioCss = props.mode === 'studio' ? '.reveal,.venue-reveal{opacity:1!important;transform:none!important}.route-stop{opacity:1!important;visibility:visible!important;transform:none!important}' : '';
  return <TemplateShell props={props as any}><OriginalTemplateSurface
    css={spec.css} adapterCss={`${IMPORT_ADAPTER_CSS}${studioCss}`} fontImport={spec.fontImport}
    globalFontImport={spec.globalFonts} label={spec.label} draft={draft as any} customize={customize}
    themeVariableAliases={hasCustomPalette ? spec.aliases : undefined}
  >
    <Component forceOpen={props.mode === 'studio'} />
    {spec.supplementalMusic ? <SupplementalMusic enabled={data.musicEnabled} url={data.musicUrl} start={data.musicStart} end={data.musicEnd} /> : null}
  </OriginalTemplateSurface></TemplateShell>;
}

const view = (key: keyof typeof SPECS) => (props: TemplateProps) => <ImportedTemplate spec={SPECS[key]} props={props} />;
const card = (key: keyof typeof SPECS, title: string) => () => <div className="original-template-card-preview"><img src={SPECS[key].defaults.images[0]} alt=""/><div/><span>React template</span><strong>{title}</strong></div>;
const initialDraft = (key: keyof typeof SPECS) => {
  const spec = SPECS[key];
  return {
    mainNames: spec.defaults.mainNames, eventDate: spec.defaults.eventDate, eventTime: spec.defaults.eventTime,
    eventLocation: spec.defaults.eventLocation, eventMessage: spec.defaults.eventMessage,
    image: templateDefaultGalleryIds[spec.key]?.[0] || spec.defaults.images[0], gallery: templateDefaultGalleryIds[spec.key] || spec.defaults.images,
    mapLinks: spec.defaults.venues.map((venue) => ({ ...venue })), colors: {}, colorPaletteId: '',
    musicEnabled: true, musicUrl: spec.defaults.musicUrl, musicTitle: spec.defaults.musicTitle,
    dressCodeVisible: Boolean(spec.defaults.dressCode), dressCode: spec.defaults.dressCode || '',
    dressCodeColors: spec.defaults.dressCodeColors?.map((color) => ({ ...color })) || [],
    rsvpSettings: {
      title: spec.defaults.rsvpTitle, description: spec.defaults.rsvpDescription, deadline: spec.defaults.rsvpDeadline,
      guestPlaceholder: 'Ձեր անունը / ազգանունը', attendingLabel: 'Այո, սիրով կմասնակցեմ',
      notAttendingLabel: 'Ցավոք, չեմ կարող մասնակցել', submitLabel: 'Ուղարկել', askGuestCount: true, askMeal: false
    }
  };
};
const matches = (template: Record<string, unknown> | undefined, aliases: string[]) => {
  const values = [template?.designKey, template?.slug, template?.title].map((value) => String(value || '').trim().toLowerCase());
  return aliases.some((alias) => values.includes(alias.toLowerCase()));
};

export const LoveMapWeddingLivePreview = view('love-map-wedding');
export const LoveMapWeddingInvitationView = (props: TemplateProps) => <ImportedTemplate spec={SPECS['love-map-wedding']} props={{ ...props, mode: 'public' }} />;
export const LoveMapWeddingCardPreview = card('love-map-wedding', 'Սիրո քարտեզ');
export const getLoveMapWeddingDraft = () => initialDraft('love-map-wedding');
export const isLoveMapWeddingTemplate = (template?: Record<string, unknown>) => matches(template, ['love-map-wedding', 'harsaniq4']);

export const AngelicBaptismLivePreview = view('angelic-baptism');
export const AngelicBaptismInvitationView = (props: TemplateProps) => <ImportedTemplate spec={SPECS['angelic-baptism']} props={{ ...props, mode: 'public' }} />;
export const AngelicBaptismCardPreview = card('angelic-baptism', 'Հրեշտակային մկրտություն');
export const getAngelicBaptismDraft = () => initialDraft('angelic-baptism');
export const isAngelicBaptismTemplate = (template?: Record<string, unknown>) => matches(template, ['angelic-baptism', 'knunq1']);

export const PolaroidEngagementLivePreview = view('polaroid-engagement');
export const PolaroidEngagementInvitationView = (props: TemplateProps) => <ImportedTemplate spec={SPECS['polaroid-engagement']} props={{ ...props, mode: 'public' }} />;
export const PolaroidEngagementCardPreview = card('polaroid-engagement', 'Պոլարոիդ նշանադրություն');
export const getPolaroidEngagementDraft = () => initialDraft('polaroid-engagement');
export const isPolaroidEngagementTemplate = (template?: Record<string, unknown>) => matches(template, ['polaroid-engagement', 'nshanadrutyun1']);

export const GoldenHeartEngagementLivePreview = view('golden-heart-engagement');
export const GoldenHeartEngagementInvitationView = (props: TemplateProps) => <ImportedTemplate spec={SPECS['golden-heart-engagement']} props={{ ...props, mode: 'public' }} />;
export const GoldenHeartEngagementCardPreview = card('golden-heart-engagement', 'Ոսկե սիրտ');
export const getGoldenHeartEngagementDraft = () => initialDraft('golden-heart-engagement');
export const isGoldenHeartEngagementTemplate = (template?: Record<string, unknown>) => matches(template, ['golden-heart-engagement', 'nshanadrutyun2']);

export const CinematicEngagementLivePreview = view('cinematic-engagement');
export const CinematicEngagementInvitationView = (props: TemplateProps) => <ImportedTemplate spec={SPECS['cinematic-engagement']} props={{ ...props, mode: 'public' }} />;
export const CinematicEngagementCardPreview = card('cinematic-engagement', 'Կինոժապավեն');
export const getCinematicEngagementDraft = () => initialDraft('cinematic-engagement');
export const isCinematicEngagementTemplate = (template?: Record<string, unknown>) => matches(template, ['cinematic-engagement', 'nshanadrutyun3']);

export const LastBellLivePreview = view('last-bell');
export const LastBellInvitationView = (props: TemplateProps) => <ImportedTemplate spec={SPECS['last-bell']} props={{ ...props, mode: 'public' }} />;
export const LastBellCardPreview = card('last-bell', 'Վերջին զանգ');
export const getLastBellDraft = () => initialDraft('last-bell');
export const isLastBellTemplate = (template?: Record<string, unknown>) => matches(template, ['last-bell', 'verjin-zang-1']);

export const importedBatchTemplateKeys = Object.keys(SPECS);
