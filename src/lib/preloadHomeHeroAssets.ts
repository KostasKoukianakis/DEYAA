import { bindImageReady } from "@/lib/bindImageReady";
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
    bindImageReady(
      img,
      () => {
        if (typeof img.decode === "function") {
          void img.decode().then(() => resolve(), () => resolve());
        } else {
          resolve();
        }
      },
      () => reject(new Error(`Failed to preload ${src}`)),
    );
    img.src = src;
  });
}

async function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, 2000);
      }),
    ]);
  } catch {
    /* ignore */
  }
}

/** Critical homepage hero assets — brand lockup + tank visual (static on phone/tablet). */
export async function preloadHomeHeroAssets(): Promise<void> {
  const results = await Promise.allSettled([
    preloadImage(HOME_HERO_BRAND_IMAGE),
    isHeroTankLightViewport()
      ? preloadImage(HERO_TANK_STATIC_IMAGE)
      : loadTankFrame(1).then(() => undefined),
    waitForFonts(),
  ]);

  if (results.every((result) => result.status === "rejected")) {
    throw new Error("Home hero assets failed to preload");
  }
}
