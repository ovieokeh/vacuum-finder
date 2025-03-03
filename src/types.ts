export interface Vacuum {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  available: boolean;
}

export enum FloorType {
  Carpet = "Carpet",
  Hardwood = "Hardwood",
  Tile = "Tile",
  Laminate = "Laminate",
}

export interface VacuumFilterOptions {
  houseSizeSqM: number;
  floorType: FloorType;
  budget: number;
  numRooms: number;
  numPets: number;
  mopFeature: boolean;
}
