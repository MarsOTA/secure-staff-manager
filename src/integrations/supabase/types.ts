export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string
          event_id: number
          id: string
          latitude: number | null
          longitude: number | null
          operator_id: number
          status: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          event_id: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          operator_id: number
          status: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          operator_id?: number
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: number
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_operators: {
        Row: {
          created_at: string | null
          event_id: number | null
          hourly_rate: number | null
          id: number
          meal_allowance: number | null
          net_hours: number | null
          operator_id: number | null
          revenue_generated: number | null
          total_compensation: number | null
          total_hours: number | null
          travel_allowance: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: number | null
          hourly_rate?: number | null
          id?: number
          meal_allowance?: number | null
          net_hours?: number | null
          operator_id?: number | null
          revenue_generated?: number | null
          total_compensation?: number | null
          total_hours?: number | null
          travel_allowance?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: number | null
          hourly_rate?: number | null
          id?: number
          meal_allowance?: number | null
          net_hours?: number | null
          operator_id?: number | null
          revenue_generated?: number | null
          total_compensation?: number | null
          total_hours?: number | null
          travel_allowance?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_operators_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_operators_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          client_id: number | null
          created_at: string | null
          description: string | null
          end_date: string
          id: number
          location: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: number
          location?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: number
          location?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          account_holder: string | null
          account_number: string | null
          address: string | null
          auth_type: string
          availability: string[] | null
          bank_name: string | null
          basic_languages: string[] | null
          bic: string | null
          birth_country: string | null
          birth_date: string | null
          body_type: string | null
          bust_photo_file: string | null
          bust_photo_file_name: string | null
          chest_size: number | null
          city: string | null
          created_at: string | null
          driving_license: boolean | null
          email: string
          eye_color: string | null
          face_photo_file: string | null
          face_photo_file_name: string | null
          facebook: string | null
          fiscal_code: string | null
          fluent_languages: string[] | null
          full_body_photo_file: string | null
          full_body_photo_file_name: string | null
          gender: string | null
          hair_color: string | null
          hair_length: string | null
          has_vehicle: boolean | null
          health_card_back_file_name: string | null
          health_card_back_image: string | null
          health_card_front_file_name: string | null
          health_card_front_image: string | null
          height: number | null
          hips_size: number | null
          iban: string | null
          id: number
          id_card_back_file_name: string | null
          id_card_back_image: string | null
          id_card_front_file_name: string | null
          id_card_front_image: string | null
          id_card_number: string | null
          instagram: string | null
          linkedin: string | null
          name: string
          nationality: string | null
          occupation: string | null
          phone: string | null
          province: string | null
          rating: number | null
          residence_city: string | null
          residence_permit_number: string | null
          resume_file: string | null
          resume_file_name: string | null
          service: string[] | null
          shoe_size: number | null
          sizes: string[] | null
          status: string
          swift_code: string | null
          tiktok: string | null
          updated_at: string | null
          vat_number: string | null
          visible_tattoos: boolean | null
          waist_size: number | null
          weight: number | null
          zip_code: string | null
        }
        Insert: {
          account_holder?: string | null
          account_number?: string | null
          address?: string | null
          auth_type?: string
          availability?: string[] | null
          bank_name?: string | null
          basic_languages?: string[] | null
          bic?: string | null
          birth_country?: string | null
          birth_date?: string | null
          body_type?: string | null
          bust_photo_file?: string | null
          bust_photo_file_name?: string | null
          chest_size?: number | null
          city?: string | null
          created_at?: string | null
          driving_license?: boolean | null
          email: string
          eye_color?: string | null
          face_photo_file?: string | null
          face_photo_file_name?: string | null
          facebook?: string | null
          fiscal_code?: string | null
          fluent_languages?: string[] | null
          full_body_photo_file?: string | null
          full_body_photo_file_name?: string | null
          gender?: string | null
          hair_color?: string | null
          hair_length?: string | null
          has_vehicle?: boolean | null
          health_card_back_file_name?: string | null
          health_card_back_image?: string | null
          health_card_front_file_name?: string | null
          health_card_front_image?: string | null
          height?: number | null
          hips_size?: number | null
          iban?: string | null
          id?: number
          id_card_back_file_name?: string | null
          id_card_back_image?: string | null
          id_card_front_file_name?: string | null
          id_card_front_image?: string | null
          id_card_number?: string | null
          instagram?: string | null
          linkedin?: string | null
          name: string
          nationality?: string | null
          occupation?: string | null
          phone?: string | null
          province?: string | null
          rating?: number | null
          residence_city?: string | null
          residence_permit_number?: string | null
          resume_file?: string | null
          resume_file_name?: string | null
          service?: string[] | null
          shoe_size?: number | null
          sizes?: string[] | null
          status?: string
          swift_code?: string | null
          tiktok?: string | null
          updated_at?: string | null
          vat_number?: string | null
          visible_tattoos?: boolean | null
          waist_size?: number | null
          weight?: number | null
          zip_code?: string | null
        }
        Update: {
          account_holder?: string | null
          account_number?: string | null
          address?: string | null
          auth_type?: string
          availability?: string[] | null
          bank_name?: string | null
          basic_languages?: string[] | null
          bic?: string | null
          birth_country?: string | null
          birth_date?: string | null
          body_type?: string | null
          bust_photo_file?: string | null
          bust_photo_file_name?: string | null
          chest_size?: number | null
          city?: string | null
          created_at?: string | null
          driving_license?: boolean | null
          email?: string
          eye_color?: string | null
          face_photo_file?: string | null
          face_photo_file_name?: string | null
          facebook?: string | null
          fiscal_code?: string | null
          fluent_languages?: string[] | null
          full_body_photo_file?: string | null
          full_body_photo_file_name?: string | null
          gender?: string | null
          hair_color?: string | null
          hair_length?: string | null
          has_vehicle?: boolean | null
          health_card_back_file_name?: string | null
          health_card_back_image?: string | null
          health_card_front_file_name?: string | null
          health_card_front_image?: string | null
          height?: number | null
          hips_size?: number | null
          iban?: string | null
          id?: number
          id_card_back_file_name?: string | null
          id_card_back_image?: string | null
          id_card_front_file_name?: string | null
          id_card_front_image?: string | null
          id_card_number?: string | null
          instagram?: string | null
          linkedin?: string | null
          name?: string
          nationality?: string | null
          occupation?: string | null
          phone?: string | null
          province?: string | null
          rating?: number | null
          residence_city?: string | null
          residence_permit_number?: string | null
          resume_file?: string | null
          resume_file_name?: string | null
          service?: string[] | null
          shoe_size?: number | null
          sizes?: string[] | null
          status?: string
          swift_code?: string | null
          tiktok?: string | null
          updated_at?: string | null
          vat_number?: string | null
          visible_tattoos?: boolean | null
          waist_size?: number | null
          weight?: number | null
          zip_code?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
