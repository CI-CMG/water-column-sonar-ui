// // This file demonstrates typical usage of Redux Toolkit's createSlice function
// // for defining reducer logic and actions, as well as related thunks and selectors.
// // https://codesandbox.io/p/sandbox/github/reduxjs/redux-templates/tree/master/packages/rtk-app-structure-example?file=%2Fsrc%2Ffeatures%2Fcounter%2FcounterSlice.ts%3A1%2C1-101%2C1&from-embed

// import type { RootState } from "../../app/store.js";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import { createSlice } from "@reduxjs/toolkit";
// import { WaterColumnColors } from '../../view/WaterColumnView/WaterColumnColors';

// export interface CruiseState {
//   ship: string | null,
//   cruise: string | null,
//   sensor: string | null,

//   // Clicked values
//   time: string | null,
//   latitude: number | null,
//   longitude: number | null,
//   depth: number | null,
//   sv: number | null,

//   // Toggle frequencies
//   // frequencies: Array<number>,
//   frequency: number | null, // index?
  
//   // Color Palette
//   // colorMaps: Array<object>,
//   // selectedColorMap: number, // index?

//   // Sv Range thresholds
//   svMin: number,
//   svMax: number,

// }

// const initialState: CruiseState = {
//   ship: null, // "Henry_B._Bigelow",
//   cruise: null, // "HB0707",
//   sensor: null, // "EK60",

//   time: "2025-03-06T16:13:30Z", // null, // 2025-03-06T16:13:30Z
//   latitude: 42.7648, // null, // 32.7648° N
//   longitude: -68.3714, // null, // -117.3714° E
//   depth: 321.01, // null, // 123.45 meters
//   sv: -67.89, // null, // -70.11 dB

//   // frequencies: [18000, 38000, 120000, 200000], // does this belong with the zarr stuff?
//   frequency: null,

//   // colorMaps: WaterColumnColors,
//   // selectedColorMap: 0,

//   svMin: -80,
//   svMax: -30,
// }

// export const cruiseSlice = createSlice({
  
//   name: "cruise",
  
//   initialState,
  
//   reducers: {
//     updateShip: (state, action: PayloadAction<string>) => {
//       state.ship = action.payload
//     },
//     updateCruise: (state, action: PayloadAction<string>) => {
//       state.cruise = action.payload
//     },
//     updateSensor: (state, action: PayloadAction<string>) => {
//       state.sensor = action.payload
//     },

//     updateTime: (state, action: PayloadAction<string>) => {
//       state.time = action.payload
//     },
//     updateLatitude: (state, action: PayloadAction<number>) => {
//       state.latitude = action.payload
//     },
//     updateLongitude: (state, action: PayloadAction<number>) => {
//       state.longitude = action.payload
//     },
//     updateDepth: (state, action: PayloadAction<number>) => {
//       state.depth = action.payload
//     },
//     updateSv: (state, action: PayloadAction<number>) => {
//       state.sv = action.payload
//     },

//     // updateFrequencies: (state, action: PayloadAction<number>) => {
//     //   state.frequencies = action.payload
//     // },
//     updateFrequency: (state, action: PayloadAction<number>) => { // dropdown
//       state.frequency = action.payload
//     },

//     // updateColorMaps: (state, action: PayloadAction<Array<object>>) => {
//     //   state.colorMaps = action.payload
//     // },
//     // updateSelectedColorMap: (state, action: PayloadAction<number>) => { // dropdown
//     //   state.selectedColorMap = action.payload
//     // },

//     updateSvMin: (state, action: PayloadAction<number>) => { // button click
//       state.svMin = Number(action.payload);
//     },
//     updateSvMax: (state, action: PayloadAction<number>) => { // button click
//       state.svMax = Number(action.payload);
//     },
//   },
// });

// export const {
//   updateShip,
//   updateCruise,
//   updateSensor,
//   updateTime,
//   updateLatitude,
//   updateLongitude,
//   updateDepth,
//   updateSv,
//   updateFrequency,
//   // updateSelectedColorMap,
//   updateSvMin,
//   updateSvMax,
// } = cruiseSlice.actions;

// export default cruiseSlice.reducer;

// export const selectShip = (state: RootState) => state.cruise.ship;
// export const selectCruise = (state: RootState) => state.cruise.cruise;
// export const selectSensor = (state: RootState) => state.cruise.sensor;
// export const selectTime = (state: RootState) => state.cruise.time;
// export const selectLatitude = (state: RootState) => state.cruise.latitude;
// export const selectLongitude = (state: RootState) => state.cruise.longitude;
// export const selectDepth = (state: RootState) => state.cruise.depth;
// export const selectSv = (state: RootState) => state.cruise.sv;
// export const selectFrequency = (state: RootState) => state.cruise.frequency;
// // export const selectSelectedColorMap = (state: RootState) => state.cruise.selectedColorMap;
// export const selectSvMin = (state: RootState) => state.cruise.svMin;
// export const selectSvMax = (state: RootState) => state.cruise.svMax;


