import { loadTankFrame } from "@/lib/heroTankFrameRenderer";
import {
  HERO_TANK_STATIC_IMAGE,
  isHeroTankLightViewport,
} from "@/lib/heroTankFrames";

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

/** Critical homepage hero assets — brand lockup + tank visual (static on phone/tablet). */
export async function preloadHomeHeroAssets(): Promise<void> {
  const results = await Promise.allSettled([
    preloadImage(HOME_HERO_BRAND_IMAGE),
    isHeroTankLightViewport()
      ? preloadImage(HERO_TANK_STATIC_IMAGE)
      : loadTankFrame(1).then(() => undefined),
  ]);

  if (results.every((result) => result.status === "rejected")) {
    throw new Error("Home hero assets failed to preload");
  }
}
