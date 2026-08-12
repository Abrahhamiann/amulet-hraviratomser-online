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
    bride: { name: "Anna", role: "The Bride", photo: bride, note: "Daughter of the Petrosyan family" },
    groom: { name: "David", role: "The Groom", photo: groom, note: "Son of the Avetisyan family" },
    initials: { left: "A", right: "D" },
  },
  hero: {
    background: hero,
    kicker: "Are Getting Married",
    dateLabel: "September 20, 2026",
    invitation: "Together with our families, we invite you to celebrate our love.",
    scrollLabel: "Scroll to Discover",
  },
  envelope: {
    enabled: true,
    label: "Open Invitation",
    note: "You are invited",
  },
  date: {
    iso: "2026-09-20T16:00:00+04:00",
    display: "20 · 09 · 2026",
    long: "September 20, 2026",
  },
  story: {
    title: "Our Story",
    intro: "Two hearts, one journey, and a lifetime ahead.",
    milestones: [
      { year: "2019", title: "We Met", text: "A crowded room in autumn, one conversation that never quite ended.", photo: g1 },
      { year: "2022", title: "Our First Adventure", text: "Two backpacks, one map, and the certainty of good company.", photo: g4 },
      { year: "2025", title: "She Said Yes", text: "A quiet evening, a golden ring, and a promise made softly.", photo: g2 },
      { year: "2026", title: "Forever Begins", text: "And now we would love for you to be there when it does.", photo: g5 },
    ],
  },
  ceremony: {
    title: "The Ceremony",
    time: "16:00",
    venue: "Saint Anna Church",
    city: "Yerevan, Armenia",
    mapUrl: "https://maps.google.com/?q=Saint+Anna+Church+Yerevan",
  },
  reception: {
    title: "The Celebration",
    time: "18:30",
    venue: "Royal Garden",
    city: "Yerevan, Armenia",
    note: "Dinner, music, dancing, and unforgettable memories await.",
    mapUrl: "https://maps.google.com/?q=Royal+Garden+Yerevan",
  },
  timeline: [
    { time: "15:30", title: "Guest Arrival" },
    { time: "16:00", title: "Wedding Ceremony" },
    { time: "17:30", title: "Reception" },
    { time: "18:30", title: "Dinner" },
    { time: "20:00", title: "First Dance" },
    { time: "20:30", title: "Celebration & Dancing" },
  ],
  gallery: {
    title: "Our Moments",
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
    text: "And suddenly, all the love songs were about you.",
    author: "",
  },
  dressCode: {
    title: "Dress Code",
    value: "Elegant / Formal",
    note: "We would love to see you in soft, timeless tones.",
    swatches: [
      { name: "Ivory", color: "#F6F1E7" },
      { name: "Champagne", color: "#E6D6BA" },
      { name: "Beige", color: "#D9C7B0" },
      { name: "Blush", color: "#EBD0CC" },
      { name: "Dusty Rose", color: "#C89C99" },
      { name: "Sage", color: "#A8B49C" },
    ],
  },
  rsvp: {
    title: "Will You Join Us?",
    subtitle: "We would be honored to celebrate this special day with you.",
    meals: ["Meat", "Fish", "Vegetarian", "Vegan"],
    deadline: "Kindly respond before August 20, 2026",
  },
  wishes: {
    title: "Leave Us a Wish",
    subtitle: "A few words from you will live in our story forever.",
  },
  music: {
    enabled: true,
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-piano-music-24065.mp3",
    label: "Romantic piano",
  },
  footer: {
    message: "We can't wait to celebrate our forever with you.",
    brand: "Created with Amulet",
  },
};
