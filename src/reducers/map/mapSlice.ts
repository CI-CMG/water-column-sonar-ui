import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.js";

// For variables related to the main map view

export interface MapState {
  
  shipHovered: string | null,
  cruiseHovered: string | null,
  sensorHovered: string | null,
}

const initialState: MapState = {

  shipHovered: null,
  cruiseHovered: null,
  sensorHovered: null,
}

export const mapSlice = createSlice({
  name: "map",
  
  initialState,
  
  reducers: {

    updateShipHovered: (state, action: PayloadAction<string>) => {
      state.shipHovered = action.payload
    },
    updateCruiseHovered: (state, action: PayloadAction<string>) => {
      state.cruiseHovered = action.payload
    },
    updateSensorHovered: (state, action: PayloadAction<string>) => {
      state.sensorHovered = action.payload
    },
  },

  extraReducers: builder => {},
});

export const {

  updateShipHovered,
  updateCruiseHovered,
  updateSensorHovered,
} = mapSlice.actions;

export default mapSlice.reducer;

export const selectShipHovered = (state: RootState) => state.map.shipHovered;
export const selectCruiseHovered = (state: RootState) => state.map.cruiseHovered;
export const selectSensorHovered = (state: RootState) => state.map.sensorHovered;