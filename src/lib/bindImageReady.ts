/** Fires once whether the image is already cached or still loading. */
export function bindImageReady(
  image: HTMLImageElement,
  onReady: () => void,
  onError?: () => void,
): void {
  let settled = false;
  const finish = (ok: boolean) => {
    if (settled) return;
    settled = true;
    if (ok) onReady();
    else onError?.();
  };

  image.onload = () => finish(true);
  image.onerror = () => finish(false);

  if (image.src && image.complete) {
    if (image.naturalWidth > 0) finish(true);
    else finish(false);
  }
}
