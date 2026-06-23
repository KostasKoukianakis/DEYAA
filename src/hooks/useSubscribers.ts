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

export const useCreateSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriber: SubscriberInsert & { verificationToken?: string }) => {
      // Generate verification token if not provided
      const verificationToken = subscriber.verificationToken || crypto.randomUUID();
      
      // Remove verificationToken from subscriber object and use snake_case
      const { verificationToken: _, ...subscriberWithoutToken } = subscriber;
      
      const subscriberData: SubscriberInsert = {
        ...subscriberWithoutToken,
        is_active: false, // Start as inactive until verified
        verification_token: verificationToken,
      };

      const { data, error } = await supabase
        .from('subscribers')
        .insert(subscriberData)
        .select()
        .single();

      if (error) throw error;
      return { ...data as Subscriber, verificationToken };
    },
    onSuccess: (data) => {
      // Only invalidate if we have data (insert succeeded)
      // This prevents unnecessary refetch if the mutation fails
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
      }
    },
  });
};

export const useVerifySubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      console.log('🔐 Verifying subscriber with token:', token.substring(0, 8) + '...');
      
      // Verify Supabase client is initialized
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase environment variables missing!');
        throw new Error('Supabase configuration error. Please check your environment variables.');
      }

      // First, check if a subscriber with this token exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('subscribers')
        .select('id, email, is_active, verification_token')
        .eq('verification_token', token)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking subscriber:', checkError);
        throw new Error('Failed to verify token. Please try again.');
      }

      if (!existingSubscriber) {
        console.error('❌ No subscriber found with this token');
        throw new Error('Το token επιβεβαίωσης δεν είναι έγκυρο ή έχει ήδη χρησιμοποιηθεί. Παρακαλώ εγγραφείτε ξανά.');
      }

      if (existingSubscriber.is_active) {
        console.log('⚠️ Subscriber already verified');
        throw new Error('Η εγγραφή σας έχει ήδη επιβεβαιωθεί.');
      }

      // Now perform the update (without .single() since we know the row exists)
      const { data, error } = await supabase
        .from('subscribers')
        .update({ 
          is_active: true,
          verified_at: new Date().toISOString(),
          verification_token: null // Clear token after verification
        })
        .eq('verification_token', token)
        .eq('id', existingSubscriber.id) // Extra safety: match by ID too
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase verification error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        // Provide more helpful error messages
        if (error.message?.includes('API key') || error.message?.includes('apikey')) {
          throw new Error('Supabase API key configuration error. Please restart the development server.');
        }
        if (error.code === 'PGRST116') {
          throw new Error('Το token επιβεβαίωσης δεν είναι έγκυρο ή έχει ήδη χρησιμοποιηθεί. Παρακαλώ εγγραφείτε ξανά.');
        }
        if (error.code === 'PGRST301' || error.message?.includes('406')) {
          throw new Error('RLS policy error: Anonymous users cannot verify subscriptions. Please run the migration in Supabase SQL Editor.');
        }
        throw error;
      }
      
      if (!data) {
        console.error('❌ No data returned from verification');
        throw new Error('Το token επιβεβαίωσης δεν είναι έγκυρο. Παρακαλώ εγγραφείτε ξανά.');
      }
      
      console.log('✅ Subscriber verified successfully:', data.email);
      return data as Subscriber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
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
