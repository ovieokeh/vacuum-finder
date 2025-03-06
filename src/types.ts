import { BsCurrencyDollar, BsCurrencyEuro } from "react-icons/bs";
import { FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope } from "react-icons/fa";

export interface AffiliateLink {
  id: string;
  vacuumId: string;
  region: Region;
  currency: Currency;
  price: number;
  site: string;
  url: string;
}

export enum VacuumMappingTechnology {
  Laser = "Laser",
  Camera = "Camera",
}
export interface VacuumBase {
  id: string;
  imageUrl: string;
  brand: string;
  model: string;
  mappingTechnology: string;
  batteryLifeInMinutes: number;
  suctionPowerInPascals: number;
  noiseLevelInDecibels: number;
  dustbinCapacityInLiters: number;
  hasMoppingFeature: boolean;
  hasSelfEmptyingFeature: boolean;
  hasZoneCleaningFeature: boolean;
  hasMultiFloorMappingFeature: boolean;
  hasCarpetBoostFeature: boolean;
  hasVirtualWallsFeature: boolean;
  hasSmartHomeIntegration: boolean;
  hasVoiceControl: boolean;
  hasAppControl: boolean;
  hasRemoteControl: boolean;
  hasManualControl: boolean;
  otherFeatures: string[];
  // [key: string]: string | number | boolean | string[] | AffiliateLink[];
}

export interface Vacuum extends VacuumBase {
  affiliateLinks: AffiliateLink[];
}

export enum FloorType {
  Carpet = "Carpet",
  Hardwood = "Hardwood",
  Tile = "Tile",
  Laminate = "Laminate",
}
export interface VacuumsFilter {
  houseSizeSqM: number;
  floorType: FloorType;
  budget: number;
  numRooms: number;
  numPets: number;
  mopFunction: boolean;
  region: Region;
  currency: Currency;
}

export enum Region {
  America = "America",
  Europe = "Europe",
  Asia = "Asia",
  Africa = "Africa",
}
export const RegionIconMapping = {
  [Region.America]: FaGlobeAmericas,
  [Region.Europe]: FaGlobeEurope,
  [Region.Asia]: FaGlobeAsia,
  [Region.Africa]: FaGlobeAfrica,
};

export enum Currency {
  USD = "USD",
  EUR = "EUR",
}
export const CurrencyIconMapping = {
  [Currency.USD]: BsCurrencyDollar,
  [Currency.EUR]: BsCurrencyEuro,
};
export const CurrencySymbolMapping = {
  [Currency.USD]: "$",
  [Currency.EUR]: "€",
};
