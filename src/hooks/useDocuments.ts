import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deyaaOfficialDocuments } from '@/data/deyaaOfficialDocuments';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Document = Tables<'documents'>;
type DocumentInsert = TablesInsert<'documents'>;
type DocumentUpdate = TablesUpdate<'documents'>;

export function officialDocumentsAsRows(): Document[] {
  return deyaaOfficialDocuments.map((doc) => ({
    id: `official-${doc.fileName}`,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    icon_name: doc.iconName,
    file_path: doc.publicPath,
    file_name: doc.fileName,
    file_size: null,
    file_type: 'application/pdf',
    download_count: 0,
    is_active: true,
    created_at: `${doc.publishedAt}T12:00:00.000Z`,
    updated_at: `${doc.publishedAt}T12:00:00.000Z`,
    author_id: null,
    display_order: doc.displayOrder,
  }));
}

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
  });
};

export const useActiveDocuments = () => {
  return useQuery({
    queryKey: ['documents', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data?.length ? data : officialDocumentsAsRows()) as Document[];
    },
  });
};

export const useDocumentsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['documents', 'category', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Document[];
    },
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: DocumentInsert) => {
      const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DocumentUpdate }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useIncrementDownloadCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get current count
      const { data: doc } = await supabase
        .from('documents')
        .select('download_count')
        .eq('id', id)
        .single();

      if (!doc) throw new Error('Document not found');

      const { error } = await supabase
        .from('documents')
        .update({ download_count: (doc.download_count || 0) + 1 })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};
