// This file demonstrates typical usage of Redux Toolkit's createSlice function
// for defining reducer logic and actions, as well as related thunks and selectors.
// https://codesandbox.io/p/sandbox/github/reduxjs/redux-templates/tree/master/packages/rtk-app-structure-example?file=%2Fsrc%2Ffeatures%2Fcounter%2FcounterSlice.ts%3A1%2C1-101%2C1&from-embed

import type { RootState } from "../../app/store.js";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface CruiseState {
  ship: string,
  cruise: string,
  sensor: string,
  // time: string,
  // latitude: number,
  // longitude: number,
  // depth: number,
  // sv: number,
}

const initialState: CruiseState = {
  ship: "", // "Henry_B._Bigelow",
  cruise: "", // "HB0707",
  sensor: "", // "EK60",
}

export const cruiseSlice = createSlice({
  
  name: "cruise",
  
  initialState,
  
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
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
})

// Export the generated action creators for use in components
export const { updateShip, updateCruise, updateSensor } = cruiseSlice.actions

export default cruiseSlice.reducer

export const selectShip = (state: RootState) => state.cruise.ship
export const selectCruise = (state: RootState) => state.cruise.cruise
export const selectSensor = (state: RootState) => state.cruise.sensor

