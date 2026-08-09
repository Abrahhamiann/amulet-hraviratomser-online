import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import portrait from "@/assets/portrait.jpg";
import venue from "@/assets/venue.jpg";

export type ScheduleItem = { time: string; title: string; note?: string };
export type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  span?: "tall" | "wide" | "normal";
};

export type InvitationConfig = {
  birthdayPersonName: string;
  fullName: string;
  age: number;
  eventDateISO: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  mapsQuery: string;
  dressCode: string;
  introHeadline: string;
  personalMessage: string;
  wish: string;
  signature: string;
  portrait: { src: string; alt: string; width: number; height: number };
  venuePhoto: { src: string; alt: string; width: number; height: number };
  photos: GalleryPhoto[];
  schedule: ScheduleItem[];
  musicSrc?: string;
};

export const invitation: InvitationConfig = {
  birthdayPersonName: "Էմիլի",
  fullName: "Էմիլի Հարփեր",
  age: 25,
  eventDateISO: "2026-09-19T19:00:00",
  dateLabel: "Շաբաթ, 19 սեպտեմբերի, 2026",
  timeLabel: "19:00",
  venue: "«Գարդեն» սրահ",
  address: "Տոնական փողոց 123",
  mapsQuery: "The Garden Hall, 123 Celebration Street",
  dressCode: "Գունեղ և էլեգանտ",
  introHeadline: "Մի փոքրիկ տոն",
  personalMessage:
    "Եվս մեկ գեղեցիկ տարի, ևս մեկ առիթ միասին տոնելու։ Սիրելի մարդկանց մեկ հարկի տակ եմ հավաքում՝ մոմերի լույսով, տորթով և շատ պարերով լի երեկոյի համար։",
  wish: "Ամենալավ նվերը կլինի Ձեր ներկայությունն այս առանձնահատուկ օրը։",
  signature: "Սիրով՝ Էմիլի",
  portrait: { src: portrait, alt: "Էմիլին՝ կայծավառ մոմով", width: 912, height: 1200 },
  venuePhoto: {
    src: venue,
    alt: "Տարեդարձի համար ձևավորված «Գարդեն» սրահը",
    width: 1400,
    height: 900,
  },
  photos: [
    {
      src: gallery1,
      alt: "Տոնական տորթ վառվող մոմերով",
      width: 900,
      height: 1100,
      span: "tall",
    },
    {
      src: gallery2,
      alt: "Ընկերները պարտեզային խնջույքի ժամանակ",
      width: 1200,
      height: 800,
      span: "wide",
    },
    { src: gallery3, alt: "Պաստելային և ոսկեգույն փուչիկներ", width: 900, height: 900 },
    {
      src: gallery4,
      alt: "Շամպայնի բաժակներ ոսկեգույն լույսերի ներքո",
      width: 900,
      height: 1200,
      span: "tall",
    },
    { src: gallery5, alt: "Նվերների տուփեր ատլասե ժապավեններով", width: 1000, height: 750 },
  ],
  schedule: [
    { time: "19:00", title: "Ողջույնի ըմպելիքներ", note: "Փրփրուն կենաց պարտեզում" },
    { time: "19:30", title: "Ընթրիք", note: "Տոնական ընթրիք սրահում" },
    { time: "20:30", title: "Տարեդարձի տորթ", note: "Մոմեր, երազանքներ և ծափահարություններ" },
    { time: "21:00", title: "Երաժշտություն և պարեր", note: "Կենդանի երաժշտություն մինչև ուշ երեկո" },
    { time: "23:00", title: "Տոնական անակնկալ", note: "Մնացե՛ք ևս մի փոքր…" },
  ],
};
