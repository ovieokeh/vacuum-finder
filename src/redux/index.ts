import { useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { CookieStorage } from "redux-persist-cookie-storage";
import Cookies from "cookies-js";

import vacuumFiltersReducer from "./vacuum-filters-reducer";

const persistConfig = {
  key: "root",
  storage: new CookieStorage(Cookies /*, options */),
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
