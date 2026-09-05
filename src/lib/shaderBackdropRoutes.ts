/** Sparse public pages that reuse the homepage water-plane instead of a flat white fill. */
export function isShaderBackdropPath(pathname: string) {
  return pathname === "/privacy" || pathname === "/terms" || pathname === "/verify-email";
}
