import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacuumsFilters } from "../types";

export const initialSearchFiltersState: VacuumsFilters = {
  budget: 10000,
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
  hasZoneCleaningFeature: null,
  hasMultiFloorMappingFeature: null,
  hasVirtualWallsFeature: null,
  hasSmartHomeIntegrationFeature: null,
  hasAppControlFeature: null,
  hasVoiceControlFeature: null,
  hasManualControlFeature: null,
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
