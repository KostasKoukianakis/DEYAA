import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DASHBOARD_BADGES_QUERY_KEY = ["dashboard-badges"] as const;

export interface DashboardBadges {
  postsDraft: number;
  problemsNew: number;
  contactMessagesNew: number;
  notificationsPending: number;
  notificationsFailed: number;
  subscribersUnverified: number;
}

const EMPTY_BADGES: DashboardBadges = {
  postsDraft: 0,
  problemsNew: 0,
  contactMessagesNew: 0,
  notificationsPending: 0,
  notificationsFailed: 0,
  subscribersUnverified: 0,
};

async function countRows(
  table: "posts" | "problems" | "contact_messages" | "notifications" | "subscribers",
  applyFilters?: (query: ReturnType<typeof supabase.from>) => ReturnType<typeof supabase.from>,
): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from(table).select("*", { count: "exact", head: true });
  if (applyFilters) query = applyFilters(query);

  const { count, error } = await query;
  if (error) {
    console.warn(`[dashboard-badges] ${table}:`, error.message);
    return 0;
  }
  return count ?? 0;
}

async function fetchDashboardBadges(): Promise<DashboardBadges> {
  const [
    postsDraft,
    problemsNew,
    contactMessagesNew,
    notificationsPending,
    notificationsFailed,
    subscribersUnverified,
  ] = await Promise.all([
    countRows("posts", (q) => q.eq("status", "draft")),
    countRows("problems", (q) => q.eq("status", "reported")),
    countRows("contact_messages", (q) => q.eq("status", "new")),
    countRows("notifications", (q) => q.eq("status", "pending")),
    countRows("notifications", (q) => q.eq("status", "failed")),
    countRows("subscribers", (q) => q.is("verified_at", null).eq("is_active", true)),
  ]);

  return {
    postsDraft,
    problemsNew,
    contactMessagesNew,
    notificationsPending,
    notificationsFailed,
    subscribersUnverified,
  };
}

export function useDashboardBadges() {
  return useQuery({
    queryKey: DASHBOARD_BADGES_QUERY_KEY,
    queryFn: fetchDashboardBadges,
    staleTime: 15_000,
    refetchInterval: 45_000,
    refetchOnWindowFocus: true,
    placeholderData: EMPTY_BADGES,
  });
}

export type DashboardNavBadgeKey =
  | "attention-total"
  | "posts-draft"
  | "email-queue"
  | "problems-new"
  | "contact-messages-new"
  | "subscribers-unverified"
  | "notifications-action";

export function getDashboardNavBadgeCount(
  badges: DashboardBadges | undefined,
  key: DashboardNavBadgeKey | undefined,
): number {
  if (!badges || !key) return 0;

  switch (key) {
    case "attention-total":
      return (
        badges.postsDraft +
        badges.problemsNew +
        badges.contactMessagesNew +
        badges.notificationsPending +
        badges.notificationsFailed +
        badges.subscribersUnverified
      );
    case "posts-draft":
      return badges.postsDraft;
    case "email-queue":
      return badges.notificationsPending + badges.notificationsFailed;
    case "problems-new":
      return badges.problemsNew;
    case "contact-messages-new":
      return badges.contactMessagesNew;
    case "subscribers-unverified":
      return badges.subscribersUnverified;
    case "notifications-action":
      return badges.notificationsPending + badges.notificationsFailed;
    default:
      return 0;
  }
}
