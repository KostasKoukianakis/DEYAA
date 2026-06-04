import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  breadcrumbs?: Breadcrumb[];
  children?: ReactNode;
  className?: string;
}

export function PageHero({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-primary text-primary-foreground",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/10 blur-2xl" aria-hidden />

      <div className="container relative py-14 md:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-primary-foreground/70">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="transition-colors hover:text-primary-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary-foreground/90">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-start gap-4">
          {Icon && (
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Icon className="h-7 w-7" />
            </div>
          )}
          <div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-base md:text-lg text-primary-foreground/80 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
