import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../reducers/counter/counterSlice";
import cruiseReducer from "../reducers/cruise/cruiseSlice";
import storeReducer from "../reducers/store/storeSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cruise: cruiseReducer,
    store: storeReducer,
  },
})

export type AppStore = typeof store

export type RootState = ReturnType<AppStore["getState"]>

export type AppDispatch = AppStore["dispatch"]

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
