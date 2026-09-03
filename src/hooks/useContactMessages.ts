import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { DASHBOARD_BADGES_QUERY_KEY } from "@/hooks/useDashboardBadges";

type ContactMessage = Tables<"contact_messages">;
type ContactMessageInsert = TablesInsert<"contact_messages">;
type ContactMessageUpdate = TablesUpdate<"contact_messages">;

function formatContactMessageError(error: { message?: string; code?: string }): string {
  const message = error.message ?? "";
  const code = error.code ?? "";

  if (
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("Load failed")
  ) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    return `Δεν ήταν δυνατή η σύνδεση με τη βάση δεδομένων${url ? ` (${url})` : ""}. Ελέγξτε ότι το Supabase project υπάρχει, ότι το VITE_SUPABASE_URL και το VITE_SUPABASE_PUBLISHABLE_KEY στο .env είναι σωστά, και ότι έχετε κάνει restart τον dev server.`;
  }

  if (code === "42501" || message.toLowerCase().includes("row-level security")) {
    return "Δεν επιτρέπεται η αποστολή από τη φόρμα επικοινωνίας (RLS). Τρέξτε στο Supabase SQL Editor το αρχείο supabase/migrations/20260605120001_fix_contact_messages_anon_insert.sql.";
  }

  if (
    code === "PGRST205" ||
    code === "42P01" ||
    message.toLowerCase().includes("could not find the table") ||
    (message.toLowerCase().includes("relation") && message.toLowerCase().includes("does not exist"))
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
      try {
        const { error } = await supabase.from("contact_messages").insert(message);

        if (error) throw new Error(formatContactMessageError(error));
        return message as ContactMessage;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(formatContactMessageError(error));
        }
        throw error;
      }
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
