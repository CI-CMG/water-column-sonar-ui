// This file demonstrates typical usage of Redux Toolkit's createSlice function
// for defining reducer logic and actions, as well as related thunks and selectors.
// https://codesandbox.io/p/sandbox/github/reduxjs/redux-templates/tree/master/packages/rtk-app-structure-example?file=%2Fsrc%2Ffeatures%2Fcounter%2FcounterSlice.ts%3A1%2C1-101%2C1&from-embed

import type { RootState } from "../../app/store.js";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface StoreState {
  ship: string | null,
  cruise: string | null,
  sensor: string | null,
}

const initialState: StoreState = {
  ship: null, // "Henry_B._Bigelow",
  cruise: null, // "HB0707",
  sensor: null, // "EK60",
}

export const storeSlice = createSlice({
  
  name: "store",
  
  initialState,
  
  reducers: {
    // TODO: need to include the zarr stores
    // and the x, y, z of the mouse clicks

    updateShip: (state, action: PayloadAction<string>) => {
      state.ship = action.payload
    },
    updateCruise: (state, action: PayloadAction<string>) => {
      state.cruise = action.payload
    },
    updateSensor: (state, action: PayloadAction<string>) => {
      state.sensor = action.payload
    },
  },
});

export const {
  updateShip,
  updateCruise,
  updateSensor,
} = storeSlice.actions;

export default storeSlice.reducer;

export const selectShip = (state: RootState) => state.store.ship;
export const selectCruise = (state: RootState) => state.store.cruise;
export const selectSensor = (state: RootState) => state.store.sensor;


