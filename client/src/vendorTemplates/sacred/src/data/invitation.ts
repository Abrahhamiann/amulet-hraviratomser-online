import childPortrait from "@/assets/child-portrait.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

export type GalleryImage = { src: string; alt: string };

export type InvitationData = {
  child: { name: string; portrait: GalleryImage; caption: string };
  hero: { intro: string; dateLabel: string };
  intro: { message: string; subMessage: string };
  event: {
    title: string;
    dateLabel: string;
    timeLabel: string;
    venue: string;
    city: string;
    /** ISO datetime used by the countdown */
    isoDate: string;
    mapUrl: string;
  };
  timeline: { time: string; title: string; note: string }[];
  countdown: { title: string; note: string };
  quote: { text: string; source: string };
  family: {
    parentsLabel: string;
    parents: string;
    godparentsLabel: string;
    godparents: string;
  };
  gallery: GalleryImage[];
  celebration: {
    label: string;
    venue: string;
    city: string;
    timeLabel: string;
    mapUrl: string;
    directionsUrl: string;
  };
  rsvp: {
    heading: string;
    description: string;
    deadline: string;
    guestPlaceholder?: string;
    attendingLabel?: string;
    notAttendingLabel?: string;
    submitLabel?: string;
    askGuestCount?: boolean;
    askMeal?: boolean;
  };
  closing: { signature: string; message: string; familyName: string };
};

export const invitation: InvitationData = {
  child: {
    name: "Ալեքսանդր",
    portrait: { src: childPortrait, alt: "Փոքրիկ Ալեքսանդրը՝ մկրտության հանդերձանքով" },
    caption: "Մեր փոքրիկ օրհնությունը",
  },
  hero: {
    intro: "Սիրով և հավատով\nհրավիրում ենք Ձեզ մեր փոքրիկի մկրտությանը՝",
    dateLabel: "20 սեպտեմբերի, 2026",
  },
  intro: {
    message: "Գեղեցիկ նոր էջ է բացվում՝ լի հավատով, սիրով և օրհնությամբ։",
    subMessage:
      "Միացե՛ք մեզ, երբ մեր փոքրիկը ստանա մկրտության օրհնությունը՝ իրեն ամենաշատը սիրող մարդկանց շրջապատում։",
  },
  event: {
    title: "Մկրտության արարողություն",
    dateLabel: "20 սեպտեմբերի, 2026",
    timeLabel: "14:00",
    venue: "Սուրբ Գրիգոր եկեղեցի",
    city: "Երևան, Հայաստան",
    isoDate: "2026-09-20T14:00:00+04:00",
    mapUrl: "https://maps.google.com/?q=Saint+Gregory+Church+Yerevan",
  },
  timeline: [
    { time: "14:00", title: "Մկրտության արարողություն", note: "Սուրբ Գրիգոր եկեղեցի" },
    { time: "16:00", title: "Ընտանեկան տոնախմբություն", note: "Լուսանկարներ և օրհնություններ" },
    { time: "17:00", title: "Ընթրիք և բարեմաղթանքներ", note: "«Գարդեն» ռեստորան" },
  ],
  countdown: {
    title: "Մինչև օրհնված օրը",
    note: "Սպասում ենք յուրաքանչյուր վայրկյանին։",
  },
  quote: {
    text: "Ամեն բարի և կատարյալ պարգև վերևից է։",
    source: "Հակոբոս 1։17",
  },
  family: {
    parentsLabel: "Ծնողներ",
    parents: "Միքայել և Աննա",
    godparentsLabel: "Կնքահայր և կնքամայր",
    godparents: "Դավիթ և Մարիա",
  },
  gallery: [
    { src: gallery1, alt: "Փոքրիկի ձեռքերը ծնողների ափերի մեջ" },
    { src: gallery2, alt: "Մկրտության ավազան և մոմ եկեղեցում" },
    { src: gallery3, alt: "Քնած փոքրիկը բաց գույնի ծածկոցով" },
    { src: gallery4, alt: "Ձիթենու ճյուղեր և մոմ" },
    { src: gallery5, alt: "Մայրիկը գրկել է փոքրիկին" },
  ],
  celebration: {
    label: "Տոնական ընթրիք",
    venue: "«Գարդեն» ռեստորան",
    city: "Երևան",
    timeLabel: "17:00",
    mapUrl: "https://maps.google.com/?q=The+Garden+Restaurant+Yerevan",
    directionsUrl: "https://maps.google.com/maps/dir/?api=1&destination=The+Garden+Restaurant+Yerevan",
  },
  rsvp: {
    heading: "Կտոնե՞ք մեզ հետ",
    description:
      "Խնդրում ենք տեղեկացնել՝ կկարողանա՞ք մեզ միանալ այս առանձնահատուկ օրը։",
    deadline: "Խնդրում ենք պատասխանել մինչև 1 սեպտեմբերի, 2026",
  },
  closing: {
    signature: "Սիրով՝",
    familyName: "Պետրոսյան ընտանիք",
    message: "Անհամբեր սպասում ենք այս օրհնված օրը Ձեզ հետ կիսելուն։",
  },
};
