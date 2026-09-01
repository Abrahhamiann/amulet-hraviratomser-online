export const templateAssetSources: Record<string, string>;

export const templateDefaultGalleryIds: Record<string, readonly string[]>;

export function resolveTemplateImage(image?: string | null): string;

export function resolveTemplateImages(
  images?: ReadonlyArray<string | null | undefined>
): string[];

export function getConfiguredTemplateGallery(
  template?: {
    gallery?: ReadonlyArray<string | null | undefined>;
    galleryConfigured?: boolean;
    mainImage?: string | null;
  },
  fallbackGallery?: ReadonlyArray<string | null | undefined>
): string[];
