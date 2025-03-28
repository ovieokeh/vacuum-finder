import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacuumsFilters } from "../types";

export const initialSearchFiltersState: VacuumsFilters = {
  budget: 1_000,
  numPets: 0,
  region: "americas",
  currency: "usd",
  brand: "",
  mappingTechnology: "laser" as const,
  batteryLifeInMinutes: null,
  suctionPowerInPascals: null,
  noiseLevelInDecibels: null,
  waterTankCapacityInLiters: null,
  dustbinCapacityInLiters: null,
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
  name: "vacuumsFilters",
  initialState: initialSearchFiltersState,
  reducers: {
    replaceState: (state, action: PayloadAction<UpdateValuePayload>) => {
      return action.payload.value;
    },
    setField: (state, action: { payload: { key: keyof VacuumsFilters; value: any } }) => {
      const key = action.payload.key;
      const typedIndexableState = state as Record<keyof VacuumsFilters, any>;
      typedIndexableState[key] = action.payload.value;

      return typedIndexableState;
    },
  },
});

export const { replaceState, setField } = vacuumFiltersSlice.actions;
export const selectVacuumFilters = (state: { vacuumsFilters: VacuumsFilters }) => state.vacuumsFilters;
export default vacuumFiltersSlice.reducer;
