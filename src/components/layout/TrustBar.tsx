import { Phone, AlertTriangle } from "lucide-react";

export function TrustBar() {
  return (
    <div className="bg-primary text-primary-foreground text-sm">
      <div className="container flex flex-wrap items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0" />
          <span className="font-medium">Τηλέφωνα Βλαβών 24/7</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <a
            href="tel:+302825340208"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-foreground/90 cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Ύδρευση: <strong>28253-40208</strong></span>
          </a>
          <a
            href="tel:+302825340213"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-foreground/90 cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Εξυπηρέτηση: <strong>28253-40213</strong></span>
          </a>
        </div>
      </div>
    </div>
  );
}
