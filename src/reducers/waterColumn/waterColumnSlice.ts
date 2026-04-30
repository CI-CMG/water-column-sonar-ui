import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.js";
// @ts-ignore
import { WaterColumnColors } from '../../view/WaterColumnView/WaterColumnColors';

// For variables related to the Water Column Sonar view

export interface WaterColumnState {
  
  colorIndex: number | null,
  colorMaps: any,
}

const initialState: WaterColumnState = {

  colorIndex: 2,
  colorMaps: WaterColumnColors,
}

export const waterColumnSlice = createSlice({
  name: "WaterColumn",
  
  initialState,
  
  reducers: {

    updateColorIndex: (state, action: PayloadAction<number>) => {
      state.colorIndex = action.payload;
    },
    updateColorMaps: (state, action: PayloadAction<any>) => {
      state.colorMaps = action.payload;
    },
  },

  extraReducers: builder => {},
});

export const {

  updateColorIndex,
  updateColorMaps,
} = waterColumnSlice.actions;

export default waterColumnSlice.reducer;

export const selectColorIndex = (state: RootState) => state.waterColumn.colorIndex;
export const selectColorMaps = (state: RootState) => state.waterColumn.colorMaps;