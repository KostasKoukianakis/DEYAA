import { categoryToSlug, pickFallbackImage } from "@/data/deyaaAnnouncementsArchive";
import { deyaaSeedAnnouncements, deyaaSeedAnnouncementsExtra } from "@/data/deyaaSeedAnnouncements";
import { deyaaNewsPosts, type DeyaaNewsPost } from "@/data/deyaaNewsPosts";
import { categorySlugLabel } from "@/i18n/localized";
import { formatDate, t } from "@/i18n/runtime";
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
  "arch-07",
] as const;

const allSeed = [...deyaaSeedAnnouncements, ...deyaaSeedAnnouncementsExtra];

function fallbackTitle(id: string, seedTitle: string): string {
  const key = `news.fallback.${id}`;
  const localized = t(key);
  return localized === key ? seedTitle : localized;
}

function fallbackImageAlt(id: string, title: string): string {
  const index = id.startsWith("arch-0") ? Number(id.slice(-1)) : NaN;
  if (index >= 1 && index <= 3) {
    return t(`news.posts.news-0${index}.alt`);
  }
  return title;
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

export const HOME_NEWS_POST_LIMIT = 3;

export type PublishedNewsSource = {
  id: string;
  title: string;
  category: string;
  published_at: string | null;
  created_at: string;
  featured_image: string | null;
};

/** Latest published posts for homepage [04] — title, date, and image from CMS. */
export function mapPublishedPostsToNewsPosts(
  posts: PublishedNewsSource[],
  limit = HOME_NEWS_POST_LIMIT,
): DeyaaNewsPost[] {
  return posts.slice(0, limit).map((post, index) => {
    const dateIso = post.published_at ?? post.created_at;
    return {
      id: post.id,
      date: formatDate(dateIso),
      dateIso,
      tabLabel: `${String(index + 1).padStart(2, "0")} ${shortTabLabel(post.title, post.category)}`,
      titleLines: splitTitleLines(post.title),
      href: `/announcements/${post.id}`,
      image: post.featured_image ?? pickFallbackImage(index),
      imageAlt: post.title,
    };
  });
}

/** Map announcements to DeyaaNewsPost[] for section [04] carousel. */
export function buildRelatedNewsPosts(
  sources: RelatedNewsSource[],
  currentId: string,
  options?: { fillFromStatic?: boolean; limit?: number },
): DeyaaNewsPost[] {
  const limit = options?.limit ?? HOME_NEWS_POST_LIMIT;
  const fillFromStatic = options?.fillFromStatic ?? true;
  const picked: RelatedNewsSource[] = [];

  for (const source of sources) {
    if (picked.length >= limit) break;
    if (source.id === currentId) continue;
    if (picked.some((item) => item.id === source.id)) continue;
    picked.push(source);
  }

  if (fillFromStatic && picked.length < limit) {
    for (const fallback of deyaaNewsPosts) {
      if (picked.length >= limit) break;
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

  return picked.slice(0, limit).map((item, index) => ({
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
  posts: PublishedNewsSource[],
  currentId: string,
): DeyaaNewsPost[] {
  const sources: RelatedNewsSource[] = posts.map((post, index) => ({
    id: post.id,
    title: post.title,
    date: formatDate(post.published_at ?? post.created_at),
    href: `/announcements/${post.id}`,
    image: post.featured_image ?? pickFallbackImage(index),
    category: post.category,
  }));
  return buildRelatedNewsPosts(sources, currentId, { fillFromStatic: false });
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

  const categorySlug = categoryToSlug(seed.category);
  const title = fallbackTitle(id, seed.title);

  return {
    id,
    title,
    date: formatDate(dateIso),
    dateIso,
    category: categorySlugLabel(categorySlug),
    categorySlug,
    image: seed.featured_image,
    imageAlt: fallbackImageAlt(id, title),
    excerpt: seed.excerpt,
    bodyHtml: null,
    paragraphs,
  };
}

export function getFallbackAnnouncementDetail(id: string): AnnouncementDetail | null {
  const index = fallbackIds.indexOf(id as (typeof fallbackIds)[number]);
  if (index < 0) return null;
  return buildFallbackDetail(fallbackIds[index], index);
}

export function buildRelatedNewsPostsFromFallback(currentId: string): DeyaaNewsPost[] {
  const sources: RelatedNewsSource[] = fallbackIds.map((id, index) => {
    const detail = buildFallbackDetail(id, index);
    return {
      id: detail.id,
      title: detail.title,
      date: detail.date,
      href: `/announcements/${detail.id}`,
      image: detail.image,
      category: detail.category,
    };
  });
  return buildRelatedNewsPosts(sources, currentId);
}

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
    date: formatDate(dateIso),
    dateIso,
    category: categorySlugLabel(categoryToSlug(post.category)),
    categorySlug: categoryToSlug(post.category),
    image: post.featured_image ?? pickFallbackImage(index),
    imageAlt: post.title,
    excerpt: excerpt || bodyParagraphs[0] || post.title,
    bodyHtml,
    paragraphs,
  };
}
