// Next.js image-optimizer URL for images used as CSS backgrounds, where
// next/image cannot be used. Serves the same image resized and as AVIF/WebP.
// `width` must be one of Next's device sizes (640, 750, 828, 1080, 1200, 1920, 2048, 3840).
export const optimizedImageUrl = (src, width = 1920) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

// Hero backgrounds: 828px wide below the md breakpoint (768px), else 1920px.
export const HERO_BG_SMALL = 828;
export const HERO_BG_LARGE = 1920;
export const heroBgUrl = (src) =>
  optimizedImageUrl(
    src,
    typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
      ? HERO_BG_SMALL
      : HERO_BG_LARGE,
  );
