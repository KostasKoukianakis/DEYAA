import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isAnalyticsAllowed } from '@/lib/cookieConsent';

type EventType = 'view' | 'download' | 'click';
type EntityType = 'post' | 'tender' | 'document' | 'page';

interface AnalyticsEvent {
  event_type: EventType;
  entity_type: EntityType;
  entity_id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
}

export function useTrackEvent() {
  return useMutation({
    mutationFn: async (event: AnalyticsEvent) => {
      if (!isAnalyticsAllowed()) return;

      // Get user if authenticated
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('analytics').insert({
        event_type: event.event_type,
        entity_type: event.entity_type,
        entity_id: event.entity_id,
        user_id: user?.id || null,
        ip_address: event.ip_address,
        user_agent: event.user_agent || navigator.userAgent,
        referrer: event.referrer || document.referrer,
      });

      if (error) throw error;

      // Increment view count if it's a view event
      if (event.event_type === 'view' && (event.entity_type === 'post' || event.entity_type === 'tender')) {
        const { error: viewError } = await supabase.rpc('increment_view_count', {
          p_entity_type: event.entity_type,
          p_entity_id: event.entity_id,
        });
        if (viewError) console.error('Failed to increment view count:', viewError);
      }
    },
  });
}

export function trackView(entityType: EntityType, entityId: string) {
  if (!isAnalyticsAllowed()) return;
  // Track view asynchronously without blocking
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: 'view',
      entity_type: entityType,
      entity_id: entityId,
    }),
  }).catch(() => {
    // Silently fail if analytics tracking fails
  });
}

export function trackDownload(entityType: EntityType, entityId: string) {
  if (!isAnalyticsAllowed()) return;
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: 'download',
      entity_type: entityType,
      entity_id: entityId,
    }),
  }).catch(() => {
    // Silently fail
  });
}
