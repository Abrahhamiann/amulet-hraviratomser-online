import sacredPortrait from "../../../client/src/assets/importedTemplates/sacred/child-portrait.jpg";
import birthdayPortrait from "../../../client/src/assets/importedTemplates/birthday/portrait.jpg";
import ivoryHero from "../../../client/src/assets/importedTemplates/ivory/hero.jpg";
import divineBaby from "../../../client/src/vendorTemplates/divine/assets/baby-1.jpg";
import elevateHero from "../../../client/src/vendorTemplates/elevate/assets/hero-bg.jpg";
import everAfterHero from "../../../client/src/vendorTemplates/everafter/assets/hero-floral.jpg";
import everlastingHero from "../../../client/src/vendorTemplates/everlasting/assets/hero.jpg";
import foreverVowsHero from "../../../client/src/assets/morph/engagement-smile.jpg";
import silkVowsHero from "../../../client/src/vendorTemplates/silkvows/assets/hero.jpg";
import burgundyRoadmapHero from "../../../client/src/vendorTemplates/harsaniq1/src/assets/nkar1.jpg";
import monochromeEnvelopeHero from "../../../client/src/vendorTemplates/harsaniq2/src/assets/images/hero-couple.jpg";
import birthdaySpaceCover from "../../../client/src/vendorTemplates/cnund1/src/assets/final-reference.png";
import birthdayWatercolorCover from "../../../client/src/vendorTemplates/cnund2/src/assets/images/background.png";
import birthdayCrimsonCover from "../../../client/src/vendorTemplates/cnund3/src/assets/images/cocktails.png";
import loveMapCover from "../../../client/src/vendorTemplates/harsaniq4/src/assets/images/couple-one.jpg";
import angelicBaptismCover from "../../../client/src/vendorTemplates/knunq1/src/assets/images/baby.jpg";
import polaroidEngagementCover from "../../../client/src/vendorTemplates/nshanadrutyun1/src/assets/images/couple-1.jpg";
import goldenHeartCover from "../../../client/src/vendorTemplates/nshanadrutyun2/src/assets/images/couple-mountain.jpg";
import cinematicEngagementCover from "../../../client/src/vendorTemplates/nshanadrutyun3/src/assets/images/couple-1.jpg";
import lastBellCover from "../../../client/src/vendorTemplates/verjinzang1/src/assets/bell-photo.jpg";
import { apiAssetUrl } from "./env";

const coverByAsset: Record<string, string> = {
  "asset:curated/sacred/child-portrait.jpg": sacredPortrait,
  "asset:curated/birthday/portrait.jpg": birthdayPortrait,
  "asset:curated/ivory/hero.jpg": ivoryHero,
  "asset:curated/divine/baby-1.jpg": divineBaby,
  "asset:curated/elevate/hero-bg.jpg": elevateHero,
  "asset:curated/ever-after/hero-floral.jpg": everAfterHero,
  "asset:curated/everlasting/hero.jpg": everlastingHero,
  "asset:curated/forever-vows/engagement-smile.jpg": foreverVowsHero,
  "asset:curated/silk-vows/hero.jpg": silkVowsHero,
  "asset:curated/burgundy-roadmap/hero.jpg": burgundyRoadmapHero,
  "asset:curated/monochrome-envelope/hero.jpg": monochromeEnvelopeHero,
  "asset:curated/birthday-space/final-reference.png": birthdaySpaceCover,
  "asset:curated/birthday-watercolor/background.png": birthdayWatercolorCover,
  "asset:curated/birthday-crimson/cocktails.png": birthdayCrimsonCover,
  "asset:curated/love-map-wedding/couple-one.jpg": loveMapCover,
  "asset:curated/angelic-baptism/baby.jpg": angelicBaptismCover,
  "asset:curated/polaroid-engagement/couple-1.jpg": polaroidEngagementCover,
  "asset:curated/golden-heart-engagement/couple-mountain.jpg": goldenHeartCover,
  "asset:curated/cinematic-engagement/couple-1.jpg": cinematicEngagementCover,
  "asset:curated/last-bell/bell-photo.jpg": lastBellCover,
};

const coverByDesign: Record<string, string> = {
  "sacred-beginnings": sacredPortrait,
  "birthday-sparkle": birthdayPortrait,
  "ivory-vows": ivoryHero,
  "divine-blessing": divineBaby,
  "elevate-invite": elevateHero,
  "ever-after": everAfterHero,
  "everlasting-vows": everlastingHero,
  "forever-vows": foreverVowsHero,
  "silk-vows": silkVowsHero,
  "burgundy-roadmap": burgundyRoadmapHero,
  "monochrome-envelope": monochromeEnvelopeHero,
  "birthday-space": birthdaySpaceCover,
  "birthday-watercolor": birthdayWatercolorCover,
  "birthday-crimson": birthdayCrimsonCover,
  "love-map-wedding": loveMapCover,
  "angelic-baptism": angelicBaptismCover,
  "polaroid-engagement": polaroidEngagementCover,
  "golden-heart-engagement": goldenHeartCover,
  "cinematic-engagement": cinematicEngagementCover,
  "last-bell": lastBellCover,
};

export function resolveAdminTemplateCover(cover?: string, designKey?: string) {
  if (cover && coverByAsset[cover]) return coverByAsset[cover];
  if (cover && !cover.startsWith("asset:")) return apiAssetUrl(cover);
  return coverByDesign[designKey || ""] || "";
}
