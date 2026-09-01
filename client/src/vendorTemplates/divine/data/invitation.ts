// @ts-nocheck
/**
 * Amulet — Baptism invitation content.
 * All editable fields live here so the Amulet editor can patch this object
 * without touching presentation components.
 */

import baby1 from "@/assets/baby-1.jpg";
import baby2 from "@/assets/baby-2.jpg";
import baby3 from "@/assets/baby-3.jpg";
import church from "@/assets/church.jpg";

export type TimelineItem = {
  time: string;
  title: string;
  icon: "guests" | "cross" | "blessing" | "reception" | "feast";
};

export type DetailItem = {
  label: string;
  value: string;
  icon: "calendar" | "clock" | "church" | "pin" | "hall" | "dove";
};

export type GalleryItem = {
  src: string;
  alt: string;
};

export const invitation = {
  babyName: "Դավիթ",
  mainTitle: "Մեր փոքրիկի մկրտությունը",
  heroDescription:
    "Սիրով հրավիրում ենք Ձեզ մասնակցելու մեր փոքրիկի մկրտության արարողությանը",
  heroSubtitle: "Այս օրհնյալ օրը մեզ համար ավելի ջերմ կլինի Ձեր ներկայությամբ",
  dateLabel: "20 Սեպտեմբերի, 2026",
  scrollHint: "Սահեցրեք ներքև",

  /** ISO date-time of the ceremony — drives countdown + calendar */
  eventISO: "2026-09-20T14:00:00+04:00",
  eventEndISO: "2026-09-20T20:00:00+04:00",
  calendarTitle: "Դավիթի Մկրտություն",
  calendarMonthLabel: "Սեպտեմբեր 2026",
  calendarDayLabel: "Սեպտեմբեր 20, 2026",

  details: [
    { label: "Ամսաթիվ", value: "20 Սեպտեմբերի, 2026", icon: "calendar" },
    { label: "Ժամ", value: "14:00", icon: "clock" },
    { label: "Եկեղեցի", value: "Սուրբ Գայանե Եկեղեցի", icon: "church" },
    { label: "Հասցե", value: "Էջմիածին, Հայաստան", icon: "pin" },
    { label: "Խնջույքի Վայրը", value: "Royal Hall", icon: "hall" },
    { label: "Կնքահայրեր", value: "Արամ և Անահիտ", icon: "dove" },
  ] satisfies DetailItem[],

  timeline: [
    { time: "13:30", title: "Հյուրերի ժամանում", icon: "guests" },
    { time: "14:00", title: "Մկրտության արարողություն", icon: "cross" },
    { time: "15:00", title: "Օրհնություն և լուսանկարներ", icon: "blessing" },
    { time: "16:00", title: "Տոնական ընդունելություն", icon: "reception" },
    { time: "18:00", title: "Հյուրասիրություն և տոնակատարություն", icon: "feast" },
  ] satisfies TimelineItem[],

  familyMessageTitle: "Սիրով Սպասում Ենք Ձեզ",
  familyMessage:
    "Այս օրը շատ կարևոր և օրհնյալ է մեր ընտանիքի համար, և մենք մեծ սիրով հրավիրում ենք Ձեզ կիսելու մեզ հետ մեր փոքրիկի մկրտության ուրախությունը։",

  galleryTitle: "Մեր Փոքրիկը",
  gallery: [
    { src: baby1, alt: "Փոքրիկ Դավիթը մոր գրկում" },
    { src: baby2, alt: "Փոքրիկի ոտիկները և ոսկե խաչը" },
    { src: baby3, alt: "Քնած փոքրիկը սպիտակ ժանյակի մեջ" },
  ] satisfies GalleryItem[],

  blessing: "«Թող Աստծո օրհնությունն ու լույսը միշտ ուղեկցեն մեր փոքրիկին»",

  location: {
    churchName: "Սուրբ Գայանե Եկեղեցի",
    churchAddress: "Էջմիածին, Հայաստան",
    venueName: "Royal Hall",
    venueAddress: "Էջմիածին, Մաշտոցի փող. 12",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Saint+Gayane+Church+Etchmiadzin",
    image: church,
  },

  footerLine: "Շնորհակալ ենք, որ լինելու եք մեր կարևոր օրվա մի մասը",
  brand: "Ստեղծված է Amulet-ի միջոցով",
};

export type Invitation = typeof invitation;
