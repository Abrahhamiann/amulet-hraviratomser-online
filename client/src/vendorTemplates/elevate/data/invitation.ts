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
    tagline: "presents",
    /** Accent override for per-company theming (any CSS color). */
    accentColor: "" as string,
  },

  hero: {
    eyebrow: "Corporate Invitation",
    title: "Annual Corporate Evening",
    subtitle: "Celebrating Innovation, Growth & Partnership",
    dateLabel: "December 18, 2026",
    locationLabel: "Yerevan, Armenia",
    cta: "Discover the Evening",
    backgroundImage: heroBg,
    invitationNote:
      "You are cordially invited to join us for an exceptional evening.",
  },

  intro: {
    eyebrow: "The Invitation",
    title: "You're Invited",
    paragraph:
      "Join us for an inspiring evening as we celebrate another year of growth, innovation, achievements and meaningful partnerships.",
    signature: "The Executive Board",
  },

  details: {
    eyebrow: "Event Details",
    title: "The Essentials",
    date: { label: "Date", value: "December 18, 2026", note: "Friday" },
    time: { label: "Time", value: "19:00", note: "Doors open 18:30" },
    venue: {
      label: "Venue",
      value: "Dvin Music Hall",
      note: "Yerevan, Armenia",
    },
  },

  countdown: {
    eyebrow: "Save the Date",
    title: "The Event Begins In",
    /** ISO datetime — drives the live countdown. */
    targetDate: "2026-12-18T19:00:00+04:00",
    finishedLabel: "The evening has begun",
  },

  agenda: {
    eyebrow: "Programme",
    title: "Evening Program",
    items: [
      { time: "18:30", title: "Guest Arrival & Welcome Drinks", description: "Reception in the marble foyer." },
      { time: "19:00", title: "Opening Ceremony", description: "Welcome address from the executive board." },
      { time: "19:30", title: "Company Highlights & Awards", description: "A year in review and recognition of excellence." },
      { time: "20:00", title: "Dinner", description: "Seated three-course dinner." },
      { time: "21:00", title: "Entertainment Program", description: "Live orchestra and special performance." },
      { time: "22:00", title: "Networking & Celebration", description: "Lounge, music and conversation." },
    ],
  },

  purpose: {
    eyebrow: "Why We Gather",
    title: "An Evening to Celebrate",
    items: [
      { icon: "trophy", title: "Achievements", text: "Celebrating another successful chapter." },
      { icon: "users", title: "People", text: "Recognizing the individuals behind our progress." },
      { icon: "compass", title: "Future", text: "Looking forward to new opportunities and partnerships." },
    ],
  },

  speakers: {
    eyebrow: "Voices of the Evening",
    title: "Speakers & Hosts",
    items: [
      { name: "Alexander Smith", role: "Chief Executive Officer", company: "Amulet Group", bio: "Opening address and a look at the year ahead.", photo: speaker1 },
      { name: "Marianna Petrosyan", role: "Chief Operating Officer", company: "Amulet Group", bio: "Highlights from operations and global expansion.", photo: speaker2 },
      { name: "David Karlsson", role: "Head of Innovation", company: "Amulet Labs", bio: "The technology shaping our next decade.", photo: speaker3 },
      { name: "Lena Avetisyan", role: "Evening Host", company: "Amulet Group", bio: "Guiding the programme through the evening.", photo: speaker4 },
    ],
  },

  stats: {
    eyebrow: "By the Numbers",
    title: "A Year Worth Celebrating",
    items: [
      { value: 10, suffix: "", label: "Years Together" },
      { value: 250, suffix: "+", label: "Projects Completed" },
      { value: 500, suffix: "+", label: "Partners" },
      { value: 15, suffix: "", label: "Countries" },
    ],
  },

  gallery: {
    eyebrow: "Archive",
    title: "Moments Together",
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
    eyebrow: "Location",
    title: "Venue",
    name: "Dvin Music Hall",
    address: "Yerevan, Armenia",
    directions: "Complimentary valet parking available from 18:00.",
    mapsUrl: "https://maps.google.com/?q=Dvin+Music+Hall+Yerevan",
    mapImage,
    cta: "Get Directions",
  },

  dressCode: {
    eyebrow: "Attire",
    title: "Dress Code",
    code: "Business Elegant",
    note: "Black tie optional. We kindly ask guests to follow the evening palette.",
    palette: [
      { name: "Black", color: "#0b0d12" },
      { name: "Charcoal", color: "#31353f" },
      { name: "Ivory", color: "#f3efe6" },
      { name: "Champagne", color: "#e2cfa6" },
      { name: "Gold", color: "#c9a227" },
    ],
  },

  rsvp: {
    eyebrow: "RSVP",
    title: "Confirm Your Attendance",
    subtitle: "We would be delighted to have you with us.",
    deadline: "Kindly respond before December 1, 2026",
    successTitle: "Thank you for confirming your attendance.",
    successText: "We look forward to welcoming you.",
  },

  contact: {
    eyebrow: "Assistance",
    title: "Questions?",
    intro: "For additional information, please contact:",
    name: "Anna Hakobyan",
    role: "Event Coordinator",
    phone: "+374 10 000 000",
    phoneHref: "tel:+37410000000",
    email: "contact@company.com",
    whatsapp: "https://wa.me/37410000000",
  },

  music: {
    enabled: true,
    label: "Ambient music",
    /** Replace with the company's chosen ambient track. */
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-jazz-piano-110804.mp3",
  },

  finale: {
    title: "We Look Forward to Seeing You",
    date: "December 18, 2026",
    quote: "Together, we celebrate today and shape tomorrow.",
    branding: "Invitation created with Amulet",
  },
};
