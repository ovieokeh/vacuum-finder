import { BsCurrencyDollar, BsCurrencyEuro } from "react-icons/bs";
import { FaGlobe, FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope } from "react-icons/fa";

export interface AffiliateLinkBase {
  vacuumId?: string;
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
  imageUrl: string;
  brand: string;
  model: string;
  mappingTechnology: string;
  batteryLifeInMinutes: number;
  suctionPowerInPascals: number;
  noiseLevelInDecibels: number;
  waterTankCapacityInLiters: number | string;
  dustbinCapacityInLiters: number | string;
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

export type WithId<T> = T & { id: string };

export type Vacuum = WithId<VacuumBase> & {
  affiliateLinks?: WithId<AffiliateLinkBase>[];
};

export enum FloorType {
  Carpet = "Carpet",
  Hardwood = "Hardwood",
  Tile = "Tile",
  Laminate = "Laminate",
}
export interface VacuumsFilter {
  budget: number;
  numPets: number;
  mopFunction: boolean;
  region: Region;
  currency: Currency;

  // additional filters
  brand: string;
  mappingTechnology: VacuumMappingTechnology;
  minBatteryLifeInMinutes: number;
  minSuctionPowerInPascals: number;
  maxNoiseLevelInDecibels: number;
  minWaterTankCapacityInLiters: number;
  minDustbinCapacityInLiters: number;
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
}

export enum Region {
  Global = "Global",
  America = "America",
  Europe = "Europe",
  Asia = "Asia",
  Africa = "Africa",
  Australia = "Australia",
}
export const RegionIconMapping = {
  [Region.Global]: FaGlobe,
  [Region.America]: FaGlobeAmericas,
  [Region.Europe]: FaGlobeEurope,
  [Region.Asia]: FaGlobeAsia,
  [Region.Africa]: FaGlobeAfrica,
  [Region.Australia]: FaGlobe,
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
