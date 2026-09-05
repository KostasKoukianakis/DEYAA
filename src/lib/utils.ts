import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** React 18 warns on fetchPriority; the HTML attribute is fetchpriority. */
export const fetchPriorityHigh = { fetchpriority: "high" } as Record<string, "high">;
