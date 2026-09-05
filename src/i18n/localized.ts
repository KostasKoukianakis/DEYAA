import { aboutTimelineMilestones, boardMembers, orgDepartments, type AboutTimelineMilestone, type BoardMember, type OrgDepartment } from "@/data/aboutContent";
import { deyaaEServiceSections, type DeyaaEServiceSection } from "@/data/deyaaEServicesHub";
import { deyaaPortalHandoffs, type DeyaaPortalServiceHandoff } from "@/data/deyaaExternalServices";
import { heroServices, type HeroServiceItem } from "@/data/heroServices";
import { deyaaNewsPosts, type DeyaaNewsPost } from "@/data/deyaaNewsPosts";
import { deyaaServiceHubItems, type DeyaaServiceHubItem } from "@/data/deyaaServiceHub";
import {
  deyaaServicesHubSections,
  type DeyaaServicesHubSection,
} from "@/data/deyaaServicesHub";
import { deyaaAnnouncementsFallback, type AnnouncementArchiveItem } from "@/data/deyaaAnnouncementsArchive";
import { formatDate, t } from "@/i18n/runtime";
import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";

export function issue(path: string): FormValidationIssue {
  return {
    title: t(`${path}.title`),
    description: t(`${path}.description`),
  };
}

export function getLocalizedHeroServices(): HeroServiceItem[] {
  return heroServices.map((item) => ({
    ...item,
    title: t(`home.cards.${item.id}.title`),
    description: t(`home.cards.${item.id}.description`),
    secondaryLabel: item.secondaryLabel
      ? t(`home.cards.${item.id}.secondaryLabel`)
      : undefined,
  }));
}

export function getLocalizedServiceHubItems(): DeyaaServiceHubItem[] {
  return deyaaServiceHubItems.map((item) => ({
    ...item,
    title: t(`home.hub.${item.id}Title`),
    body: t(`home.hub.${item.id}Body`),
  }));
}

export function getLocalizedNewsPosts(): DeyaaNewsPost[] {
  return deyaaNewsPosts.map((post) => ({
    ...post,
    date: formatDate(post.dateIso ?? post.date),
    tabLabel: t(`news.posts.${post.id}.tab`),
    titleLines: [t(`news.posts.${post.id}.line1`), t(`news.posts.${post.id}.line2`)],
    imageAlt: t(`news.posts.${post.id}.alt`),
  }));
}

export function getLocalizedArchiveFallback(): AnnouncementArchiveItem[] {
  return deyaaAnnouncementsFallback.map((item) => ({
    ...item,
    title: t(`news.fallback.${item.id}`),
    date: formatDate(item.dateIso),
    category: t(`news.categories.${item.categorySlug}`),
    imageAlt: item.id.startsWith("arch-0") && Number(item.id.slice(-1)) <= 3
      ? t(`news.posts.news-0${item.id.slice(-1)}.alt`)
      : t(`news.fallback.${item.id}`),
  }));
}

export function categorySlugLabel(slug: string): string {
  const key = `news.categories.${slug}`;
  const label = t(key);
  return label === key ? t("news.categories.news") : label;
}

function highlightList(sectionId: string): string[] {
  const first = t(`services.sections.${sectionId}.leadHighlights.0`);
  const second = t(`services.sections.${sectionId}.leadHighlights.1`);
  return [first, second].filter((value) => value && !value.includes("leadHighlights"));
}

export function getLocalizedServicesHubSections(): DeyaaServicesHubSection[] {
  return deyaaServicesHubSections.map((section) => {
    const base = `services.sections.${section.id}`;
    return {
      ...section,
      title: t(`${base}.title`),
      lead: t(`${base}.lead`),
      leadHighlights: highlightList(section.id),
      blocks: section.blocks.map((block) => ({
        ...block,
        title: t(`${base}.blocks.${block.id}.title`),
        paragraphs: block.paragraphs
          ? [t(`${base}.blocks.${block.id}.paragraph`)]
          : undefined,
        introBeforeBullets: block.introBeforeBullets
          ? t(`${base}.blocks.${block.id}.intro`)
          : undefined,
        bullets: block.bullets?.map((bullet, index) => ({
          label: t(`${base}.blocks.${block.id}.bullets.${index}.label`),
          text: t(`${base}.blocks.${block.id}.bullets.${index}.text`),
        })),
      })),
    };
  });
}

function accordionCopy(
  sectionId: string,
  accordionId: string,
  bullets?: { label: string; text: string }[],
) {
  const base = `eServices.sections.${sectionId}.accordions.${accordionId}`;
  return {
    title: t(`${base}.title`),
    body: t(`${base}.body`),
    bullets: bullets?.map((_, index) => ({
      label: t(`${base}.bullets.${index}.label`),
      text: t(`${base}.bullets.${index}.text`),
    })),
  };
}

export function getLocalizedEServiceSections(): DeyaaEServiceSection[] {
  return deyaaEServiceSections.map((section) => {
    const base = `eServices.sections.${section.id}`;
    return {
      ...section,
      navLabel: t(`${base}.navLabel`),
      title: t(`${base}.title`),
      lead: t(`${base}.lead`),
      tags: section.tags?.map((_, index) => t(`${base}.tags.${index}`)),
      accordions: section.accordions.map((accordion) => ({
        ...accordion,
        ...accordionCopy(section.id, accordion.id, accordion.bullets),
      })),
    };
  });
}

export function getLocalizedPortalHandoff(serviceId: string): DeyaaPortalServiceHandoff | undefined {
  const source = deyaaPortalHandoffs[serviceId];
  if (!source) return undefined;
  const key = serviceId === "meter-reading" ? "meter" : serviceId;
  const base = `eServices.handoff.${key}`;
  return {
    ...source,
    portalMenuLabel: t(`${base}.portalMenuLabel`),
    ctaLabel: t(`${base}.ctaLabel`),
    steps: source.steps.map((_, index) => t(`${base}.step${index}`)),
    requirements: source.requirements.map((_, index) => t(`${base}.req${index}`)),
  };
}

export function getLocalizedTimeline(): AboutTimelineMilestone[] {
  return aboutTimelineMilestones.map((milestone) => ({
    ...milestone,
    year: t(`about.history.milestones.${milestone.id}.year`),
    title: t(`about.history.milestones.${milestone.id}.title`),
    description: t(`about.history.milestones.${milestone.id}.description`),
    chapter: milestone.chapter
      ? t(`about.history.milestones.${milestone.id}.chapter`)
      : undefined,
  }));
}

export function getLocalizedBoardMembers(): BoardMember[] {
  return boardMembers.map((member) => ({
    ...member,
    role: t(`about.board.members.${member.name}.role`),
    position: t(`about.board.members.${member.name}.position`),
    hoverDetail: member.hoverDetail
      ? t(`about.board.members.${member.name}.hoverDetail`)
      : undefined,
  }));
}

export function getLocalizedDepartments(): OrgDepartment[] {
  return orgDepartments.map((dept, index) => ({
    title: t(`about.structure.departments.${index}.title`),
    description: t(`about.structure.departments.${index}.description`),
  }));
}
