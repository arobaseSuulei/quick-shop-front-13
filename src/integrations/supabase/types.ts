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
      administrateur: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "administrateur_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "utilisateur"
            referencedColumns: ["id"]
          },
        ]
      }
      avis: {
        Row: {
          client_id: string | null
          commentaire: string | null
          id: number
          note: number | null
          produit_id: number | null
        }
        Insert: {
          client_id?: string | null
          commentaire?: string | null
          id?: number
          note?: number | null
          produit_id?: number | null
        }
        Update: {
          client_id?: string | null
          commentaire?: string | null
          id?: number
          note?: number | null
          produit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "avis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avis_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produit"
            referencedColumns: ["id"]
          },
        ]
      }
      client: {
        Row: {
          adresse: string | null
          id: string
        }
        Insert: {
          adresse?: string | null
          id: string
        }
        Update: {
          adresse?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "utilisateur"
            referencedColumns: ["id"]
          },
        ]
      }
      employe: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employe_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "utilisateur"
            referencedColumns: ["id"]
          },
        ]
      }
      fournisseur: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fournisseur_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "utilisateur"
            referencedColumns: ["id"]
          },
        ]
      }
      messagerie: {
        Row: {
          date_envoi: string | null
          destinataire_id: string | null
          expediteur_id: string | null
          id: number
          message: string
        }
        Insert: {
          date_envoi?: string | null
          destinataire_id?: string | null
          expediteur_id?: string | null
          id?: number
          message: string
        }
        Update: {
          date_envoi?: string | null
          destinataire_id?: string | null
          expediteur_id?: string | null
          id?: number
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "messagerie_destinataire_id_fkey"
            columns: ["destinataire_id"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messagerie_expediteur_id_fkey"
            columns: ["expediteur_id"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id"]
          },
        ]
      }
      panier: {
        Row: {
          client_id: string | null
          id: number
        }
        Insert: {
          client_id?: string | null
          id?: number
        }
        Update: {
          client_id?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "panier_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      panier_produit: {
        Row: {
          panier_id: number
          produit_id: number
          quantite: number | null
        }
        Insert: {
          panier_id: number
          produit_id: number
          quantite?: number | null
        }
        Update: {
          panier_id?: number
          produit_id?: number
          quantite?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "panier_produit_panier_id_fkey"
            columns: ["panier_id"]
            isOneToOne: false
            referencedRelation: "panier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "panier_produit_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produit"
            referencedColumns: ["id"]
          },
        ]
      }
      produit: {
        Row: {
          date_dernier_achat: string | null
          id: number
          imageUrl: string | null
          nom: string
          prediction_rupture: number | null
          prix: number
          quantite: number | null
        }
        Insert: {
          date_dernier_achat?: string | null
          id?: number
          imageUrl?: string | null
          nom: string
          prediction_rupture?: number | null
          prix: number
          quantite?: number | null
        }
        Update: {
          date_dernier_achat?: string | null
          id?: number
          imageUrl?: string | null
          nom?: string
          prediction_rupture?: number | null
          prix?: number
          quantite?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nom: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nom?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nom?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      utilisateur: {
        Row: {
          email: string
          id: string
          mot_de_passe: string
          nom: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          mot_de_passe: string
          nom: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          mot_de_passe?: string
          nom?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "client" | "employe" | "admin" | "fournisseur"
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
    Enums: {
      app_role: ["client", "employe", "admin", "fournisseur"],
    },
  },
} as const
