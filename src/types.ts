import { BsCurrencyDollar, BsCurrencyEuro } from "react-icons/bs";
import { FaGlobe, FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope } from "react-icons/fa";
import { Currency, MappingTechnology, Region } from "./database";

export type WithId<T> = T & { id: string };

export interface VacuumsFilters {
  budget?: number;
  numPets?: number;
  mopFunction?: boolean;
  region?: Region;
  currency?: Currency;

  // additional filters
  brand?: string;
  model?: string;
  mappingTechnology?: MappingTechnology;
  minBatteryLifeInMinutes?: number;
  minSuctionPowerInPascals?: number;
  maxNoiseLevelInDecibels?: number;
  minWaterTankCapacityInLiters?: number;
  minDustbinCapacityInLiters?: number;
  hasMoppingFeature?: boolean;
  hasSelfEmptyingFeature?: boolean;
  hasZoneCleaningFeature?: boolean;
  hasMultiFloorMappingFeature?: boolean;
  hasCarpetBoostFeature?: boolean;
  hasVirtualWallsFeature?: boolean;
  hasSmartHomeIntegration?: boolean;
  hasVoiceControl?: boolean;
  hasAppControl?: boolean;
  hasRemoteControl?: boolean;
  hasManualControl?: boolean;
}

export const SUPPORTED_REGIONS: Region[] = ["americas", "europe", "asia", "africa", "australia"];
export const SUPPORTED_CURRENCIES: Currency[] = ["usd", "eur"];

export const RegionIconMapping: {
  [type in Region]: React.ComponentType<{ className: string }>;
} = {
  americas: FaGlobeAmericas,
  europe: FaGlobeEurope,
  asia: FaGlobeAsia,
  africa: FaGlobeAfrica,
  australia: FaGlobe,
};

export const CurrencyIconMapping: {
  [type in Currency]: React.ComponentType<{ className: string }>;
} = {
  usd: BsCurrencyDollar,
  eur: BsCurrencyEuro,
};
export const CurrencySymbolMapping: {
  [type in Currency]: string;
} = {
  usd: "$",
  eur: "€",
};
