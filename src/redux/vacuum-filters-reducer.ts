import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacuumsFilters } from "../types";

const initialState: VacuumsFilters = {
  budget: 500,
  numPets: 0,
  mopFunction: true,
  region: "americas" as const,
  currency: "usd" as const,
};

interface UpdateValuePayload {
  value: VacuumsFilters;
}

const vacuumFiltersSlice = createSlice({
  name: "vacuumFilters",
  initialState,
  reducers: {
    replaceState: (state, action: PayloadAction<UpdateValuePayload>) => {
      return action.payload.value;
    },
  },
});

export const { replaceState } = vacuumFiltersSlice.actions;
export const selectVacuumFilters = (state: { vacuumFilters: VacuumsFilters }) => state.vacuumFilters;
export default vacuumFiltersSlice.reducer;
