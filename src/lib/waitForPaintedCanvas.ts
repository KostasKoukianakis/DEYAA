/** Resolves once a canvas under `root` has a real GPU buffer, plus two frames to paint. */
export function waitForPaintedCanvas(
  root: HTMLElement,
  selector = "canvas",
  timeoutMs = 8000,
): Promise<void> {
  return new Promise((resolve) => {
    const started = Date.now();
    let frames = 0;

    const finish = () => resolve();

    const tick = () => {
      const canvas = root.querySelector<HTMLCanvasElement>(selector);
      const ready =
        Boolean(canvas) &&
        canvas!.width > 1 &&
        canvas!.height > 1 &&
        canvas!.clientWidth > 50 &&
        canvas!.clientHeight > 50;

      if (ready) {
        frames += 1;
        if (frames >= 2) {
          finish();
          return;
        }
      } else {
        frames = 0;
      }

      if (Date.now() - started >= timeoutMs) {
        finish();
        return;
      }

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
}
