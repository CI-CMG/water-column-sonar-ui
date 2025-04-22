import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { AppThunk, RootState } from "../../app/store.ts";

import {
  fetchStore,
  // fetchDepth,
  // fetchTime,
  fetchFrequencies,
  // fetchLatitude,
  fetchLatitudeArray,
  // fetchLongitude,
  // fetchSv,
} from "./storeAPI.js";


export interface StoreState {
  store: any,
  storeStatus: "idle" | "loading" | "failed",
  attributes: any, // metadata of the store
  // calibration_status, cruise_name, processing_software_name, processing_software_time, processing_software_version, sensor_name, ship_name, tile_size

  x: number,
  y: number,

  // depthArray: any, // temporarily any until know what it is
  // timeArray: any,
  // timeArrayStatus: "idle" | "loading" | "failed",
  
  frequencies: any,
  frequenciesStatus: "idle" | "loading" | "failed",
  
  latitude: any,
  latitudeStatus: "idle" | "loading" | "failed",

  latitudeArray: any,
  latitudeArrayStatus: "idle" | "loading" | "failed",
  
  // longitudeArray: any,
  
  // svArray: any,
}

const initialState: StoreState = {
  store: null,
  storeStatus: "idle",
  attributes: null,
  x: 0,
  y: 0,

  // depthArray: null, // temporarily any until know what it is

  // timeArray: null,
  // timeArrayStatus: "idle",

  frequencies: null, // BigUint64Array(4)
  frequenciesStatus: "idle",
  
  latitude: null,
  latitudeStatus: "idle",

  latitudeArray: null,
  latitudeArrayStatus: "idle",
  
  // longitudeArray: null,
  
  // svArray: null,
}

export const storeSlice = createSlice({
  name: "store",
  
  initialState,
  
  reducers: {
    updateX: (state, action: PayloadAction<number>) => {
      state.x = action.payload;
    },
    updateY: (state, action: PayloadAction<number>) => {
      state.y = action.payload;
    },
    updateFrequencies: (state, action: PayloadAction<any>) => {
      state.frequencies = action.payload;
    },
    updateLatitude: (state, action: PayloadAction<any>) => {
      state.latitude = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(storeAsync.pending, state => {
        state.storeStatus = "loading";
      })
      .addCase(storeAsync.fulfilled, (state, action) => {
        state.storeStatus = "idle";
        // state.store = action.payload; // response.store & response.attrs
        state.attributes = action.payload.attrs;
        state.store = action.payload;
      })
      .addCase(storeAsync.rejected, state => {
        state.storeStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(frequenciesAsync.pending, state => {
        state.frequenciesStatus = "loading";
      })
      .addCase(frequenciesAsync.fulfilled, (state, action) => {
        state.frequenciesStatus = "idle";
        state.frequencies = action.payload;
      })
      .addCase(frequenciesAsync.rejected, state => {
        state.frequenciesStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(latitudeArrayAsync.pending, state => {
        state.latitudeArrayStatus = "loading";
      })
      .addCase(latitudeArrayAsync.fulfilled, (state, action) => {
        state.latitudeArrayStatus = "idle";
        state.latitudeArray = action.payload;
      })
      .addCase(latitudeArrayAsync.rejected, state => {
        state.latitudeArrayStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(latitudeAsync.pending, state => {
        state.latitudeStatus = "loading";
      })
      .addCase(latitudeAsync.fulfilled, (state, action) => {
        state.latitudeStatus = "idle";
        state.latitude = action.payload;
      })
      .addCase(latitudeAsync.rejected, state => {
        state.latitudeStatus = "failed";
      });
      // ----------------------------------------------- //
  },
});

export const { updateX, updateY } = storeSlice.actions;

export default storeSlice.reducer;

export const selectX = (state: RootState) => state.store.x;
export const selectY = (state: RootState) => state.store.y;
export const selectStore = (state: RootState) => state.store.store;
export const selectLatitudeArray = (state: RootState) => state.store.latitudeArray;
export const selectAttributes = (state: RootState) => state.store.attributes;
export const selectFrequencies = (state: RootState) => state.store.frequencies;
// export const Frequencies = (state: RootState) => state.store.frequencies;

export const storeAsync = createAsyncThunk(
  "store/fetchStore",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchStore(ship, cruise, sensor); // how to pass in slice?
    return response; // this doesn't like passing non serializable data to redux
  },
)

export const frequenciesAsync = createAsyncThunk(
  "store/fetchFrequencies",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchFrequencies(ship, cruise, sensor);
    return [...response.data].map((x) => Number(x)); // {data: BigUint64Array(4), shape: Array(1), stride: Array(1), offset: 0}
  },
)

// working with all
// export const latitudeAsync = createAsyncThunk( // only need to pass in the index value for one indice
//   "store/fetchLatitude",
//   async ({ ship, cruise, sensor, index }: { ship: string, cruise: string, sensor: string, index: number }) => {
//     const response = await fetchLatitude(ship, cruise, sensor, index);
//     return response; // {data: BigUint64Array(4), shape: Array(1), stride: Array(1), offset: 0}
//   },
// )

// trying w passed in store
export const latitudeArrayAsync = createAsyncThunk( // only need to pass in the index value for one indice
  "store/fetchLatitudeArray",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchLatitudeArray(ship, cruise, sensor);
    return response;
  },
)

export const latitudeAsync = createAsyncThunk( // only need to pass in the index value for one indice
  "store/fetchLatitude",
  async ({ index }: { index: number }) => {
    const response = await fetchLatitude(selectStore, index);
    return response; // {data: BigUint64Array(4), shape: Array(1), stride: Array(1), offset: 0}
  },
)
