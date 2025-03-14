import { useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import vacuumFiltersReducer from "./vacuum-filters-reducer";

let isomorphicStorage: any;
if (typeof window === "undefined") {
  await import("redux-persist-node-storage").then((module) => {
    const AsyncNodeStorage = module.AsyncNodeStorage;
    isomorphicStorage = new AsyncNodeStorage("./.storage");
  });
} else {
  await import("redux-persist/lib/storage").then((module) => {
    const clientStorage = module.default;
    isomorphicStorage = clientStorage;
  });
}

const persistConfig = {
  key: "root",
  storage: isomorphicStorage,
  whiteList: ["vacuumsFilters"],
};

const reducers = combineReducers({
  vacuumsFilters: vacuumFiltersReducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const reduxStore = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(reduxStore);

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
