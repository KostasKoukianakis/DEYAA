/** Routes that share the Palladio e-services visual system (hub + subpages). */
export function isEServicesArea(pathname: string): boolean {
  return pathname === "/e-services" || pathname.startsWith("/e-services/");
}

export function isEServicesSubpage(pathname: string): boolean {
  return pathname.startsWith("/e-services/") && pathname !== "/e-services";
}
