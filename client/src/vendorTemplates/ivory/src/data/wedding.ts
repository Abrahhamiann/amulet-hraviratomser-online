import heroImg from "@/assets/hero.jpg";
import brideImg from "@/assets/bride.jpg";
import groomImg from "@/assets/groom.jpg";
import churchImg from "@/assets/church.jpg";
import hallImg from "@/assets/hall.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

/**
 * Central wedding configuration.
 * Everything the Amulet editor should be able to customise lives here.
 */
export const wedding = {
  couple: {
    groom: { name: "Արամ", initial: "Ա", image: groomImg, phone: "+374 91 23 45 67" },
    bride: { name: "Անի", initial: "Ա", image: brideImg, phone: "+374 91 76 54 32" },
  },
  date: {
    iso: "2026-09-12T16:00:00+04:00",
    long: "12 սեպտեմբերի, 2026",
    short: "12.09.2026",
  },
  hero: {
    eyebrow: "Մենք ամուսնանում ենք",
    image: heroImg,
  },
  invitation: {
    title: "Մեծ ուրախությամբ",
    body: "հրավիրում ենք Ձեզ միասին տոնելու մեր նոր կյանքի սկիզբը։",
    note: "Ձեր ներկայությունն էլ ավելի իմաստալից կդարձնի մեր առանձնահատուկ օրը։",
  },
  coupleSection: {
    brideText:
      "Ջերմ, հետաքրքրասեր և անսահման բարի՝ նա, ով սովորական երեկոները հիշողություն է դարձնում։",
    groomText:
      "Հաստատակամ, կենսուրախ ու հոգատար՝ նա, ով յուրաքանչյուր օրը տուն է դարձնում։",
  },
  story: [
    { year: "2019", title: "Առաջին հանդիպումը", text: "Անձրևոտ աշնանային երեկո Երևանում և մի զրույց, որն այդպես էլ չավարտվեց։" },
    { year: "2020", title: "Առաջին ժամադրությունը", text: "Սուրճ լուսաբացին, երկար զբոսանք հին քաղաքում և վաղուց ճանաչելու զգացողություն։" },
    { year: "2024", title: "Ամուսնության առաջարկը", text: "Խաղաղ պատշգամբ Սևանա լճի վերևում, մատանի և շատ հեշտ պատասխան։" },
    { year: "2026", title: "Մեր հարսանիքի օրը", text: "Օրը, որի մասին երազել ենք, և կցանկանանք, որ Դուք մեր կողքին լինեք։" },
  ],
  schedule: [
    { time: "16:00", title: "Պսակադրություն" },
    { time: "18:00", title: "Դիմավորում" },
    { time: "19:00", title: "Ընթրիք" },
    { time: "21:00", title: "Առաջին պար" },
    { time: "23:00", title: "Տոնախմբություն" },
  ],
  venues: [
    {
      id: "ceremony",
      label: "Պսակադրություն",
      name: "Սուրբ Գայանե եկեղեցի",
      time: "16:00",
      address: "Վաղարշապատ, Արմավիրի մարզ, Հայաստան",
      image: churchImg,
      mapUrl: "https://maps.google.com/?q=Saint+Gayane+Church+Vagharshapat",
    },
    {
      id: "reception",
      label: "Հարսանյաց հանդես",
      name: "Դվին Մյուզիք Հոլ",
      time: "18:00",
      address: "Աբովյան 12, Երևան, Հայաստան",
      image: hallImg,
      mapUrl: "https://maps.google.com/?q=Dvin+Music+Hall+Yerevan",
    },
  ],
  gallery: [
    { src: gallery1, alt: "Զույգը՝ մեղմ ցերեկային լույսի ներքո" },
    { src: gallery2, alt: "Հարսանեկան մատանիները փղոսկրագույն կտորի վրա" },
    { src: gallery3, alt: "Հարսանեկան ծաղկեփունջ" },
    { src: gallery4, alt: "Շամպայն և մոմեր հանդիսության սեղանին" },
    { src: heroImg, alt: "Զույգը՝ արևոտ պարտեզում" },
  ],
  dressCode: {
    text: "Ուրախ կլինենք Ձեզ տեսնել էլեգանտ երեկոյան հագուստով։",
    colors: [
      { name: "Փղոսկրագույն", hex: "#F4EEE4" },
      { name: "Շամպայն", hex: "#E4CFA8" },
      { name: "Ավազագույն", hex: "#D3BC9A" },
      { name: "Կավագույն", hex: "#B79274" },
      { name: "Ձիթապտղային", hex: "#8C9179" },
      { name: "Էսպրեսո", hex: "#5B4636" },
    ],
  },
  notes: [
    "Խնդրում ենք ժամանել արարողությունից 15 րոպե առաջ։",
    "Խնդրում ենք խուսափել սպիտակ հագուստից։",
    "Երեխաներին սիրով սպասում ենք։",
  ],
  rsvp: {
    deadline: "1 օգոստոսի, 2026",
    foodOptions: ["Առանց նախընտրության", "Միս", "Ձուկ", "Բուսակերական", "Վեգան"],
  },
  closing: {
    text: "Անհամբեր սպասում ենք այս անմոռանալի օրը Ձեզ հետ տոնելուն։",
  },
  brand: { label: "Հրավերը՝ Amulet-ի կողմից", url: "#" },
} as const;

export type Wedding = typeof wedding;
