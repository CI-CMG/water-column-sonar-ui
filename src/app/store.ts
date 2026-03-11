import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import counterReducer from "../reducers/counter/counterSlice";
import storeReducer from "../reducers/store/storeSlice";
import { api } from '../services/api';


export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
  configureStore({
    reducer: {
      counter: counterReducer,
      // cruise: cruiseReducer,
      store: storeReducer,
      [api.reducerPath]: api.reducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    //   serializableCheck: false, // TODO: make this more targeted to just the zarr store
    // }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options,
  })


export const store = createStore();

// export type AppDispatch = AppStore["dispatch"]
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
// export type RootState = ReturnType<AppStore["getState"]>
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
