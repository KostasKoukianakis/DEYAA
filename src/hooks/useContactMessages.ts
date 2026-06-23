import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { DASHBOARD_BADGES_QUERY_KEY } from "@/hooks/useDashboardBadges";

type ContactMessage = Tables<"contact_messages">;
type ContactMessageInsert = TablesInsert<"contact_messages">;
type ContactMessageUpdate = TablesUpdate<"contact_messages">;

function formatContactMessageError(error: { message?: string; code?: string }): string {
  const message = error.message ?? "";

  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    message.includes("contact_messages") ||
    message.toLowerCase().includes("not found")
  ) {
    return "Ο πίνακας contact_messages δεν υπάρχει στο Supabase. Τρέξτε το migration supabase/migrations/20260605120000_contact_messages.sql από το SQL Editor.";
  }

  return message || "Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά ή καλέστε μας.";
}

export const useContactMessages = () => {
  return useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(formatContactMessageError(error));
      return data as ContactMessage[];
    },
  });
};

export const useCreateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: ContactMessageInsert) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert(message)
        .select()
        .single();

      if (error) throw new Error(formatContactMessageError(error));
      return data as ContactMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};

export const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ContactMessageUpdate }) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .update(updates)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) throw new Error(formatContactMessageError(error));
      if (!data) throw new Error("Contact message not found after update");
      return data as ContactMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw new Error(formatContactMessageError(error));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_BADGES_QUERY_KEY });
    },
  });
};
