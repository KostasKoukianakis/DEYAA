import { loadTankFrame } from "@/lib/heroTankFrameRenderer";

export const HOME_HERO_BRAND_IMAGE = "/hero/homepageimage.webp";

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload ${src}`));
    img.src = src;
  });
}

/** Critical homepage hero assets — brand lockup + first tank frame. */
export async function preloadHomeHeroAssets(): Promise<void> {
  const results = await Promise.allSettled([
    preloadImage(HOME_HERO_BRAND_IMAGE),
    loadTankFrame(1).then(() => undefined),
  ]);

  if (results.every((result) => result.status === "rejected")) {
    throw new Error("Home hero assets failed to preload");
  }
}
