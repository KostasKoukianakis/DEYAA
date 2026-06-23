import { categoryToSlug, pickFallbackImage } from "@/data/deyaaAnnouncementsArchive";
import { deyaaSeedAnnouncements, deyaaSeedAnnouncementsExtra } from "@/data/deyaaSeedAnnouncements";
import { deyaaNewsPosts, type DeyaaNewsPost } from "@/data/deyaaNewsPosts";
import { isHtmlContent, sanitizeAnnouncementHtml } from "@/lib/sanitizeHtml";

export interface AnnouncementDetail {
  id: string;
  title: string;
  date: string;
  dateIso: string;
  category: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  bodyHtml: string | null;
  paragraphs: string[];
}

const fallbackIds = [
  "arch-01",
  "arch-02",
  "arch-03",
  "arch-04",
  "arch-05",
  "arch-06",
] as const;

const allSeed = [...deyaaSeedAnnouncements, ...deyaaSeedAnnouncementsExtra];

function formatGreekDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("el-GR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function splitTitleLines(title: string): [string, string] {
  const colonMatch = title.match(/^(.+?:)\s*(.+)$/);
  if (colonMatch) {
    return [colonMatch[1].trim(), colonMatch[2].trim()];
  }
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return [title, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function shortTabLabel(title: string, category?: string): string {
  if (category) {
    return category.length > 32 ? `${category.slice(0, 29)}…` : category;
  }
  return title.split(/\s+/).slice(0, 4).join(" ");
}

export interface RelatedNewsSource {
  id: string;
  title: string;
  date: string;
  href: string;
  image: string;
  category?: string;
}

/** Map announcements to DeyaaNewsPost[] for section [04] carousel (always 3 items). */
export function buildRelatedNewsPosts(
  sources: RelatedNewsSource[],
  currentId: string,
): DeyaaNewsPost[] {
  const picked: RelatedNewsSource[] = [];

  for (const source of sources) {
    if (picked.length >= 3) break;
    if (source.id === currentId) continue;
    if (picked.some((item) => item.id === source.id)) continue;
    picked.push(source);
  }

  if (picked.length < 3) {
    for (const fallback of deyaaNewsPosts) {
      if (picked.length >= 3) break;
      if (fallback.id === currentId || picked.some((item) => item.id === fallback.id)) continue;
      picked.push({
        id: fallback.id,
        title: `${fallback.titleLines[0]} ${fallback.titleLines[1]}`.trim(),
        date: fallback.date,
        href: fallback.href,
        image: fallback.image,
      });
    }
  }

  return picked.slice(0, 3).map((item, index) => ({
    id: item.id,
    date: item.date,
    tabLabel: `${String(index + 1).padStart(2, "0")} ${shortTabLabel(item.title, item.category)}`,
    titleLines: splitTitleLines(item.title),
    href: item.href,
    image: item.image,
    imageAlt: item.title,
  }));
}

export function buildRelatedNewsPostsFromPublished(
  posts: Array<{
    id: string;
    title: string;
    category: string;
    published_at: string | null;
    created_at: string;
    featured_image: string | null;
  }>,
  currentId: string,
): DeyaaNewsPost[] {
  const sources: RelatedNewsSource[] = posts.map((post, index) => ({
    id: post.id,
    title: post.title,
    date: formatGreekDate(post.published_at ?? post.created_at),
    href: `/announcements/${post.id}`,
    image: post.featured_image ?? pickFallbackImage(index),
    category: post.category,
  }));
  return buildRelatedNewsPosts(sources, currentId);
}

/** Split plain-text post body into display paragraphs. */
export function splitContentToParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function buildFallbackDetail(
  id: (typeof fallbackIds)[number],
  index: number,
): AnnouncementDetail {
  const seed = allSeed[index];
  const dateIso = seed.published_at;
  const lead = seed.excerpt.trim();
  const body = seed.content.trim();
  const paragraphs =
    lead && lead !== body
      ? [lead, ...splitContentToParagraphs(body)]
      : splitContentToParagraphs(body);

  return {
    id,
    title: seed.title,
    date: formatGreekDate(dateIso),
    dateIso,
    category: seed.category,
    categorySlug: categoryToSlug(seed.category),
    image: seed.featured_image,
    imageAlt: seed.title,
    excerpt: seed.excerpt,
    bodyHtml: null,
    paragraphs,
  };
}

export const deyaaAnnouncementDetailsFallback: Record<string, AnnouncementDetail> =
  Object.fromEntries(
    fallbackIds.map((id, index) => [id, buildFallbackDetail(id, index)]),
  );

export function getFallbackAnnouncementDetail(id: string): AnnouncementDetail | null {
  return deyaaAnnouncementDetailsFallback[id] ?? null;
}

export function buildRelatedNewsPostsFromFallback(currentId: string): DeyaaNewsPost[] {
  const sources: RelatedNewsSource[] = Object.values(deyaaAnnouncementDetailsFallback).map(
    (detail) => ({
      id: detail.id,
      title: detail.title,
      date: detail.date,
      href: `/announcements/${detail.id}`,
      image: detail.image,
      category: detail.category,
    }),
  );
  return buildRelatedNewsPosts(sources, currentId);
}

export const deyaaAnnouncementDetailCopy = {
  breadcrumb: "Ανακοινώσεις",
  relatedKicker: "Ανακοινώσεις",
  relatedTitle: "Επόμενα νέα",
  relatedDescription:
    "Μια οργάνωση σε συνεχή εξέλιξη σημαίνει έργα που προλαβαίνουν τις ανάγκες, συνεργασίες που δημιουργούν αξία και στόχους που μιλούν για δέσμευση. Διαβάστε τα τελευταία νέα από τον κόσμο της ΔΕΥΑΑ.",
  contactTitle: "Επικοινωνήστε μαζί μας",
  contactCta: "Μετάβαση στην επικοινωνία",
  contactHref: "/contact",
  loading: "Φόρτωση ανακοίνωσης…",
  notFound: "Η ανακοίνωση δεν βρέθηκε.",
  backToArchive: "Όλες οι ανακοινώσεις",
};

export function mapPostToDetail(
  post: {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    category: string;
    published_at: string | null;
    created_at: string;
    featured_image: string | null;
  },
  index = 0,
): AnnouncementDetail {
  const dateIso = post.published_at ?? post.created_at;
  const excerpt = post.excerpt?.trim() ?? "";
  const rawContent = post.content?.trim() ?? "";
  const bodyHtml = isHtmlContent(rawContent)
    ? sanitizeAnnouncementHtml(rawContent)
    : null;
  const bodyParagraphs = splitContentToParagraphs(rawContent);
  const paragraphs =
    bodyHtml
      ? excerpt
        ? [excerpt]
        : []
      : excerpt && !bodyParagraphs.includes(excerpt)
        ? [excerpt, ...bodyParagraphs]
        : bodyParagraphs.length > 0
          ? bodyParagraphs
          : excerpt
            ? [excerpt]
            : [];

  return {
    id: post.id,
    title: post.title,
    date: formatGreekDate(dateIso),
    dateIso,
    category: post.category,
    categorySlug: categoryToSlug(post.category),
    image: post.featured_image ?? pickFallbackImage(index),
    imageAlt: post.title,
    excerpt: excerpt || bodyParagraphs[0] || post.title,
    bodyHtml,
    paragraphs,
  };
}
