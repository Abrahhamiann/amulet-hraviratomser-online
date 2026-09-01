// @ts-nocheck
import { createContext, createElement, useContext, type ReactNode } from "react";
import coupleMain from "../../../assets/morph/engagement-smile.jpg";
import coupleSmall from "../../../assets/morph/wedding-forest-optimized.jpg";
import coupleTiny from "../../../assets/morph/wedding-temple.jpg";

export const invitationData = {
  bride: "Նարե",
  groom: "Դավիթ",
  brideUpper: "ՆԱՐԵ",
  groomUpper: "ԴԱՎԻԹ",

  eventType: "ՆՇԱՆԱԴՐՈՒԹՅՈՒՆ",
  saveTheDate: "ՊԱՀՊԱՆԻՐ ԱՅՍ ՕՐԸ",

  date: "2026-09-12T17:00:00",
  dateShort: "12 · 09 · 2026",
  monthLabel: "ՍԵՊՏԵՄԲԵՐ 2026",
  weekday: "Շաբաթ",
  dayLong: "12 Սեպտեմբերի",
  calendarNote: "մենք սպասելու ենք Ձեզ 🤍",

  heroWhisper: "Սերը սկսվում է մի պարզ «այո»-ից…",

  love: {
    heading: "Սերը դա…",
    phrases: [
      "միասին ծիծաղելն է",
      "միմյանց ընտրելն է ամեն օր",
      "փոքր պահերը մեծ հիշողություններ դարձնելն է",
    ],
    outro: "իսկ մեր պատմության հաջորդ էջը սկսվում է այստեղ։",
  },

  announcement: {
    small: "Մենք որոշեցինք ասել «Այո»",
    big: "ՄԵՆՔ ՆՇԱՆՎՈՒՄ ԵՆՔ",
    paragraphs: [
      "Մեր կյանքում սկսվում է մի նոր ու գեղեցիկ փուլ, և մենք շատ կցանկանանք, որ այդ օրը մեզ հետ կիսեն մեր ամենահարազատ մարդիկ։",
      "Սիրով հրավիրում ենք Ձեզ մեր նշանադրության տոնակատարությանը։",
    ],
  },

  location: {
    heading: "ՈՐՏԵ՞Ղ ԵՆՔ ՀԱՆԴԻՊՈՒՄ",
    name: "The Garden Restaurant",
    city: "ք․ Երևան",
    address: "Աբովյան 00",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Garden+Restaurant+Abovyan+Yerevan",
    buttonLabel: "Բացել քարտեզը",
  },

  timelineHeading: "ԱՅՍՊԵՍ Է ՍԿՍՎԵԼՈՒ ՄԵՐ ԵՐԵԿՈՆ",
  timeline: [
    {
      time: "17:00",
      icon: "glasses" as const,
      title: "Հյուրերի դիմավորում",
      text: "Սպասում ենք Ձեզ ռեստորանի մուտքի մոտ։",
    },
    {
      time: "17:30",
      icon: "rings" as const,
      title: "Նշանադրության արարողություն",
      text: "Այն պահը, երբ պաշտոնապես ասում ենք մեր «Այո»-ն։",
    },
    {
      time: "18:00",
      icon: "dinner" as const,
      title: "Տոնական ընթրիք",
      text: "Համեղ ընթրիք, երաժշտություն և շատ ջերմ խոսքեր։",
    },
    {
      time: "20:00",
      icon: "dance" as const,
      title: "Երաժշտություն և պարեր",
      text: "Պատրաստ եղեք շատ պարելու։",
    },
    {
      time: "22:00",
      icon: "cake" as const,
      title: "Քաղցր ավարտ",
      text: "Տորթ, լուսանկարներ և ևս մի քանի հիշարժան պահ։",
    },
  ],

  gallery: {
    captions: { main: "մենք", small: "մեր պատմությունից", tiny: "2026" },
    images: [coupleMain, coupleSmall, coupleTiny],
  },

  details: {
    heading: "ՓՈՔՐԻԿ ՄԱՆՐՈՒՔՆԵՐ",
    first: {
      lead: "Ձեզ հետ բերեք",
      items: ["ՍԵՐ", "ժպիտներ", "լավ տրամադրություն", "և հարմարավետ կոշիկներ։"],
    },
    second: {
      lead: "Ծաղիկների փոխարեն",
      text: "եթե ցանկանաք, կարող եք մեզ նվիրել մի փոքրիկ հիշարժան բան, որը տարիներ անց մեզ կհիշեցնի այս օրը։",
    },
    third: { lead: "Եվ ամենակարևորը՝", text: "եկեք պատրաստ պարելու։" },
  },

  dressCode: {
    heading: "DRESS CODE",
    subtitle: "Մենք շատ ուրախ կլինենք, եթե Ձեր կերպարում լինեն այս երանգները։",
    note: "նուրբ և բնական",
    swatches: [
      { name: "cream", color: "#F6EFE4" },
      { name: "champagne", color: "#E8D9C0" },
      { name: "beige", color: "#DCC7AF" },
      { name: "dusty rose", color: "#DDBCB5" },
      { name: "warm brown", color: "#A77A64" },
      { name: "sage", color: "#A9B49A" },
    ],
  },

  countdown: {
    heading: "ՄԵՐ ՆՇԱՆԱԴՐՈՒԹՅԱՆԸ ՄՆԱՑԵԼ Է",
    labels: { days: "ՕՐ", hours: "ԺԱՄ", minutes: "ՐՈՊԵ", seconds: "ՎԱՅՐԿՅԱՆ" },
    note: "շուտով կհանդիպենք",
  },

  telegram: {
    heading: "ԵԿԵՔ ՊԱՀԵՆՔ ԲՈԼՈՐ ՀԻՇՈՂՈՒԹՅՈՒՆՆԵՐԸ",
    text: "Մենք ստեղծել ենք Telegram խումբ, որտեղ կարող եք ուղարկել Ձեր նկարներն ու տեսանյութերը և միասին հավաքել այդ օրվա բոլոր հիշողությունները։",
    buttonLabel: "Միանալ Telegram խմբին",
    url: "https://t.me/",
  },

  rsvp: {
    heading: "ԿՀԱՆԴԻՊԵ՞ՆՔ",
    subheading: "Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև սեպտեմբերի 1-ը։",
    nameLabel: "Ձեր անուն / ազգանունը",
    namePlaceholder: "Անուն Ազգանուն",
    attendanceQuestion: "Կկարողանա՞ք ներկա գտնվել մեր նշանադրությանը։",
    attendanceOptions: ["Այո, սիրով կգամ", "Ցավոք, չեմ կարողանա"],
    guestsQuestion: "Քանի՞ հոգով եք գալու։",
    guestsOptions: ["1", "2", "3", "4+"],
    askGuestCount: true,
    messageQuestion: "Կցանկանա՞ք ինչ-որ բան գրել մեզ։",
    submitLabel: "Ուղարկել պատասխանը",
    thanksTitle: "Շնորհակալ ենք 🤍",
    thanksText: "Ձեր պատասխանը պահպանված է։",
    deadline: "2026-09-01",
  },

  closing: {
    big: "ՍՊԱՍՈՒՄ ԵՆՔ ՁԵԶ",
    names: "Նարե & Դավիթ",
    note: "սիրով՝ մենք",
  },

  musicUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=piano-moment-9835.mp3",
};

export type InvitationData = typeof invitationData;

const InvitationDataContext = createContext<InvitationData>(invitationData);

export function InvitationDataProvider({ data, children }: { data: InvitationData; children: ReactNode }) {
  return createElement(InvitationDataContext.Provider, { value: data }, children);
}

export const useInvitationData = () => useContext(InvitationDataContext);
