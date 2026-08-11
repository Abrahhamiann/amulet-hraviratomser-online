import sacredPortrait from "../../../client/src/assets/importedTemplates/sacred/child-portrait.jpg";
import birthdayPortrait from "../../../client/src/assets/importedTemplates/birthday/portrait.jpg";
import ivoryHero from "../../../client/src/assets/importedTemplates/ivory/hero.jpg";

const coverByAsset: Record<string, string> = {
  "asset:curated/sacred/child-portrait.jpg": sacredPortrait,
  "asset:curated/birthday/portrait.jpg": birthdayPortrait,
  "asset:curated/ivory/hero.jpg": ivoryHero,
};

const coverByDesign: Record<string, string> = {
  "sacred-beginnings": sacredPortrait,
  "birthday-sparkle": birthdayPortrait,
  "ivory-vows": ivoryHero,
};

export function resolveAdminTemplateCover(cover?: string, designKey?: string) {
  if (cover && coverByAsset[cover]) return coverByAsset[cover];
  if (cover && !cover.startsWith("asset:")) return cover;
  return coverByDesign[designKey || ""] || "";
}
