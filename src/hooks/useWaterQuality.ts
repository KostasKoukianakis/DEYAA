import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { deleteFile, STORAGE_BUCKETS } from "@/lib/storage";
import {
  waterQualityFallbackRecords,
  type WaterQualityCategory,
  type WaterQualityRecordView,
} from "@/data/deyaaWaterQuality";

type WaterQualityRow = Tables<"water_quality_records">;
type WaterQualityInsert = TablesInsert<"water_quality_records">;
type WaterQualityUpdate = TablesUpdate<"water_quality_records">;

const QUERY_KEY = ["water-quality"] as const;

export function mapWaterQualityRow(row: WaterQualityRow): WaterQualityRecordView {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    category: row.category as WaterQualityCategory,
    location: row.location,
    samplingDate: row.sampling_date,
    publishedAt: row.published_at,
    filePath: row.file_path,
    fileName: row.file_name,
    isPublished: row.is_published,
  };
}

export const useWaterQualityRecords = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_quality_records")
        .select("*")
        .order("display_order", { ascending: true })
        .order("published_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as WaterQualityRow[];
    },
    retry: 1,
  });
};

export const usePublishedWaterQualityRecords = () => {
  return useQuery({
    queryKey: [...QUERY_KEY, "published"],
    queryFn: async (): Promise<WaterQualityRecordView[]> => {
      const { data, error } = await supabase
        .from("water_quality_records")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("published_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      const rows = (data ?? []) as WaterQualityRow[];
      return rows.length > 0 ? rows.map(mapWaterQualityRow) : waterQualityFallbackRecords;
    },
    retry: 1,
  });
};

export const useCreateWaterQualityRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: WaterQualityInsert) => {
      const { data, error } = await supabase
        .from("water_quality_records")
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data as WaterQualityRow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateWaterQualityRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: WaterQualityUpdate }) => {
      const { data, error } = await supabase
        .from("water_quality_records")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as WaterQualityRow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteWaterQualityRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: existing } = await supabase
        .from("water_quality_records")
        .select("file_path")
        .eq("id", id)
        .maybeSingle();

      const { error } = await supabase.from("water_quality_records").delete().eq("id", id);
      if (error) throw error;

      if (existing?.file_path) {
        void deleteFile(STORAGE_BUCKETS.WATER_QUALITY, existing.file_path);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
