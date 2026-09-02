import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Copy, Edit, Eye, LayoutGrid, List, MoreHorizontal, Plus, RotateCcw, Search, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi, currency } from "@/lib/api";
import { apiAssetUrl, CLIENT_URL } from "@/lib/env";
import { formatAdminCategory, useAdminI18n } from "@/lib/i18n";
import { resolveAdminTemplateCover } from "@/lib/template-images";
import { useTemplates } from "@/hooks/useAdminData";
import sacredPortrait from "../../../client/src/assets/importedTemplates/sacred/child-portrait.jpg";
import sacredGallery1 from "../../../client/src/assets/importedTemplates/sacred/gallery-1.jpg";
import sacredGallery2 from "../../../client/src/assets/importedTemplates/sacred/gallery-2.jpg";
import sacredGallery3 from "../../../client/src/assets/importedTemplates/sacred/gallery-3.jpg";
import sacredGallery4 from "../../../client/src/assets/importedTemplates/sacred/gallery-4.jpg";
import sacredGallery5 from "../../../client/src/assets/importedTemplates/sacred/gallery-5.jpg";
import birthdayPortrait from "../../../client/src/assets/importedTemplates/birthday/portrait.jpg";
import birthdayVenue from "../../../client/src/assets/importedTemplates/birthday/venue.jpg";
import birthdayGallery1 from "../../../client/src/assets/importedTemplates/birthday/gallery-1.jpg";
import birthdayGallery2 from "../../../client/src/assets/importedTemplates/birthday/gallery-2.jpg";
import birthdayGallery3 from "../../../client/src/assets/importedTemplates/birthday/gallery-3.jpg";
import birthdayGallery4 from "../../../client/src/assets/importedTemplates/birthday/gallery-4.jpg";
import birthdayGallery5 from "../../../client/src/assets/importedTemplates/birthday/gallery-5.jpg";
import birthdaySpaceCover from "../../../client/src/vendorTemplates/cnund1/src/assets/final-reference.png";
import birthdayWatercolorBackground from "../../../client/src/vendorTemplates/cnund2/src/assets/images/background.png";
import birthdayWatercolorFlowers from "../../../client/src/vendorTemplates/cnund2/src/assets/images/flowers.png";
import birthdayCrimsonCocktails from "../../../client/src/vendorTemplates/cnund3/src/assets/images/cocktails.png";
import birthdayCrimsonCake from "../../../client/src/vendorTemplates/cnund3/src/assets/images/cake.png";
import birthdayCrimsonDinner from "../../../client/src/vendorTemplates/cnund3/src/assets/images/dinner.png";
import birthdayCrimsonMusic from "../../../client/src/vendorTemplates/cnund3/src/assets/images/music.png";
import birthdayCrimsonMartini from "../../../client/src/vendorTemplates/cnund3/src/assets/images/martini.png";
import ivoryHero from "../../../client/src/assets/importedTemplates/ivory/hero.jpg";
import ivoryChurch from "../../../client/src/assets/importedTemplates/ivory/church.jpg";
import ivoryHall from "../../../client/src/assets/importedTemplates/ivory/hall.jpg";
import ivoryGallery1 from "../../../client/src/assets/importedTemplates/ivory/gallery-1.jpg";
import ivoryGallery2 from "../../../client/src/assets/importedTemplates/ivory/gallery-2.jpg";
import ivoryGallery3 from "../../../client/src/assets/importedTemplates/ivory/gallery-3.jpg";
import ivoryGallery4 from "../../../client/src/assets/importedTemplates/ivory/gallery-4.jpg";
import divineBaby1 from "../../../client/src/vendorTemplates/divine/assets/baby-1.jpg";
import divineBaby2 from "../../../client/src/vendorTemplates/divine/assets/baby-2.jpg";
import divineBaby3 from "../../../client/src/vendorTemplates/divine/assets/baby-3.jpg";
import divineChurch from "../../../client/src/vendorTemplates/divine/assets/church.jpg";
import elevateHero from "../../../client/src/vendorTemplates/elevate/assets/hero-bg.jpg";
import elevateGallery1 from "../../../client/src/vendorTemplates/elevate/assets/gallery-1.jpg";
import elevateGallery2 from "../../../client/src/vendorTemplates/elevate/assets/gallery-2.jpg";
import elevateGallery3 from "../../../client/src/vendorTemplates/elevate/assets/gallery-3.jpg";
import elevateGallery4 from "../../../client/src/vendorTemplates/elevate/assets/gallery-4.jpg";
import elevateGallery5 from "../../../client/src/vendorTemplates/elevate/assets/gallery-5.jpg";
import elevateGallery6 from "../../../client/src/vendorTemplates/elevate/assets/gallery-6.jpg";
import everAfterHero from "../../../client/src/vendorTemplates/everafter/assets/hero-floral.jpg";
import everAfterBride from "../../../client/src/vendorTemplates/everafter/assets/portrait-anna.jpg";
import everAfterGroom from "../../../client/src/vendorTemplates/everafter/assets/portrait-david.jpg";
import everAfterMap from "../../../client/src/vendorTemplates/everafter/assets/map-placeholder.jpg";
import everAfterGallery1 from "../../../client/src/vendorTemplates/everafter/assets/gallery-1.jpg";
import everAfterGallery2 from "../../../client/src/vendorTemplates/everafter/assets/gallery-2.jpg";
import everAfterGallery3 from "../../../client/src/vendorTemplates/everafter/assets/gallery-3.jpg";
import everAfterGallery4 from "../../../client/src/vendorTemplates/everafter/assets/gallery-4.jpg";
import everAfterGallery5 from "../../../client/src/vendorTemplates/everafter/assets/gallery-5.jpg";
import everAfterGallery6 from "../../../client/src/vendorTemplates/everafter/assets/gallery-6.jpg";
import everlastingHero from "../../../client/src/vendorTemplates/everlasting/assets/hero.jpg";
import everlastingBride from "../../../client/src/vendorTemplates/everlasting/assets/bride.jpg";
import everlastingGroom from "../../../client/src/vendorTemplates/everlasting/assets/groom.jpg";
import everlastingGallery1 from "../../../client/src/vendorTemplates/everlasting/assets/g1.jpg";
import everlastingGallery2 from "../../../client/src/vendorTemplates/everlasting/assets/g2.jpg";
import everlastingGallery3 from "../../../client/src/vendorTemplates/everlasting/assets/g3.jpg";
import everlastingGallery4 from "../../../client/src/vendorTemplates/everlasting/assets/g4.jpg";
import everlastingGallery5 from "../../../client/src/vendorTemplates/everlasting/assets/g5.jpg";
import everlastingGallery6 from "../../../client/src/vendorTemplates/everlasting/assets/g6.jpg";
import foreverVowsMain from "../../../client/src/assets/morph/engagement-smile.jpg";
import foreverVowsSmall from "../../../client/src/assets/morph/wedding-forest-optimized.jpg";
import foreverVowsTiny from "../../../client/src/assets/morph/wedding-temple.jpg";
import silkVowsHero from "../../../client/src/vendorTemplates/silkvows/assets/hero.jpg";
import silkVowsChurch from "../../../client/src/vendorTemplates/silkvows/assets/church.jpg";
import silkVowsHall from "../../../client/src/vendorTemplates/silkvows/assets/hall.jpg";
import silkVowsQuote from "../../../client/src/vendorTemplates/silkvows/assets/quote.jpg";
import burgundyRoadmapHero from "../../../client/src/vendorTemplates/harsaniq1/src/assets/nkar1.jpg";
import burgundyRoadmapPortrait from "../../../client/src/vendorTemplates/harsaniq1/src/assets/couple.jpg";
import burgundyRoadmapRings from "../../../client/src/vendorTemplates/harsaniq1/src/assets/weddingnkar.jpg";
import monochromeEnvelopeHero from "../../../client/src/vendorTemplates/harsaniq2/src/assets/images/hero-couple.jpg";
import monochromeEnvelopeRings from "../../../client/src/vendorTemplates/harsaniq2/src/assets/images/rings.jpg";
import monochromeEnvelopePortrait from "../../../client/src/vendorTemplates/harsaniq2/src/assets/images/portrait.jpg";
import loveMapCoupleOne from "../../../client/src/vendorTemplates/harsaniq4/src/assets/images/couple-one.jpg";
import loveMapCoupleTwo from "../../../client/src/vendorTemplates/harsaniq4/src/assets/images/couple-two.jpg";
import angelicBaptismBaby from "../../../client/src/vendorTemplates/knunq1/src/assets/images/baby.jpg";
import polaroidEngagementOne from "../../../client/src/vendorTemplates/nshanadrutyun1/src/assets/images/couple-1.jpg";
import polaroidEngagementTwo from "../../../client/src/vendorTemplates/nshanadrutyun1/src/assets/images/couple-2.jpg";
import polaroidEngagementVenue from "../../../client/src/vendorTemplates/nshanadrutyun1/src/assets/images/restaurant.png";
import goldenHeartMountain from "../../../client/src/vendorTemplates/nshanadrutyun2/src/assets/images/couple-mountain.jpg";
import goldenHeartFlowers from "../../../client/src/vendorTemplates/nshanadrutyun2/src/assets/images/couple-flowers.jpg";
import cinematicEngagementOne from "../../../client/src/vendorTemplates/nshanadrutyun3/src/assets/images/couple-1.jpg";
import cinematicEngagementTwo from "../../../client/src/vendorTemplates/nshanadrutyun3/src/assets/images/couple-2.jpg";
import cinematicEngagementThree from "../../../client/src/vendorTemplates/nshanadrutyun3/src/assets/images/couple-3.jpg";
import cinematicEngagementFour from "../../../client/src/vendorTemplates/nshanadrutyun3/src/assets/images/couple-4.jpg";
import cinematicEngagementFive from "../../../client/src/vendorTemplates/nshanadrutyun3/src/assets/images/couple-5.jpg";
import cinematicEngagementVenue from "../../../client/src/vendorTemplates/nshanadrutyun3/src/assets/images/restaurant.png";
import lastBellHero from "../../../client/src/vendorTemplates/verjinzang1/src/assets/bell-photo.jpg";
import lastBellSchool from "../../../client/src/vendorTemplates/verjinzang1/src/assets/school.jpg";
import lastBellVenue from "../../../client/src/vendorTemplates/verjinzang1/src/assets/venue.jpg";
import armyCeremonialPhoto from "../../../client/src/vendorTemplates/armyCeremonial/src/assets/soldier-photo.jpg";
import armyCamouflagePhoto from "../../../client/src/vendorTemplates/armyCamouflage/src/assets/soldier-photo.jpg";

export const Route = createFileRoute("/admin/templates")({ component: TemplatesPage });

const defaultImagePosition = {
  x: 50,
  y: 50,
  zoom: 1,
};

const staticDesignOptions = [
  { key: "sacred-beginnings", label: "Սուրբ սկիզբ · մկրտություն", category: "baptism" },
  { key: "birthday-sparkle", label: "Փայլուն տարեդարձ", category: "birth" },
  { key: "birthday-space", label: "Տիեզերական տարեդարձ", category: "birth" },
  { key: "birthday-watercolor", label: "Ջրաներկ տարեդարձ", category: "birth" },
  { key: "birthday-crimson", label: "Կարմիր տարեդարձ", category: "birth" },
  { key: "army-ceremonial", label: "Հանդիսավոր բանակի քեֆ", category: "military" },
  { key: "army-camouflage", label: "Քողարկանախշ բանակի քեֆ", category: "military" },
  { key: "ivory-vows", label: "Փղոսկրե երդումներ · հարսանիք", category: "wedding" },
  { key: "divine-blessing", label: "Աստվածային օրհնություն · մկրտություն", category: "baptism" },
  { key: "elevate-invite", label: "Elevate · գործարար միջոցառում", category: "corporate" },
  { key: "everlasting-vows", label: "Հավերժական երդումներ · հարսանիք", category: "wedding" },
  { key: "forever-vows", label: "Forever Vows · նշանադրություն", category: "engagement" },
  { key: "silk-vows", label: "Մետաքսե երդումներ · հարսանիք", category: "wedding" },
  { key: "burgundy-roadmap", label: "Գինեգույն ճանապարհ · հարսանիք", category: "wedding" },
  { key: "monochrome-envelope", label: "Մոնոխրոմ հրավեր · հարսանիք", category: "wedding" },
  { key: "love-map-wedding", label: "Սիրո քարտեզ · հարսանիք", category: "wedding" },
  { key: "angelic-baptism", label: "Հրեշտակային մկրտություն", category: "baptism" },
  { key: "polaroid-engagement", label: "Պոլարոիդ նշանադրություն", category: "engagement" },
  { key: "golden-heart-engagement", label: "Ոսկե սիրտ · նշանադրություն", category: "engagement" },
  { key: "cinematic-engagement", label: "Կինոժապավեն · նշանադրություն", category: "engagement" },
  { key: "last-bell", label: "Վերջին զանգ", category: "corporate" },
];

const adminCategoryOptions = ["wedding", "baptism", "birth", "engagement", "military", "other"];
const otherTemplateCategories = new Set(["corporate", "new_year", "meeting"]);
const toAdminCategory = (category?: string) => (
  otherTemplateCategories.has(String(category || "").toLowerCase()) ? "other" : category
);

const templateAssetPreviews: Record<string, string> = {
  "asset:curated/sacred/child-portrait.jpg": sacredPortrait,
  "asset:curated/sacred/gallery-1.jpg": sacredGallery1,
  "asset:curated/sacred/gallery-2.jpg": sacredGallery2,
  "asset:curated/sacred/gallery-3.jpg": sacredGallery3,
  "asset:curated/sacred/gallery-4.jpg": sacredGallery4,
  "asset:curated/sacred/gallery-5.jpg": sacredGallery5,
  "asset:curated/birthday/portrait.jpg": birthdayPortrait,
  "asset:curated/birthday/venue.jpg": birthdayVenue,
  "asset:curated/birthday/gallery-1.jpg": birthdayGallery1,
  "asset:curated/birthday/gallery-2.jpg": birthdayGallery2,
  "asset:curated/birthday/gallery-3.jpg": birthdayGallery3,
  "asset:curated/birthday/gallery-4.jpg": birthdayGallery4,
  "asset:curated/birthday/gallery-5.jpg": birthdayGallery5,
  "asset:curated/birthday-space/final-reference.png": birthdaySpaceCover,
  "asset:curated/birthday-watercolor/background.png": birthdayWatercolorBackground,
  "asset:curated/birthday-watercolor/flowers.png": birthdayWatercolorFlowers,
  "asset:curated/birthday-crimson/cocktails.png": birthdayCrimsonCocktails,
  "asset:curated/birthday-crimson/cake.png": birthdayCrimsonCake,
  "asset:curated/birthday-crimson/dinner.png": birthdayCrimsonDinner,
  "asset:curated/birthday-crimson/music.png": birthdayCrimsonMusic,
  "asset:curated/birthday-crimson/martini.png": birthdayCrimsonMartini,
  "asset:curated/ivory/hero.jpg": ivoryHero,
  "asset:curated/ivory/church.jpg": ivoryChurch,
  "asset:curated/ivory/hall.jpg": ivoryHall,
  "asset:curated/ivory/gallery-1.jpg": ivoryGallery1,
  "asset:curated/ivory/gallery-2.jpg": ivoryGallery2,
  "asset:curated/ivory/gallery-3.jpg": ivoryGallery3,
  "asset:curated/ivory/gallery-4.jpg": ivoryGallery4,
  "asset:curated/divine/baby-1.jpg": divineBaby1,
  "asset:curated/divine/baby-2.jpg": divineBaby2,
  "asset:curated/divine/baby-3.jpg": divineBaby3,
  "asset:curated/divine/church.jpg": divineChurch,
  "asset:curated/elevate/hero-bg.jpg": elevateHero,
  "asset:curated/elevate/gallery-1.jpg": elevateGallery1,
  "asset:curated/elevate/gallery-2.jpg": elevateGallery2,
  "asset:curated/elevate/gallery-3.jpg": elevateGallery3,
  "asset:curated/elevate/gallery-4.jpg": elevateGallery4,
  "asset:curated/elevate/gallery-5.jpg": elevateGallery5,
  "asset:curated/elevate/gallery-6.jpg": elevateGallery6,
  "asset:curated/ever-after/hero-floral.jpg": everAfterHero,
  "asset:curated/ever-after/bride.jpg": everAfterBride,
  "asset:curated/ever-after/groom.jpg": everAfterGroom,
  "asset:curated/ever-after/map.jpg": everAfterMap,
  "asset:curated/ever-after/gallery-1.jpg": everAfterGallery1,
  "asset:curated/ever-after/gallery-2.jpg": everAfterGallery2,
  "asset:curated/ever-after/gallery-3.jpg": everAfterGallery3,
  "asset:curated/ever-after/gallery-4.jpg": everAfterGallery4,
  "asset:curated/ever-after/gallery-5.jpg": everAfterGallery5,
  "asset:curated/ever-after/gallery-6.jpg": everAfterGallery6,
  "asset:curated/everlasting/hero.jpg": everlastingHero,
  "asset:curated/everlasting/bride.jpg": everlastingBride,
  "asset:curated/everlasting/groom.jpg": everlastingGroom,
  "asset:curated/everlasting/gallery-1.jpg": everlastingGallery1,
  "asset:curated/everlasting/gallery-2.jpg": everlastingGallery2,
  "asset:curated/everlasting/gallery-3.jpg": everlastingGallery3,
  "asset:curated/everlasting/gallery-4.jpg": everlastingGallery4,
  "asset:curated/everlasting/gallery-5.jpg": everlastingGallery5,
  "asset:curated/everlasting/gallery-6.jpg": everlastingGallery6,
  "asset:curated/forever-vows/engagement-smile.jpg": foreverVowsMain,
  "asset:curated/forever-vows/wedding-forest-optimized.jpg": foreverVowsSmall,
  "asset:curated/forever-vows/wedding-temple.jpg": foreverVowsTiny,
  "asset:curated/silk-vows/hero.jpg": silkVowsHero,
  "asset:curated/silk-vows/church.jpg": silkVowsChurch,
  "asset:curated/silk-vows/hall.jpg": silkVowsHall,
  "asset:curated/silk-vows/quote.jpg": silkVowsQuote,
  "asset:curated/burgundy-roadmap/hero.jpg": burgundyRoadmapHero,
  "asset:curated/burgundy-roadmap/portrait.jpg": burgundyRoadmapPortrait,
  "asset:curated/burgundy-roadmap/rings.jpg": burgundyRoadmapRings,
  "asset:curated/monochrome-envelope/hero.jpg": monochromeEnvelopeHero,
  "asset:curated/monochrome-envelope/rings.jpg": monochromeEnvelopeRings,
  "asset:curated/monochrome-envelope/portrait.jpg": monochromeEnvelopePortrait,
  "asset:curated/love-map-wedding/couple-one.jpg": loveMapCoupleOne,
  "asset:curated/love-map-wedding/couple-two.jpg": loveMapCoupleTwo,
  "asset:curated/angelic-baptism/baby.jpg": angelicBaptismBaby,
  "asset:curated/polaroid-engagement/couple-1.jpg": polaroidEngagementOne,
  "asset:curated/polaroid-engagement/couple-2.jpg": polaroidEngagementTwo,
  "asset:curated/polaroid-engagement/restaurant.png": polaroidEngagementVenue,
  "asset:curated/golden-heart-engagement/couple-mountain.jpg": goldenHeartMountain,
  "asset:curated/golden-heart-engagement/couple-flowers.jpg": goldenHeartFlowers,
  "asset:curated/cinematic-engagement/couple-1.jpg": cinematicEngagementOne,
  "asset:curated/cinematic-engagement/couple-2.jpg": cinematicEngagementTwo,
  "asset:curated/cinematic-engagement/couple-3.jpg": cinematicEngagementThree,
  "asset:curated/cinematic-engagement/couple-4.jpg": cinematicEngagementFour,
  "asset:curated/cinematic-engagement/couple-5.jpg": cinematicEngagementFive,
  "asset:curated/cinematic-engagement/restaurant.png": cinematicEngagementVenue,
  "asset:curated/last-bell/bell-photo.jpg": lastBellHero,
  "asset:curated/last-bell/school.jpg": lastBellSchool,
  "asset:curated/last-bell/venue.jpg": lastBellVenue,
  "asset:curated/army-ceremonial/soldier-photo.jpg": armyCeremonialPhoto,
  "asset:curated/army-camouflage/soldier-photo.jpg": armyCamouflagePhoto,
};

const defaultDesignGalleries: Record<string, string[]> = {
  "sacred-beginnings": [
    "asset:curated/sacred/child-portrait.jpg",
    "asset:curated/sacred/gallery-1.jpg",
    "asset:curated/sacred/gallery-2.jpg",
    "asset:curated/sacred/gallery-3.jpg",
    "asset:curated/sacred/gallery-4.jpg",
    "asset:curated/sacred/gallery-5.jpg",
  ],
  "birthday-sparkle": [
    "asset:curated/birthday/portrait.jpg",
    "asset:curated/birthday/venue.jpg",
    "asset:curated/birthday/gallery-1.jpg",
    "asset:curated/birthday/gallery-2.jpg",
    "asset:curated/birthday/gallery-3.jpg",
    "asset:curated/birthday/gallery-4.jpg",
    "asset:curated/birthday/gallery-5.jpg",
  ],
  "birthday-space": [
    "asset:curated/birthday-space/final-reference.png",
  ],
  "birthday-watercolor": [
    "asset:curated/birthday-watercolor/background.png",
    "asset:curated/birthday-watercolor/flowers.png",
  ],
  "birthday-crimson": [
    "asset:curated/birthday-crimson/cocktails.png",
    "asset:curated/birthday-crimson/cake.png",
    "asset:curated/birthday-crimson/dinner.png",
    "asset:curated/birthday-crimson/music.png",
    "asset:curated/birthday-crimson/martini.png",
  ],
  "army-ceremonial": [
    "asset:curated/army-ceremonial/soldier-photo.jpg",
  ],
  "army-camouflage": [
    "asset:curated/army-camouflage/soldier-photo.jpg",
  ],
  "ivory-vows": [
    "asset:curated/ivory/hero.jpg",
    "asset:curated/ivory/church.jpg",
    "asset:curated/ivory/hall.jpg",
    "asset:curated/ivory/gallery-1.jpg",
    "asset:curated/ivory/gallery-2.jpg",
    "asset:curated/ivory/gallery-3.jpg",
    "asset:curated/ivory/gallery-4.jpg",
  ],
  "divine-blessing": [
    "asset:curated/divine/baby-1.jpg",
    "asset:curated/divine/baby-2.jpg",
    "asset:curated/divine/baby-3.jpg",
    "asset:curated/divine/church.jpg",
  ],
  "elevate-invite": [
    "asset:curated/elevate/hero-bg.jpg",
    "asset:curated/elevate/gallery-1.jpg",
    "asset:curated/elevate/gallery-2.jpg",
    "asset:curated/elevate/gallery-3.jpg",
    "asset:curated/elevate/gallery-4.jpg",
    "asset:curated/elevate/gallery-5.jpg",
    "asset:curated/elevate/gallery-6.jpg",
  ],
  "ever-after": [
    "asset:curated/ever-after/hero-floral.jpg",
    "asset:curated/ever-after/bride.jpg",
    "asset:curated/ever-after/groom.jpg",
    "asset:curated/ever-after/map.jpg",
    "asset:curated/ever-after/gallery-1.jpg",
    "asset:curated/ever-after/gallery-2.jpg",
    "asset:curated/ever-after/gallery-3.jpg",
    "asset:curated/ever-after/gallery-4.jpg",
    "asset:curated/ever-after/gallery-5.jpg",
    "asset:curated/ever-after/gallery-6.jpg",
  ],
  "everlasting-vows": [
    "asset:curated/everlasting/hero.jpg",
    "asset:curated/everlasting/bride.jpg",
    "asset:curated/everlasting/groom.jpg",
    "asset:curated/everlasting/gallery-1.jpg",
    "asset:curated/everlasting/gallery-2.jpg",
    "asset:curated/everlasting/gallery-3.jpg",
    "asset:curated/everlasting/gallery-4.jpg",
    "asset:curated/everlasting/gallery-5.jpg",
    "asset:curated/everlasting/gallery-6.jpg",
  ],
  "forever-vows": [
    "asset:curated/forever-vows/engagement-smile.jpg",
    "asset:curated/forever-vows/wedding-forest-optimized.jpg",
    "asset:curated/forever-vows/wedding-temple.jpg",
  ],
  "silk-vows": [
    "asset:curated/silk-vows/hero.jpg",
    "asset:curated/silk-vows/church.jpg",
    "asset:curated/silk-vows/hall.jpg",
    "asset:curated/silk-vows/quote.jpg",
  ],
  "burgundy-roadmap": [
    "asset:curated/burgundy-roadmap/hero.jpg",
    "asset:curated/burgundy-roadmap/portrait.jpg",
    "asset:curated/burgundy-roadmap/rings.jpg",
  ],
  "monochrome-envelope": [
    "asset:curated/monochrome-envelope/hero.jpg",
    "asset:curated/monochrome-envelope/rings.jpg",
    "asset:curated/monochrome-envelope/portrait.jpg",
  ],
  "love-map-wedding": [
    "asset:curated/love-map-wedding/couple-one.jpg",
    "asset:curated/love-map-wedding/couple-two.jpg",
  ],
  "angelic-baptism": ["asset:curated/angelic-baptism/baby.jpg"],
  "polaroid-engagement": [
    "asset:curated/polaroid-engagement/couple-1.jpg",
    "asset:curated/polaroid-engagement/couple-2.jpg",
    "asset:curated/polaroid-engagement/restaurant.png",
  ],
  "golden-heart-engagement": [
    "asset:curated/golden-heart-engagement/couple-mountain.jpg",
    "asset:curated/golden-heart-engagement/couple-flowers.jpg",
  ],
  "cinematic-engagement": [
    "asset:curated/cinematic-engagement/couple-1.jpg",
    "asset:curated/cinematic-engagement/couple-2.jpg",
    "asset:curated/cinematic-engagement/couple-3.jpg",
    "asset:curated/cinematic-engagement/couple-4.jpg",
    "asset:curated/cinematic-engagement/couple-5.jpg",
    "asset:curated/cinematic-engagement/restaurant.png",
  ],
  "last-bell": [
    "asset:curated/last-bell/bell-photo.jpg",
    "asset:curated/last-bell/school.jpg",
    "asset:curated/last-bell/venue.jpg",
  ],
};

const emptyForm = {
  title: "",
  slug: "",
  category: "wedding",
  editorType: "wedding",
  price: "29000",
  designKey: "ivory-vows",
  description: "",
  mainImage: "asset:curated/ivory/hero.jpg",
  pagePreviewImage: "",
  gallery: "asset:curated/ivory/hero.jpg",
  features: "",
  isFeatured: false,
  isActive: true,
  galleryConfigured: false,
  imagePosition: defaultImagePosition,
};

const clampNumber = (value: unknown, min: number, max: number, fallback: number) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
};

function normalizeImagePosition(position?: any) {
  return {
    x: clampNumber(position?.x, 0, 100, defaultImagePosition.x),
    y: clampNumber(position?.y, 0, 100, defaultImagePosition.y),
    zoom: clampNumber(position?.zoom, 1, 2, defaultImagePosition.zoom),
  };
}

function getImageStyle(position?: any): CSSProperties {
  const normalized = normalizeImagePosition(position);
  const objectPosition = `${normalized.x}% ${normalized.y}%`;
  return {
    objectPosition,
    transform: `scale(${normalized.zoom})`,
    transformOrigin: objectPosition,
  };
}

const galleryFromText = (value: string) => String(value || "")
  .split("\n")
  .map((image) => image.trim())
  .filter(Boolean);

const isKnownDesignKey = (designKey?: string) => staticDesignOptions.some((option) => option.key === designKey);

const getDefaultGalleryForDesign = (designKey?: string) => defaultDesignGalleries[designKey || "ivory-vows"] || defaultDesignGalleries["ivory-vows"];

const sameImageList = (first: string[], second: string[]) => (
  first.length === second.length && first.every((image, index) => image === second[index])
);

const getPreviewImage = (image?: string) => apiAssetUrl(templateAssetPreviews[image || ""] || image || "");

function AdminTemplateCover({ template, className }: { template: any; className: string }) {
  const primary = template.cover ? resolveAdminTemplateCover(template.cover) : "";
  const fallback = resolveAdminTemplateCover(undefined, template.designKey);
  const [source, setSource] = useState(primary || fallback);

  useEffect(() => setSource(primary || fallback), [fallback, primary]);
  if (!source) return <span className={`${className} block bg-secondary`} aria-hidden="true" />;

  return (
    <img
      src={source}
      alt={template.name}
      className={className}
      style={getImageStyle(template.imagePosition)}
      loading="lazy"
      decoding="async"
      onError={() => setSource("")}
    />
  );
}

const MAX_PAGE_PREVIEW_BYTES = 10 * 1024 * 1024;
const PAGE_PREVIEW_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const readImageFile = (file: File) => new Promise<string>((resolve) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.readAsDataURL(file);
});

function getClientBaseUrl() {
  return CLIENT_URL;
}

function toForm(template?: any) {
  if (!template) return emptyForm;
  const designKey = isKnownDesignKey(template.designKey) ? template.designKey : "ivory-vows";
  const savedGallery = template.gallery || [];
  const defaultGallery = getDefaultGalleryForDesign(designKey);
  const gallery = savedGallery.length || template.galleryConfigured
    ? savedGallery
    : defaultGallery;
  return {
    title: template.name || "",
    slug: template.slug || "",
    category: String(template.category || "wedding").toLowerCase(),
    editorType: String(template.editorType || template.category || "wedding").toLowerCase(),
    price: String(template.price || 0),
    designKey,
    description: template.description || "",
    mainImage: template.cover || "",
    pagePreviewImage: template.pagePreviewImage || "",
    gallery: gallery.join("\n"),
    features: (template.features || []).join("\n"),
    isFeatured: Boolean(template.featured),
    isActive: template.active !== false,
    galleryConfigured: Boolean(template.galleryConfigured),
    imagePosition: normalizeImagePosition(template.imagePosition),
  };
}

function TemplatesPage() {
  const { lang, t } = useAdminI18n();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"cards" | "table">("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);
  const { data: templates, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTemplates(debouncedSearch);
  const visibleTemplates = useMemo(
    () => {
      return (templates || []).filter((template: any) => (
        isKnownDesignKey(template.designKey)
        && !template.deleted
      ));
    },
    [templates]
  );

  const subtitle = error ? error.message : isLoading ? t("loading") : t("templates");

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = async (template: any) => {
    try {
      const details = await adminApi.template(template.id);
      setEditing(details);
      setForm(toForm(details));
      setDialogOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const payload = useMemo(() => ({
    title: form.title,
    slug: form.slug || undefined,
    category: form.category,
    editorType: form.editorType,
    price: Number(form.price || 0),
    designKey: isKnownDesignKey(form.designKey) ? form.designKey : "ivory-vows",
    description: form.description,
    mainImage: form.mainImage,
    pagePreviewImage: form.pagePreviewImage,
    gallery: form.gallery,
    galleryConfigured: true,
    features: form.features,
    isFeatured: form.isFeatured,
    isActive: form.isActive !== false,
    imagePosition: normalizeImagePosition(form.imagePosition),
  }), [form]);

  const saveTemplate = async () => {
    setSaving(true);
    try {
      if (editing) await adminApi.updateTemplate(editing.id, payload);
      else await adminApi.createTemplate(payload);
      await queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success(t("done"));
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (template: any) => {
    if (!confirm(`${t("delete")}: ${template.name}?`)) return;
    try {
      await adminApi.deleteTemplate(template.id);
      toast.success(t("done"));
      void queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const restoreTemplate = async (template: any) => {
    if (!confirm(`${t("restore")}: ${template.name}?`)) return;
    try {
      await adminApi.restoreTemplate(template.id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const duplicateTemplate = async (template: any) => {
    try {
      const details = await adminApi.template(template.id);
      const data = toForm(details);
      await adminApi.createTemplate({
        ...data,
        title: `${template.name} Copy`,
        slug: `${template.slug || template.name}-copy-${Date.now()}`,
        price: Number(data.price),
        designKey: data.designKey,
        isActive: data.isActive,
        galleryConfigured: true,
        imagePosition: normalizeImagePosition(data.imagePosition),
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  return (
    <div>
      <PageHeader
        title={t("templates")}
        subtitle={subtitle}
        actions={
          <>
            <Tabs value={view} onValueChange={(value) => setView(value as "cards" | "table")}>
              <TabsList className="bg-secondary/60">
                <TabsTrigger value="cards" aria-label={t("cardView")}><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="table" aria-label={t("tableView")}><List className="h-4 w-4" /></TabsTrigger>
              </TabsList>
            </Tabs>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate} className="gold-gradient border-0 text-white rounded-full"><Plus className="h-4 w-4 mr-2" />{t("addTemplate")}</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[calc(100dvh-32px)] max-w-4xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{editing ? t("editTemplate") : t("createTemplate")}</DialogTitle>
                </DialogHeader>
                <TemplateForm form={form} setForm={setForm} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
                  <Button disabled={saving || !form.title || !form.description || !form.mainImage} onClick={saveTemplate} className="gold-gradient border-0 text-white">
                    {t("save")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchTemplatesByCode")}
          aria-label={t("searchTemplatesByCode")}
          className="pl-9"
        />
      </div>

      <Tabs value={view}>
        <TabsContent value="cards">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleTemplates.map((template: any) => (
              <Card key={template.id} className={`group overflow-hidden rounded-2xl border-border/60 shadow-[var(--shadow-soft)] transition-all pt-0${template.deleted ? " opacity-65" : " hover:shadow-[var(--shadow-gold)] hover:-translate-y-1"}`}>
                <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
                  <AdminTemplateCover template={template} className="h-full w-full object-cover transition duration-500" />
                  {template.featured && (
                    <div className="absolute top-3 left-3 gold-gradient text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" /> {t("featured")}
                    </div>
                  )}
                  <div className="absolute top-3 right-3"><StatusBadge status={template.status} /></div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg truncate">{template.code || template.name}</h3>
                      <p className="text-xs text-muted-foreground">{formatAdminCategory(template.category, lang)} · {template.designKey}</p>
                    </div>
                    <div className="font-display text-lg text-[color:var(--gold)]">{currency(template.price)}</div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                    <div className="text-xs text-muted-foreground">{t("templateUses").replace("{count}", String(template.usage))}</div>
                    <TemplateActions template={template} onEdit={openEdit} onDuplicate={duplicateTemplate} onDelete={deleteTemplate} onRestore={restoreTemplate} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/60">
                    <TableHead>{t("templateCode")}</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("design")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>{t("usage")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleTemplates.map((template: any) => (
                    <TableRow key={template.id} className="border-border/60 hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <AdminTemplateCover template={template} className="h-10 w-10 object-cover rounded-lg" />
                          <span className="font-medium">{template.code || template.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatAdminCategory(template.category, lang)}</TableCell>
                      <TableCell>{template.designKey}</TableCell>
                      <TableCell>{currency(template.price)}</TableCell>
                      <TableCell>{template.usage}</TableCell>
                      <TableCell><StatusBadge status={template.status} /></TableCell>
                      <TableCell className="text-right">
                        <TemplateActions template={template} onEdit={openEdit} onDuplicate={duplicateTemplate} onDelete={deleteTemplate} onRestore={restoreTemplate} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      {hasNextPage ? (
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="outline" disabled={isFetchingNextPage} onClick={() => void fetchNextPage()}>
            {isFetchingNextPage ? t("loading") : "Ավելին"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function TemplateActions({ template, onEdit, onDuplicate, onDelete, onRestore }: any) {
  const { t } = useAdminI18n();
  const openPreview = () => {
    window.open(`${getClientBaseUrl()}/templates/${template.id}/live`, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={t("actions")}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {template.deleted ? (
          <DropdownMenuItem onClick={() => onRestore(template)}><RotateCcw className="h-4 w-4 mr-2" />{t("restore")}</DropdownMenuItem>
        ) : <>
        <DropdownMenuItem onClick={openPreview}><Eye className="h-4 w-4 mr-2" />{t("preview")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(template)}><Edit className="h-4 w-4 mr-2" />{t("edit")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(template)}><Copy className="h-4 w-4 mr-2" />{t("duplicate")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(template)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />{t("delete")}</DropdownMenuItem>
        </>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TemplateForm({ form, setForm }: any) {
  const { lang, t } = useAdminI18n();
  const set = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }));
  const imagePosition = normalizeImagePosition(form.imagePosition);
  const galleryImages = galleryFromText(form.gallery);
  const setImagePosition = (key: "x" | "y" | "zoom", value: number) => {
    set("imagePosition", { ...imagePosition, [key]: value });
  };
  const setGalleryImages = (images: string[]) => {
    setForm((current: any) => ({
      ...current,
      gallery: images.filter(Boolean).join("\n"),
      galleryConfigured: true,
    }));
  };
  const updateCategory = (category: string) => {
    const storedCategory = category === "other" ? "corporate" : category;
    const editorType = category === "other" ? "corporate" : storedCategory;
    setForm((current: any) => ({ ...current, category: storedCategory, editorType }));
  };
  const updateDesignKey = (designKey: string) => {
    setForm((current: any) => {
      const selectedDesign = staticDesignOptions.find((option) => option.key === designKey);
      const previousDesign = staticDesignOptions.find((option) => option.key === current.designKey);
      const hasExplicitCategory = Boolean(previousDesign && current.category !== previousDesign.category);
      const currentGallery = galleryFromText(current.gallery);
      const currentDefaults = getDefaultGalleryForDesign(current.designKey);
      const currentDefaultGallery = [current.mainImage, ...currentDefaults].filter(Boolean);
      const nextDefaults = getDefaultGalleryForDesign(designKey);
      const nextDefaultGallery = nextDefaults;
      const shouldUseNextDefaults = currentGallery.length === 0 ||
        sameImageList(currentGallery, currentDefaults) ||
        sameImageList(currentGallery, currentDefaultGallery);

      return {
        ...current,
        designKey,
        category: hasExplicitCategory ? current.category : (selectedDesign?.category || current.category),
        editorType: hasExplicitCategory ? current.editorType : (selectedDesign?.category || current.editorType),
        mainImage: shouldUseNextDefaults ? (nextDefaultGallery[0] || current.mainImage) : current.mainImage,
        imagePosition: shouldUseNextDefaults ? defaultImagePosition : current.imagePosition,
        gallery: shouldUseNextDefaults ? nextDefaultGallery.join("\n") : current.gallery,
        galleryConfigured: shouldUseNextDefaults ? false : current.galleryConfigured,
      };
    });
  };
  const chooseImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current: any) => ({
        ...current,
        mainImage: String(reader.result || ""),
        imagePosition: defaultImagePosition,
      }));
    };
    reader.readAsDataURL(file);
  };
  const choosePagePreview = async (file?: File) => {
    if (!file) return;
    if (!PAGE_PREVIEW_TYPES.has(file.type)) {
      toast.error(t("pagePreviewTypeError"));
      return;
    }
    if (file.size > MAX_PAGE_PREVIEW_BYTES) {
      toast.error(t("pagePreviewTooLarge"));
      return;
    }
    set("pagePreviewImage", await readImageFile(file));
  };
  const addGalleryImages = async (files?: FileList | null) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;

    const nextImages = await Promise.all(selectedFiles.map(readImageFile));
    setGalleryImages([...galleryImages, ...nextImages]);
  };
  const replaceGalleryImage = async (index: number, file?: File) => {
    if (!file) return;

    const nextImage = await readImageFile(file);
    setGalleryImages(galleryImages.map((image, imageIndex) => (imageIndex === index ? nextImage : image)));
  };
  const removeGalleryImage = (index: number) => {
    const nextImages = galleryImages.filter((_, imageIndex) => imageIndex !== index);
    setGalleryImages(nextImages);
  };
  const makeGalleryImageCover = (image: string) => {
    setForm((current: any) => ({
      ...current,
      mainImage: image,
      imagePosition: defaultImagePosition,
    }));
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 py-2">
      <div className="space-y-2"><Label>{t("title")}</Label><Input value={form.title} onChange={(event) => set("title", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("slug")}</Label><Input value={form.slug} onChange={(event) => set("slug", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("category")}</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={toAdminCategory(form.category)} onChange={(event) => updateCategory(event.target.value)}>{adminCategoryOptions.map((value) => <option key={value} value={value}>{formatAdminCategory(value, lang)}</option>)}</select></div>
      <div className="space-y-2"><Label>{t("price")}</Label><Input type="number" value={form.price} onChange={(event) => set("price", event.target.value)} /></div>
      <div className="space-y-2 sm:col-span-2"><Label>Խմբագրման բաժին</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.editorType} onChange={(event) => set("editorType", event.target.value)}>{[['wedding', 'Հարսանիքի խմբագրում'], ['baptism', 'Մկրտության խմբագրում'], ['engagement', 'Նշանադրության խմբագրում'], ['birth', 'Ծնունդի խմբագրում'], ['corporate', 'Կորպորատիվ խմբագրում'], ['military', 'Բանակի քեֆի հրավիրատոմս']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><p className="text-xs text-muted-foreground">Ընտրում է տվյալ առիթին համապատասխան դաշտերը՝ անկախ դիզայնից։</p></div>
      <div className="space-y-2 sm:col-span-2">
        <Label>{t("invitationDesign")}</Label>
        <select
          value={form.designKey}
          onChange={(event) => updateDesignKey(event.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {staticDesignOptions.map((option) => (
            <option key={option.key} value={option.key}>{option.label}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">{t("designHelp")}</p>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label>{t("mainImage")}</Label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input value={form.mainImage} onChange={(event) => set("mainImage", event.target.value)} placeholder={t("imagePlaceholder")} />
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/70 bg-background px-4 text-sm font-medium shadow-sm transition hover:border-[color:var(--gold)]">
            <Upload className="h-4 w-4" />
            {t("upload")}
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files?.[0])} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">{t("mainImageHelp")}</p>
        {form.mainImage ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,260px)_1fr]">
            <TemplateCardPreview form={form} />
            <div className="space-y-4 rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t("moveHorizontal")}</span>
                  <span className="text-muted-foreground">{Math.round(imagePosition.x)}%</span>
                </div>
                <Slider value={[imagePosition.x]} min={0} max={100} step={1} onValueChange={([value]) => setImagePosition("x", value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t("moveVertical")}</span>
                  <span className="text-muted-foreground">{Math.round(imagePosition.y)}%</span>
                </div>
                <Slider value={[imagePosition.y]} min={0} max={100} step={1} onValueChange={([value]) => setImagePosition("y", value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t("zoom")}</span>
                  <span className="text-muted-foreground">{imagePosition.zoom.toFixed(2)}x</span>
                </div>
                <Slider value={[imagePosition.zoom]} min={1} max={2} step={0.01} onValueChange={([value]) => setImagePosition("zoom", value)} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="space-y-3 rounded-2xl border border-border/60 bg-secondary/20 p-4 sm:col-span-2">
        <div className="space-y-1">
          <Label>{t("pagePreviewImage")}</Label>
          <p className="text-xs leading-5 text-muted-foreground">{t("pagePreviewHelp")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <Input
            value={form.pagePreviewImage}
            onChange={(event) => set("pagePreviewImage", event.target.value)}
            placeholder={t("imagePlaceholder")}
          />
          <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/70 bg-background px-4 text-sm font-medium shadow-sm transition hover:border-[color:var(--gold)] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <Upload className="h-4 w-4" />
            {t("upload")}
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => { void choosePagePreview(event.target.files?.[0]); event.target.value = ""; }}
            />
          </label>
          {form.pagePreviewImage ? (
            <Button type="button" variant="outline" onClick={() => set("pagePreviewImage", "")}>
              <Trash2 className="mr-2 h-4 w-4" />{t("pagePreviewRemove")}
            </Button>
          ) : null}
        </div>
        {form.pagePreviewImage ? (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background p-3">
            <div className="mx-auto max-h-80 max-w-sm overflow-y-auto rounded-lg border border-border/60 bg-secondary/30">
              <img
                src={getPreviewImage(form.pagePreviewImage)}
                alt={t("pagePreviewImage")}
                className="block h-auto w-full"
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className="space-y-3 rounded-2xl border border-border/60 bg-secondary/20 p-4 sm:col-span-2">
        <div className="space-y-2">
          <Label>{t("description")}</Label>
          <Textarea
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            rows={6}
            placeholder={t("descriptionPlaceholder")}
          />
        </div>
        <p className="text-xs text-muted-foreground">{t("descriptionHelp")}</p>
      </div>
      <div className="space-y-3 sm:col-span-2">
        <Label>{t("gallery")}</Label>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {galleryImages.map((image, index) => (
              <div key={`${image.slice(0, 32)}-${index}`} className="group relative overflow-hidden rounded-xl border border-border/70 bg-secondary/30 p-1">
                <img src={getPreviewImage(image)} alt={`${t("gallery")} ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                <div className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded-b-lg bg-black/45 p-1 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
                  <Button type="button" size="sm" variant="secondary" className="h-9 flex-1 rounded-lg px-2 text-[11px]" onClick={() => makeGalleryImageCover(image)}>
                    {t("makeCover")}
                  </Button>
                  <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-white/90 text-foreground shadow-sm transition hover:bg-white" aria-label={`${t("replaceImage")} ${index + 1}`}>
                    <Upload className="h-4 w-4" />
                    <input className="sr-only" type="file" accept="image/*" onChange={(event) => replaceGalleryImage(index, event.target.files?.[0])} />
                  </label>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-9 w-9 rounded-full bg-white text-destructive shadow-md hover:bg-destructive hover:text-white"
                  onClick={() => removeGalleryImage(index)}
                  aria-label={`${t("removeImage")} ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-secondary/20 p-4 text-sm text-muted-foreground">
            {t("noGalleryImages")}
          </div>
        )}
        <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--gold)]/50 bg-secondary/20 px-4 text-sm font-medium transition hover:bg-secondary/40">
          <Upload className="h-5 w-5" />
          {t("addImages")}
          <input className="sr-only" type="file" accept="image/*" multiple onChange={(event) => addGalleryImages(event.target.files)} />
        </label>
        <Textarea value={form.gallery} onChange={(event) => set("gallery", event.target.value)} rows={3} className="text-xs" />
        <p className="text-xs text-muted-foreground">{t("galleryHelp")}</p>
      </div>
      <div className="space-y-2"><Label>{t("features")}</Label><Textarea value={form.features} onChange={(event) => set("features", event.target.value)} rows={4} /></div>
      <label className="flex items-center gap-3"><Switch checked={form.isFeatured} onCheckedChange={(checked) => set("isFeatured", checked)} /> {t("featured")}</label>
      <label className="flex items-center gap-3"><Switch checked={form.isActive} onCheckedChange={(checked) => set("isActive", checked)} /> {t("activeOnWebsite")}</label>
    </div>
  );
}

function TemplateCardPreview({ form }: any) {
  const { lang, t } = useAdminI18n();
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img src={getPreviewImage(form.mainImage)} alt="" className="h-full w-full object-cover" style={getImageStyle(form.imagePosition)} />
        {form.isFeatured ? (
          <div className="absolute left-3 top-3 gold-gradient rounded-full px-2 py-1 text-[10px] font-medium text-white">
            {t("featured")}
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg">{form.title || t("title")}</h3>
            <p className="text-xs text-muted-foreground">{formatAdminCategory(form.category, lang)} · {form.designKey}</p>
          </div>
          <div className="font-display text-lg text-[color:var(--gold)]">{currency(Number(form.price || 0))}</div>
        </div>
        <div className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">{t("templateUses").replace("{count}", "0")}</div>
      </div>
    </div>
  );
}
