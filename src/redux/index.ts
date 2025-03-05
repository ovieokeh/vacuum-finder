import { configureStore } from "@reduxjs/toolkit";

import vacuumFiltersReducer from "./vacuum-filters-reducer";
import { useDispatch, useSelector } from "react-redux";

export const reduxStore = configureStore({
  reducer: {
    vacuumsFilters: vacuumFiltersReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
