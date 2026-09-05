import { bindImageReady } from "@/lib/bindImageReady";
import { loadTankFrame } from "@/lib/heroTankFrameRenderer";
import { isHeroTankLightViewport } from "@/lib/heroTankFrames";

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

/** Critical homepage hero assets — brand lockup only on phone (tank sits below the first viewport). */
export async function preloadHomeHeroAssets(): Promise<void> {
  const results = await Promise.allSettled([
    preloadImage(HOME_HERO_BRAND_IMAGE),
    isHeroTankLightViewport()
      ? Promise.resolve()
      : loadTankFrame(1).then(() => undefined),
  ]);

  if (results.every((result) => result.status === "rejected")) {
    throw new Error("Home hero assets failed to preload");
  }
}
