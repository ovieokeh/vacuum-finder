import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FloorType, VacuumsFilter } from "../types";

const initialState: VacuumsFilter = {
  floorType: FloorType.Hardwood,
  budget: 500,
  houseSizeSqM: 32,
  numRooms: 1,
  numPets: 0,
  mopFunction: true,
};

interface UpdateValuePayload {
  value: VacuumsFilter;
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
export const selectVacuumFilters = (state: { vacuumFilters: VacuumsFilter }) => state.vacuumFilters;
export default vacuumFiltersSlice.reducer;
