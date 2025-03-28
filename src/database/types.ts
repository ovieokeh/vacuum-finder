import { Merge } from "type-fest";
import { Database, Tables, TablesInsert } from "../../database.types";

export type Vacuum = Tables<"Vacuums">;
export type VacuumCreate = TablesInsert<"Vacuums">;

export type AffiliateLink = Tables<"AffiliateLinks">;
export type AffiliateLinkCreate = TablesInsert<"AffiliateLinks">;

export type VacuumWithAffiliateLink = Merge<Vacuum, { affiliateLinks: AffiliateLink[] }>;

export type MappingTechnology = Database["public"]["Enums"]["MappingTechnology"];
export type Currency = Database["public"]["Enums"]["Currency"];
export type Region = Database["public"]["Enums"]["Region"];
