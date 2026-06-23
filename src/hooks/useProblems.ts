import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { DASHBOARD_BADGES_QUERY_KEY } from '@/hooks/useDashboardBadges';

type Problem = Tables<'problems'>;
type ProblemInsert = TablesInsert<'problems'>;
type ProblemUpdate = TablesUpdate<'problems'>;

export const useProblems = () => {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Problem[];
    },
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (problem: ProblemInsert) => {
      const { data, error } = await supabase
        .from('problems')
        .insert(problem)
        .select()
        .single();

      if (error) throw error;
      return data as Problem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};

export const useUpdateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProblemUpdate }) => {
      const { data, error } = await supabase
        .from('problems')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Problem not found after update');
      return data as Problem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};

export const useDeleteProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};
