import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacuumsFilters } from "../types";

export const initialSearchFiltersState: VacuumsFilters = {
  budget: 1_000,
  numPets: 0,
  region: "americas",
  currency: "usd",
  brand: "",
  mappingTechnology: "laser" as const,
  batteryLifeInMinutes: 20,
  suctionPowerInPascals: 1000,
  noiseLevelInDecibels: 75,
  waterTankCapacityInLiters: 0,
  dustbinCapacityInLiters: 0,
  hasChildLockFeature: null,
  hasMoppingFeature: null,
  hasSelfEmptyingFeature: null,
  hasSelfCleaningFeature: null,
  hasZoneCleaningFeature: null,
  hasMultiFloorMappingFeature: null,
  hasVirtualWallsFeature: null,
  hasAppControlFeature: null,
  hasVoiceControlFeature: null,
  hasManualControlFeature: null,
  hasAutoLiftMopFeature: null,
  hasGoogleOrAlexaIntegrationFeature: null,
  maxObjectClearanceInMillimeters: 0,
  surfaceRecommendations: [],
};

interface UpdateValuePayload {
  value: VacuumsFilters;
}

const vacuumFiltersSlice = createSlice({
  name: "vacuumFilters",
  initialState: initialSearchFiltersState,
  reducers: {
    replaceState: (state, action: PayloadAction<UpdateValuePayload>) => {
      return action.payload.value;
    },
  },
});

export const { replaceState } = vacuumFiltersSlice.actions;
export const selectVacuumFilters = (state: { vacuumFilters: VacuumsFilters }) => state.vacuumFilters;
export default vacuumFiltersSlice.reducer;
