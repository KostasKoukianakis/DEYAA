import type { ReactNode } from "react";
import { useLegalSectionSpy, type LegalTocItem } from "@/hooks/useLegalSectionSpy";

type LegalDocumentProps = {
  title: string;
  updated?: string;
  tocAria: string;
  toc: readonly LegalTocItem[];
  children: ReactNode;
};

export function LegalList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="legal-doc__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="legal-doc__section">
      <h2 className="legal-doc__heading">{title}</h2>
      <div className="legal-doc__body">{children}</div>
    </section>
  );
}

export function LegalDocument({ title, updated, tocAria, toc, children }: LegalDocumentProps) {
  const { active, select } = useLegalSectionSpy(toc);

  return (
    <article className="legal-doc">
      <header className="legal-doc__hero">
        <h1 className="legal-doc__title">{title}</h1>
        {updated ? <p className="legal-doc__meta">{updated}</p> : null}
      </header>

      <div className="legal-doc__layout">
        <nav className="legal-doc__toc" aria-label={tocAria}>
          {toc.map((item, index) => {
            const isActive = item.id === active;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={isActive ? "legal-doc__toc-link is-active" : "legal-doc__toc-link"}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  select(item.id);
                }}
              >
                <span className="legal-doc__toc-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="legal-doc__toc-label">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="legal-doc__content">{children}</div>
      </div>
    </article>
  );
}
