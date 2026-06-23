import {
  ClipboardList,
  Factory,
  FileText,
  FlaskConical,
  Headset,
  Plug,
  ShieldAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const SERVICE_DECOR_ICON_IDS = [
  "plug",
  "wrench",
  "factory",
  "shield-alert",
  "flask-conical",
  "clipboard-list",
  "file-text",
  "headset",
] as const;

export type ServiceDecorIconId = (typeof SERVICE_DECOR_ICON_IDS)[number];

const DECOR_ICONS: Record<ServiceDecorIconId, LucideIcon> = {
  plug: Plug,
  wrench: Wrench,
  factory: Factory,
  "shield-alert": ShieldAlert,
  "flask-conical": FlaskConical,
  "clipboard-list": ClipboardList,
  "file-text": FileText,
  headset: Headset,
};

export function PalladioServiceDecorIcon({
  iconId,
  className,
}: {
  iconId: ServiceDecorIconId;
  className?: string;
}) {
  const Icon = DECOR_ICONS[iconId];

  return (
    <Icon
      className={cn("palladio-services-page__accordion-decor-icon", className)}
      strokeWidth={1.15}
      aria-hidden
    />
  );
}
