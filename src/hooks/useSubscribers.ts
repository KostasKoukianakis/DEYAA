import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

import { DASHBOARD_BADGES_QUERY_KEY } from '@/hooks/useDashboardBadges';

type Subscriber = Tables<'subscribers'>;
type SubscriberInsert = TablesInsert<'subscribers'>;
type SubscriberUpdate = TablesUpdate<'subscribers'>;

export const useSubscribers = () => {
  return useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      return data as Subscriber[];
    },
  });
};

export const useActiveSubscribers = () => {
  return useQuery({
    queryKey: ['subscribers', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      return data as Subscriber[];
    },
  });
};

type NewsletterRpcStatus = {
  status?: string;
  token?: string;
};

export const useCreateSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriber: SubscriberInsert & { verificationToken?: string }) => {
      const { data, error } = await supabase.rpc("subscribe_newsletter", {
        p_email: subscriber.email.trim().toLowerCase(),
      });

      if (error) throw error;

      const result = (data ?? {}) as NewsletterRpcStatus;
      if (result.status === "already_verified") {
        throw new Error("ALREADY_VERIFIED");
      }
      if (result.status === "invalid_email" || !result.token) {
        throw new Error("INVALID_EMAIL");
      }

      return {
        email: subscriber.email,
        verificationToken: result.token,
      };
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["subscribers"] });
        queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
      }
    },
  });
};

export const useVerifySubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase.rpc("verify_newsletter", {
        p_token: token.trim(),
      });

      if (error) throw error;

      const result = (data ?? {}) as NewsletterRpcStatus;
      if (result.status === "already_verified" || result.status === "verified") {
        return { status: result.status };
      }
      if (result.status === "invalid") {
        throw new Error("INVALID_TOKEN");
      }
      throw new Error("VERIFY_FAILED");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};

export const useUpdateSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SubscriberUpdate }) => {
      const { data, error } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Subscriber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};
