import { useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { CookieStorage } from "redux-persist-cookie-storage";
import Cookies from "cookies-js";

import vacuumFiltersReducer from "./vacuum-filters-reducer";

const reducers = combineReducers({
  vacuumsFilters: vacuumFiltersReducer,
});

const storage =
  typeof window === "undefined"
    ? undefined
    : new CookieStorage(Cookies, {
        expiration: {
          // 1 minute
          default: 60,
        },
      });

export const reduxStore = storage
  ? configureStore({
      reducer: persistReducer(
        {
          key: "root",
          storage,
          whitelist: ["vacuumsFilters"],
        },
        reducers
      ),
    })
  : configureStore({
      reducer: reducers,
    });

export const persistor = storage ? persistStore(reduxStore) : undefined;

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
