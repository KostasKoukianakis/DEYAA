import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

import { DASHBOARD_BADGES_QUERY_KEY } from '@/hooks/useDashboardBadges';
import { deleteStoredPublicFile, STORAGE_BUCKETS } from '@/lib/storage';

type Post = Tables<'posts'>;
type PostInsert = TablesInsert<'posts'>;
type PostUpdate = TablesUpdate<'posts'>;

const POSTS_QUERY_KEY = ['posts'] as const;

function invalidatePostQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
}

export const usePosts = () => {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });
};

export const usePublishedPosts = () => {
  return useQuery({
    queryKey: ['posts', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });
};

export const usePublishedPost = (id: string | undefined) => {
  return useQuery({
    queryKey: ['posts', 'published', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      return data as Post | null;
    },
    enabled: Boolean(id),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: PostInsert) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onSuccess: () => {
      invalidatePostQueries(queryClient);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PostUpdate }) => {
      if (updates.featured_image !== undefined) {
        const { data: existing } = await supabase
          .from('posts')
          .select('featured_image')
          .eq('id', id)
          .maybeSingle();

        if (
          existing?.featured_image &&
          existing.featured_image !== updates.featured_image
        ) {
          void deleteStoredPublicFile(
            STORAGE_BUCKETS.ANNOUNCEMENTS,
            existing.featured_image,
          );
        }
      }

      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onSuccess: (_data, variables) => {
      invalidatePostQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ['posts', 'published', variables.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: existing } = await supabase
        .from('posts')
        .select('featured_image')
        .eq('id', id)
        .maybeSingle();

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (existing?.featured_image) {
        void deleteStoredPublicFile(
          STORAGE_BUCKETS.ANNOUNCEMENTS,
          existing.featured_image,
        );
      }
    },
    onSuccess: () => {
      invalidatePostQueries(queryClient);
    },
  });
};
