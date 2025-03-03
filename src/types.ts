import { BsCurrencyDollar, BsCurrencyEuro } from "react-icons/bs";
import { FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope } from "react-icons/fa";

export enum VacuumMappingTechnology {
  Laser = "Laser",
  Camera = "Camera",
}
export interface Vacuum {
  id: string;
  name: string;
  image: string;
  brand: string;
  model: string;
  price: number;
  batteryLifeMins: number;
  suctionPowerPa: number;
  noiseLevelDb: number;
  mappingTechnology: VacuumMappingTechnology;
  multiFloorMapping: boolean | null;
  virtualWalls: boolean | null;
  mopFunction: boolean | null;
  selfEmptying: boolean | null;
  appControl: boolean | null;
  petHair: boolean | null;
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

export interface AffiliateLink {
  id: string;
  vacuumId: string;
  region: Region;
  site: string;
  link: string;
}
