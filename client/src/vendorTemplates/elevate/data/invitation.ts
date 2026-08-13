/**
 * AMULET — Corporate Invitation template content.
 *
 * Every field here is editable from the Amulet invitation editor.
 * Presentation components read from this object only, so swapping this
 * object (or hydrating it from an API) fully re-themes the invitation.
 */

import heroBg from "@/assets/hero-bg.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import speaker1 from "@/assets/speaker-1.jpg";
import speaker2 from "@/assets/speaker-2.jpg";
import speaker3 from "@/assets/speaker-3.jpg";
import speaker4 from "@/assets/speaker-4.jpg";
import mapImage from "@/assets/map.jpg";

export type InvitationData = typeof invitation;

export const invitation = {
  brand: {
    companyName: "AMULET",
    /** Replace with an uploaded logo URL; falls back to the monogram mark. */
    logoUrl: "" as string,
    monogram: "A",
    tagline: "ներկայացնում է",
    /** Accent override for per-company theming (any CSS color). */
    accentColor: "" as string,
  },

  hero: {
    eyebrow: "Կորպորատիվ հրավեր",
    title: "Տարեկան կորպորատիվ երեկո",
    subtitle: "Նորարարության, աճի և գործընկերության տոն",
    dateLabel: "18 դեկտեմբերի, 2026",
    locationLabel: "Երևան, Հայաստան",
    cta: "Բացահայտել երեկոն",
    backgroundImage: heroBg,
    invitationNote:
      "Սիրով հրավիրում ենք Ձեզ միանալու մեր բացառիկ երեկոյին։",
  },

  intro: {
    eyebrow: "Հրավեր",
    title: "Դուք հրավիրված եք",
    paragraph:
      "Միացե՛ք մեզ ոգեշնչող երեկոյի ընթացքում՝ միասին նշելու աճի, նորարարության, ձեռքբերումների և արժեքավոր գործընկերությունների ևս մեկ տարին։",
    signature: "Գործադիր խորհուրդ",
  },

  details: {
    eyebrow: "Միջոցառման մանրամասներ",
    title: "Կարևոր տեղեկություններ",
    date: { label: "Ամսաթիվ", value: "18 դեկտեմբերի, 2026", note: "Ուրբաթ" },
    time: { label: "Ժամ", value: "19:00", note: "Դռները բացվում են 18:30-ին" },
    venue: {
      label: "Վայր",
      value: "Դվին Մյուզիք Հոլ",
      note: "Երևան, Հայաստան",
    },
  },

  countdown: {
    eyebrow: "Պահպանեք ամսաթիվը",
    title: "Միջոցառմանը մնացել է",
    /** ISO datetime — drives the live countdown. */
    targetDate: "2026-12-18T19:00:00+04:00",
    finishedLabel: "Երեկոն սկսվել է",
  },

  agenda: {
    eyebrow: "Ծրագիր",
    title: "Երեկոյի ծրագիր",
    items: [
      { time: "18:30", title: "Հյուրերի ժամանում և ողջույնի ըմպելիքներ", description: "Դիմավորում մարմարյա նախասրահում։" },
      { time: "19:00", title: "Բացման արարողություն", description: "Գործադիր խորհրդի ողջույնի խոսքը։" },
      { time: "19:30", title: "Ընկերության ձեռքբերումներ և մրցանակներ", description: "Տարվա ամփոփում և լավագույնների գնահատում։" },
      { time: "20:00", title: "Ընթրիք", description: "Երեք ուտեստից բաղկացած ընթրիք։" },
      { time: "21:00", title: "Ժամանցային ծրագիր", description: "Կենդանի նվագախումբ և հատուկ ելույթ։" },
      { time: "22:00", title: "Շփում և տոնակատարություն", description: "Երաժշտություն, զրույց և հաճելի մթնոլորտ։" },
    ],
  },

  purpose: {
    eyebrow: "Ինչու ենք հավաքվում",
    title: "Տոնելու երեկո",
    items: [
      { icon: "trophy", title: "Ձեռքբերումներ", text: "Նշում ենք հաջողություններով լի ևս մեկ փուլ։" },
      { icon: "users", title: "Մարդիկ", text: "Գնահատում ենք մեր առաջընթացը կերտած մարդկանց։" },
      { icon: "compass", title: "Ապագա", text: "Նայում ենք դեպի նոր հնարավորություններ և գործընկերություններ։" },
    ],
  },

  speakers: {
    eyebrow: "Երեկոյի խոսնակները",
    title: "Խոսնակներ և վարողներ",
    items: [
      { name: "Ալեքսանդր Սմիթ", role: "Գլխավոր գործադիր տնօրեն", company: "Amulet Group", bio: "Բացման խոսք և գալիք տարվա տեսլականը։", photo: speaker1 },
      { name: "Մարիաննա Պետրոսյան", role: "Գլխավոր գործառնական տնօրեն", company: "Amulet Group", bio: "Գործունեության և միջազգային ընդլայնման կարևոր արդյունքները։", photo: speaker2 },
      { name: "Դավիթ Կարլսոն", role: "Նորարարությունների ղեկավար", company: "Amulet Labs", bio: "Մեր հաջորդ տասնամյակը ձևավորող տեխնոլոգիաները։", photo: speaker3 },
      { name: "Լենա Ավետիսյան", role: "Երեկոյի վարող", company: "Amulet Group", bio: "Երեկոյի ծրագրի ուղեկցում։", photo: speaker4 },
    ],
  },

  stats: {
    eyebrow: "Թվերով",
    title: "Տոնելու արժանի տարի",
    items: [
      { value: 10, suffix: "", label: "Տարի միասին" },
      { value: 250, suffix: "+", label: "Իրականացված նախագիծ" },
      { value: 500, suffix: "+", label: "Գործընկեր" },
      { value: 15, suffix: "", label: "Երկիր" },
    ],
  },

  gallery: {
    eyebrow: "Հիշողություններ",
    title: "Միասին անցկացրած պահեր",
    images: [
      { src: gallery1, alt: "Corporate gala dinner hall set for the evening" },
      { src: gallery2, alt: "Team applauding during an award ceremony" },
      { src: gallery3, alt: "Champagne glasses toasting at a corporate evening" },
      { src: gallery4, alt: "Modern office atrium at dusk" },
      { src: gallery5, alt: "Keynote speaker on stage under a spotlight" },
      { src: gallery6, alt: "Golden award trophy on a dark surface" },
    ],
  },

  venue: {
    eyebrow: "Վայր",
    title: "Միջոցառման վայրը",
    name: "Դվին Մյուզիք Հոլ",
    address: "Երևան, Հայաստան",
    directions: "18:00-ից գործում է անվճար ավտոկայանման ծառայություն։",
    mapsUrl: "https://maps.google.com/?q=Dvin+Music+Hall+Yerevan",
    mapImage,
    cta: "Ինչպես հասնել",
  },

  dressCode: {
    eyebrow: "Հագուստ",
    title: "Դրես կոդ",
    code: "Գործնական էլեգանտ",
    note: "Սև փողկապը պարտադիր չէ։ Խնդրում ենք հետևել երեկոյի գունային երանգներին։",
    palette: [
      { name: "Սև", color: "#0b0d12" },
      { name: "Ածխագույն", color: "#31353f" },
      { name: "Փղոսկրագույն", color: "#f3efe6" },
      { name: "Շամպայն", color: "#e2cfa6" },
      { name: "Ոսկեգույն", color: "#c9a227" },
    ],
  },

  rsvp: {
    eyebrow: "RSVP",
    title: "Հաստատեք Ձեր մասնակցությունը",
    subtitle: "Ուրախ կլինենք Ձեզ տեսնել մեր կողքին։",
    deadline: "Խնդրում ենք պատասխանել մինչև 1 դեկտեմբերի, 2026 թ․",
    successTitle: "Շնորհակալություն մասնակցությունը հաստատելու համար։",
    successText: "Անհամբեր սպասում ենք Ձեզ։",
  },

  contact: {
    eyebrow: "Աջակցություն",
    title: "Հարցե՞ր ունեք",
    intro: "Լրացուցիչ տեղեկությունների համար կապ հաստատեք՝",
    name: "Աննա Հակոբյան",
    role: "Միջոցառման համակարգող",
    phone: "+374 10 000 000",
    phoneHref: "tel:+37410000000",
    email: "contact@company.com",
    whatsapp: "https://wa.me/37410000000",
  },

  music: {
    enabled: true,
    label: "Ֆոնային երաժշտություն",
    /** Replace with the company's chosen ambient track. */
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-jazz-piano-110804.mp3",
  },

  finale: {
    title: "Անհամբեր սպասում ենք Ձեզ",
    date: "18 դեկտեմբերի, 2026",
    quote: "Միասին տոնում ենք այսօրը և կերտում վաղը։",
    branding: "Հրավերը ստեղծված է Amulet-ով",
  },
};
