// @ts-nocheck
import hero from "@/assets/hero.jpg";
import bride from "@/assets/bride.jpg";
import groom from "@/assets/groom.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";

/**
 * Amulet template content model.
 * Everything the editor can change lives here — presentation components
 * only read from this object.
 */
export type WeddingConfig = typeof weddingConfig;

export const weddingConfig = {
  couple: {
    bride: { name: "Աննա", role: "Հարսը", photo: bride, note: "Պետրոսյանների ընտանիքի դուստրը" },
    groom: { name: "Դավիթ", role: "Փեսան", photo: groom, note: "Ավետիսյանների ընտանիքի որդին" },
    initials: { left: "A", right: "D" },
  },
  hero: {
    background: hero,
    kicker: "Ամուսնանում են",
    dateLabel: "20 սեպտեմբերի, 2026",
    invitation: "Մեր ընտանիքների հետ միասին սիրով հրավիրում ենք Ձեզ տոնելու մեր սերը։",
    scrollLabel: "Ոլորեք՝ բացահայտելու համար",
  },
  envelope: {
    enabled: true,
    label: "Բացել հրավերը",
    note: "Դուք հրավիրված եք",
  },
  date: {
    iso: "2026-09-20T16:00:00+04:00",
    display: "20 · 09 · 2026",
    long: "20 սեպտեմբերի, 2026",
  },
  story: {
    title: "Մեր պատմությունը",
    intro: "Երկու սիրտ, մեկ ճանապարհ և մի ամբողջ կյանք առջևում։",
    milestones: [
      { year: "2019", title: "Մեր հանդիպումը", text: "Աշնանային մարդաշատ սրահ և մի զրույց, որն այդպես էլ չավարտվեց։", photo: g1 },
      { year: "2022", title: "Մեր առաջին արկածը", text: "Երկու ուսապարկ, մեկ քարտեզ և հիանալի ընկերակցության վստահություն։", photo: g4 },
      { year: "2025", title: "Նա ասաց՝ այո", text: "Խաղաղ երեկո, ոսկե մատանի և մեղմ տրված խոստում։", photo: g2 },
      { year: "2026", title: "Սկսվում է հավերժությունը", text: "Եվ այժմ շատ կցանկանանք, որ այդ պահին Դուք մեր կողքին լինեք։", photo: g5 },
    ],
  },
  ceremony: {
    title: "Պսակադրություն",
    time: "16:00",
    venue: "Սուրբ Աննա եկեղեցի",
    city: "Երևան, Հայաստան",
    mapUrl: "https://maps.google.com/?q=Saint+Anna+Church+Yerevan",
  },
  reception: {
    title: "Տոնակատարություն",
    time: "18:30",
    venue: "Ռոյալ Գարդեն",
    city: "Երևան, Հայաստան",
    note: "Ձեզ սպասում են ընթրիք, երաժշտություն, պարեր և անմոռանալի հիշողություններ։",
    mapUrl: "https://maps.google.com/?q=Royal+Garden+Yerevan",
  },
  timeline: [
    { time: "15:30", title: "Հյուրերի ժամանում" },
    { time: "16:00", title: "Պսակադրություն" },
    { time: "17:30", title: "Դիմավորում" },
    { time: "18:30", title: "Ընթրիք" },
    { time: "20:00", title: "Առաջին պար" },
    { time: "20:30", title: "Տոնակատարություն և պարեր" },
  ],
  gallery: {
    title: "Մեր պահերը",
    images: [
      { src: g1, alt: "Anna and David walking hand in hand in a sunlit garden" },
      { src: g2, alt: "Two gold wedding rings resting on ivory silk" },
      { src: g3, alt: "Bridal bouquet of white roses and eucalyptus" },
      { src: g4, alt: "Candlelit reception table at dusk" },
      { src: g5, alt: "The couple beneath a floral arch" },
      { src: g6, alt: "Blush rose petals on cream silk" },
    ],
  },
  quote: {
    text: "Եվ հանկարծ սիրո բոլոր երգերը քո մասին էին։",
    author: "",
  },
  dressCode: {
    title: "Դրես կոդ",
    value: "Էլեգանտ / Պաշտոնական",
    note: "Ուրախ կլինենք Ձեզ տեսնել մեղմ և դասական երանգներով։",
    swatches: [
      { name: "Փղոսկրագույն", color: "#F6F1E7" },
      { name: "Շամպայն", color: "#E6D6BA" },
      { name: "Բեժ", color: "#D9C7B0" },
      { name: "Նուրբ վարդագույն", color: "#EBD0CC" },
      { name: "Մոխրավարդագույն", color: "#C89C99" },
      { name: "Եղեսպակ", color: "#A8B49C" },
    ],
  },
  rsvp: {
    title: "Կմիանա՞ք մեզ",
    subtitle: "Մեզ համար մեծ պատիվ կլինի այս առանձնահատուկ օրը տոնել Ձեզ հետ։",
    meals: ["Միս", "Ձուկ", "Բուսակերական", "Վեգան"],
    deadline: "Խնդրում ենք պատասխանել մինչև 20 օգոստոսի, 2026 թ․",
  },
  wishes: {
    title: "Թողեք Ձեր բարեմաղթանքը",
    subtitle: "Ձեր մի քանի ջերմ խոսքերը հավերժ կմնան մեր պատմության մեջ։",
  },
  music: {
    enabled: true,
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-piano-music-24065.mp3",
    label: "Ռոմանտիկ դաշնամուր",
  },
  footer: {
    message: "Անհամբեր սպասում ենք մեր հավերժությունը Ձեզ հետ տոնելուն։",
    brand: "Ստեղծված է Amulet-ով",
  },
};
