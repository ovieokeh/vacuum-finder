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
      AffiliateLinks: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["Currency"]
          id: string
          link: string
          price: number
          region: Database["public"]["Enums"]["Region"]
          updated_at: string
          userEmail: string
          vacuumId: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["Currency"]
          id?: string
          link?: string
          price: number
          region: Database["public"]["Enums"]["Region"]
          updated_at?: string
          userEmail: string
          vacuumId: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["Currency"]
          id?: string
          link?: string
          price?: number
          region?: Database["public"]["Enums"]["Region"]
          updated_at?: string
          userEmail?: string
          vacuumId?: string
        }
        Relationships: [
          {
            foreignKeyName: "AffiliateLinks_vacuumId_fkey"
            columns: ["vacuumId"]
            isOneToOne: false
            referencedRelation: "vacuumaffiliatesummary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AffiliateLinks_vacuumId_fkey"
            columns: ["vacuumId"]
            isOneToOne: false
            referencedRelation: "Vacuums"
            referencedColumns: ["id"]
          },
        ]
      }
      Vacuums: {
        Row: {
          batteryLifeInMinutes: number | null
          brand: string
          createdAt: string
          dustbinCapacityInLiters: number | null
          hasAppControlFeature: boolean | null
          hasChildLockFeature: boolean | null
          hasManualControlFeature: boolean | null
          hasMoppingFeature: boolean | null
          hasMultiFloorMappingFeature: boolean | null
          hasSelfEmptyingFeature: boolean | null
          hasSmartHomeIntegrationFeature: boolean | null
          hasVirtualWallsFeature: boolean | null
          hasVoiceControlFeature: boolean | null
          hasZoneCleaningFeature: boolean | null
          id: string
          imageUrl: string
          mappingTechnology: Database["public"]["Enums"]["MappingTechnology"]
          model: string
          noiseLevelInDecibels: number | null
          otherFeatures: string[]
          suctionPowerInPascals: number | null
          updatedAt: string
          userEmail: string
          waterTankCapacityInLiters: number | null
        }
        Insert: {
          batteryLifeInMinutes?: number | null
          brand?: string
          createdAt?: string
          dustbinCapacityInLiters?: number | null
          hasAppControlFeature?: boolean | null
          hasChildLockFeature?: boolean | null
          hasManualControlFeature?: boolean | null
          hasMoppingFeature?: boolean | null
          hasMultiFloorMappingFeature?: boolean | null
          hasSelfEmptyingFeature?: boolean | null
          hasSmartHomeIntegrationFeature?: boolean | null
          hasVirtualWallsFeature?: boolean | null
          hasVoiceControlFeature?: boolean | null
          hasZoneCleaningFeature?: boolean | null
          id?: string
          imageUrl?: string
          mappingTechnology?: Database["public"]["Enums"]["MappingTechnology"]
          model?: string
          noiseLevelInDecibels?: number | null
          otherFeatures: string[]
          suctionPowerInPascals?: number | null
          updatedAt?: string
          userEmail: string
          waterTankCapacityInLiters?: number | null
        }
        Update: {
          batteryLifeInMinutes?: number | null
          brand?: string
          createdAt?: string
          dustbinCapacityInLiters?: number | null
          hasAppControlFeature?: boolean | null
          hasChildLockFeature?: boolean | null
          hasManualControlFeature?: boolean | null
          hasMoppingFeature?: boolean | null
          hasMultiFloorMappingFeature?: boolean | null
          hasSelfEmptyingFeature?: boolean | null
          hasSmartHomeIntegrationFeature?: boolean | null
          hasVirtualWallsFeature?: boolean | null
          hasVoiceControlFeature?: boolean | null
          hasZoneCleaningFeature?: boolean | null
          id?: string
          imageUrl?: string
          mappingTechnology?: Database["public"]["Enums"]["MappingTechnology"]
          model?: string
          noiseLevelInDecibels?: number | null
          otherFeatures?: string[]
          suctionPowerInPascals?: number | null
          updatedAt?: string
          userEmail?: string
          waterTankCapacityInLiters?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      vacuumaffiliatesummary: {
        Row: {
          batteryLifeInMinutes: number | null
          brand: string | null
          createdAt: string | null
          currency: Database["public"]["Enums"]["Currency"] | null
          dustbinCapacityInLiters: number | null
          hasAppControlFeature: boolean | null
          hasChildLockFeature: boolean | null
          hasManualControlFeature: boolean | null
          hasMoppingFeature: boolean | null
          hasMultiFloorMappingFeature: boolean | null
          hasSelfEmptyingFeature: boolean | null
          hasSmartHomeIntegrationFeature: boolean | null
          hasVirtualWallsFeature: boolean | null
          hasVoiceControlFeature: boolean | null
          hasZoneCleaningFeature: boolean | null
          id: string | null
          imageUrl: string | null
          mappingTechnology:
            | Database["public"]["Enums"]["MappingTechnology"]
            | null
          min_price: number | null
          model: string | null
          noiseLevelInDecibels: number | null
          otherFeatures: string[] | null
          suctionPowerInPascals: number | null
          updatedAt: string | null
          userEmail: string | null
          waterTankCapacityInLiters: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Currency: "usd" | "eur"
      MappingTechnology: "laser" | "camera"
      Region: "americas" | "europe" | "asia" | "africa" | "australia"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
