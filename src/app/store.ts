import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import storeReducer from "../reducers/store/storeSlice";
import graphReduce from "../reducers/graph/graphSlice";
import mapReducer from "../reducers/map/mapSlice";
import waterColumnReducer from "../reducers/waterColumn/waterColumnSlice";
import { api } from '../services/api';


export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
  configureStore({
    reducer: {
      store: storeReducer,
      //
      graph: graphReduce,
      map: mapReducer,
      waterColumn: waterColumnReducer,
      //
      [api.reducerPath]: api.reducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //   serializableCheck: false, // TODO: make this more targeted to just the zarr store
    // }),
    // middleware: (getDefaultMiddleware) =>
    //   // getDefaultMiddleware().concat(api.middleware),
    //   // serializableCheck: false, // TODO: make this more targeted to just the zarr store
    //   getDefaultMiddleware({
    //     serializableCheck: false,
    //   }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // added this because there was a problem with the 'updateDepthArray'
        serializableCheck: false,
      }).concat(api.middleware),
    ...options,
  })


export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
