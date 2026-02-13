import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Tender = Tables<'tenders'>;
type TenderInsert = TablesInsert<'tenders'>;
type TenderUpdate = TablesUpdate<'tenders'>;

export const useTenders = () => {
  return useQuery({
    queryKey: ['tenders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Tender[];
    },
  });
};

export const useCurrentTenders = () => {
  return useQuery({
    queryKey: ['tenders', 'current'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('status', 'current')
        .order('deadline', { ascending: true });

      if (error) throw error;
      return data as Tender[];
    },
  });
};

export const usePastTenders = () => {
  return useQuery({
    queryKey: ['tenders', 'past'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('status', 'past')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Tender[];
    },
  });
};

export const useCreateTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tender: TenderInsert) => {
      const { data, error } = await supabase
        .from('tenders')
        .insert(tender)
        .select()
        .single();

      if (error) throw error;
      return data as Tender;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};

export const useUpdateTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TenderUpdate }) => {
      const { data, error } = await supabase
        .from('tenders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Tender;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};

export const useDeleteTender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tenders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
    },
  });
};
