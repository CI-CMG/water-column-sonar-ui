import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { AppThunk, RootState } from "../../app/store.ts";

import {
  fetchStore,
  // fetchDepth,
  // fetchTime,
  fetchFrequencies,
  // fetchLatitude,
  // fetchLongitude,
  // fetchSv,
} from "./storeAPI.js"; // switch to async zarr store


export interface StoreState {
  store: any,
  storeStatus: "idle" | "loading" | "failed",

  attributes: any, // metadata of the store

  x: number,
  y: number,

  // depthArray: any, // temporarily any until know what it is
  
  // timeArray: any,
  // timeArrayStatus: "idle" | "loading" | "failed",
  
  frequencies: any,
  frequenciesStatus: "idle" | "loading" | "failed",
  
  // latitudeArray: any,
  
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
  
  // latitudeArray: null,
  
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
  },

  extraReducers: builder => {
    builder
      .addCase(storeAsync.pending, state => {
        state.storeStatus = "loading";
      })
      .addCase(storeAsync.fulfilled, (state, action) => {
        state.storeStatus = "idle";
        state.store = action.payload.store; // response.store & response.attrs
        // state.attributes = action.payload.attrs;
      })
      .addCase(storeAsync.rejected, state => {
        state.storeStatus = "failed";
      })
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
  },
});

export const { updateX, updateY } = storeSlice.actions;

export default storeSlice.reducer;

export const selectX = (state: RootState) => state.store.x;
export const selectY = (state: RootState) => state.store.y;
export const selectFrequencies = (state: RootState) => state.store.frequencies;



export const storeAsync = createAsyncThunk(
  "store/fetchStore",
  async (ship: string, cruise: string, sensor: string) => {
    const response = await fetchStore(ship, cruise, sensor); // how to pass in slice?
    return response; // so now put response 
  },
)

export const frequenciesAsync = createAsyncThunk(
  "store/fetchFrequencies",
  async (ship: string, cruise: string, sensor: string) => {
    const response = await fetchFrequencies(ship, cruise, sensor);
    return [...response.data].map((x) => Number(x)); // {data: BigUint64Array(4), shape: Array(1), stride: Array(1), offset: 0}
  },
)
