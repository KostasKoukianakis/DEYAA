import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

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

export const useCreateSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriber: SubscriberInsert) => {
      const { data, error } = await supabase
        .from('subscribers')
        .insert(subscriber)
        .select()
        .single();

      if (error) throw error;
      return data as Subscriber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
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
    },
  });
};
