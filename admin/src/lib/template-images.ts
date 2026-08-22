import sacredPortrait from "../../../client/src/assets/importedTemplates/sacred/child-portrait.jpg";
import birthdayPortrait from "../../../client/src/assets/importedTemplates/birthday/portrait.jpg";
import ivoryHero from "../../../client/src/assets/importedTemplates/ivory/hero.jpg";
import divineBaby from "../../../client/src/vendorTemplates/divine/assets/baby-1.jpg";
import elevateHero from "../../../client/src/vendorTemplates/elevate/assets/hero-bg.jpg";
import everAfterHero from "../../../client/src/vendorTemplates/everafter/assets/hero-floral.jpg";
import everlastingHero from "../../../client/src/vendorTemplates/everlasting/assets/hero.jpg";
import foreverVowsHero from "../../../client/src/assets/morph/engagement-smile.jpg";
import silkVowsHero from "../../../client/src/vendorTemplates/silkvows/assets/hero.jpg";
import burgundyRoadmapHero from "../../../client/src/vendorTemplates/everlasting/assets/g4.jpg";

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
};

export function resolveAdminTemplateCover(cover?: string, designKey?: string) {
  if (cover && coverByAsset[cover]) return coverByAsset[cover];
  if (cover && !cover.startsWith("asset:")) return cover;
  return coverByDesign[designKey || ""] || "";
}
