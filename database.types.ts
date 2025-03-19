import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./database-generated.types";
export { Json } from "./database-generated.types";

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        Vacuums: {
          Insert: {
            batteryLifeInMinutes: number | null;
            brand: string;
            dustbinCapacityInLiters: number | null;
            waterTankCapacityInLiters: number | null;
            maxObjectClearanceInMillimeters: number | null;
            hasAppControlFeature: boolean | null;
            hasManualControlFeature: boolean | null;
            hasAutoLiftMopFeature: boolean | null;
            hasMoppingFeature: boolean | null;
            hasMultiFloorMappingFeature: boolean | null;
            hasSelfEmptyingFeature: boolean | null;
            hasSelfCleaningFeature: boolean | null;
            hasVirtualWallsFeature: boolean | null;
            hasZoneCleaningFeature: boolean | null;
            hasChildLockFeature: boolean | null;
            hasVoiceControlFeature: boolean | null;
            hasGoogleOrAlexaIntegrationFeature: boolean | null;
            imageUrl: string;
            mappingTechnology: Database["public"]["Enums"]["MappingTechnology"];
            model: string;
            noiseLevelInDecibels: number | null;
            surfaceRecommendations?: string[] | null;
            otherFeatures?: string[] | null;
            suctionPowerInPascals: number | null;
            userEmail?: string;
            createdAt?: string;
            updatedAt?: string;
          };
        };
        AffiliateLinks: {
          Insert: {
            currency: Database["public"]["Enums"]["Currency"];
            link: string;
            price: number;
            vacuumId?: string;
            userEmail?: string;
            createdAt?: string;
            updatedAt?: string;
          };
        };
      };
    };
  }
>;

type PublicSchema = Database[Extract<keyof Database, "public">];

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export { Tables } from "./database-generated.types";
