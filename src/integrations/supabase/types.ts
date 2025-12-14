export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          status: string
          category: string
          created_at: string
          updated_at: string
          published_at: string | null
          author_id: string | null
          featured_image: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          status?: string
          category?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          author_id?: string | null
          featured_image?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          status?: string
          category?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          author_id?: string | null
          featured_image?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      problems: {
        Row: {
          id: string
          title: string
          description: string
          location: string | null
          latitude: number | null
          longitude: number | null
          status: string
          priority: string
          category: string
          reported_by: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
          estimated_resolution: string | null
          images: string[] | null
          contact_phone: string | null
          contact_email: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: string
          priority?: string
          category?: string
          reported_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          estimated_resolution?: string | null
          images?: string[] | null
          contact_phone?: string | null
          contact_email?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: string
          priority?: string
          category?: string
          reported_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          estimated_resolution?: string | null
          images?: string[] | null
          contact_phone?: string | null
          contact_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          preferences: Json
          subscribed_at: string
          unsubscribed_at: string | null
          is_active: boolean
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          preferences?: Json
          subscribed_at?: string
          unsubscribed_at?: string | null
          is_active?: boolean
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          preferences?: Json
          subscribed_at?: string
          unsubscribed_at?: string | null
          is_active?: boolean
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          type: string
          subject: string
          content: string
          recipient_email: string
          recipient_name: string | null
          sent_at: string | null
          status: string
          error_message: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          subject: string
          content: string
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          error_message?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          subject?: string
          content?: string
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          error_message?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      problem_updates: {
        Row: {
          id: string
          problem_id: string
          author_id: string
          content: string
          status_change: string | null
          internal_only: boolean
          created_at: string
        }
        Insert: {
          id?: string
          problem_id: string
          author_id: string
          content: string
          status_change?: string | null
          internal_only?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          problem_id?: string
          author_id?: string
          content?: string
          status_change?: string | null
          internal_only?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_updates_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
