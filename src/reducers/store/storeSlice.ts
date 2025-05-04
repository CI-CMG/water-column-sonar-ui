import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts";
import { WaterColumnColors } from '../../view/WaterColumnView/WaterColumnColors';

import {
  fetchStoreAttributes,
  fetchStoreShape,
  fetchFrequencies,
  fetchLatitude,
  fetchLongitude,
  fetchTime,
  fetchDepth,
  fetchBottom,
  fetchSv,
} from "./storeAPI.js";


export interface StoreState {
  ship: string | null,
  cruise: string | null,
  sensor: string | null,

  // Sv Range thresholds
  svMin: number,
  svMax: number,

  depthIndex: number,
  timeIndex: number | null, // value passed in via url to jump to location
  frequencyIndex: number,

  colorMaps: any,
  colorMapButtonIndex: number,

  storeAttributes: any,
  storeAttributesStatus: "idle" | "loading" | "failed",
  // attributes: any, // metadata of the store
  // calibration_status, cruise_name, processing_software_name, processing_software_time, processing_software_version, sensor_name, ship_name, tile_size

  storeShape: any,
  storeShapeStatus: "idle" | "loading" | "failed",

  frequencies: any,
  frequenciesStatus: "idle" | "loading" | "failed",
  frequencyButtonIndex: number,
  
  latitude: number | null,
  latitudeStatus: "idle" | "loading" | "failed",

  longitude: number | null,
  longitudeStatus: "idle" | "loading" | "failed",

  time: any,
  timeStatus: "idle" | "loading" | "failed",

  depth: number | null,
  depthStatus: "idle" | "loading" | "failed",

  bottom: number | null,
  bottomStatus: "idle" | "loading" | "failed",

  sv: any, // BigUInt64? -> Float32Array
  svStatus: "idle" | "loading" | "failed",
}

const initialState: StoreState = {
  ship: null, // "Henry_B._Bigelow",
  cruise: null, // "HB0707",
  sensor: null, // "EK60",

  svMin: -80, // default values for min & max Sv threshold
  svMax: -30,

  depthIndex: 0, // these will hold mouses click coordinates
  timeIndex: null,
  frequencyIndex: 0,

  colorMaps: WaterColumnColors,
  colorMapButtonIndex: 0, // TODO: should be defined by the url param

  storeAttributes: null,
  storeAttributesStatus: "idle",
  // attributes: null,

  storeShape: null,
  storeShapeStatus: "idle",

  frequencies: null, // BigUint64Array(4)
  frequenciesStatus: "idle",
  frequencyButtonIndex: 0, // start with first frequency selected
  
  latitude: null,
  latitudeStatus: "idle",
  
  longitude: null,
  longitudeStatus: "idle",

  time: null,
  timeStatus: "idle",

  depth: null,
  depthStatus: "idle",

  bottom: null,
  bottomStatus: "idle",
  
  sv: null,
  svStatus: "idle",
}

export const storeSlice = createSlice({
  name: "store",
  
  initialState,
  
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
    updateSvMin: (state, action: PayloadAction<number>) => { // button click
      console.log('updated Sv Min')
      state.svMin = Number(action.payload);
    },
    updateSvMax: (state, action: PayloadAction<number>) => { // button click
      state.svMax = Number(action.payload);
    },

    // these hold the clicked index position
    updateDepthIndex: (state, action: PayloadAction<number>) => {
      state.depthIndex = action.payload;
    },
    updateTimeIndex: (state, action: PayloadAction<number>) => {
      state.timeIndex = action.payload;
    },
    updateFrequencyIndex: (state, action: PayloadAction<number>) => {
      state.frequencyIndex = action.payload;
    },
     
    updateColorMaps: (state, action: PayloadAction<any>) => { // do i need these
      state.colorMaps = action.payload;
    },
    updateColorMapButtonIndex: (state, action: PayloadAction<any>) => {
      state.colorMapButtonIndex = action.payload;
    },
    //
    updateFrequencies: (state, action: PayloadAction<any>) => { // do i need these
      state.frequencies = action.payload;
    },
    updateFrequencyButtonIndex: (state, action: PayloadAction<any>) => {
      state.frequencyButtonIndex = action.payload;
    },
    //
    updateLatitude: (state, action: PayloadAction<any>) => {
      state.latitude = action.payload;
    },
    updateLongitude: (state, action: PayloadAction<any>) => {
      state.longitude = action.payload;
    },
    updateTime: (state, action: PayloadAction<any>) => {
      state.time = action.payload;
    },
    updateDepth: (state, action: PayloadAction<any>) => {
      state.depth = action.payload;
    },
    updateBottom: (state, action: PayloadAction<any>) => {
      state.bottom = action.payload;
    },
    updateSv: (state, action: PayloadAction<any>) => {
      state.sv = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(storeAttributesAsync.pending, state => {
        state.storeAttributesStatus = "loading";
      })
      .addCase(storeAttributesAsync.fulfilled, (state, action) => {
        state.storeAttributesStatus = "idle";
        state.storeAttributes = action.payload; // attrs
      })
      .addCase(storeAttributesAsync.rejected, state => {
        state.storeAttributesStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(storeShapeAsync.pending, state => {
        state.storeShapeStatus = "loading";
      })
      .addCase(storeShapeAsync.fulfilled, (state, action) => {
        state.storeShapeStatus = "idle";
        state.storeShape = action.payload;
      })
      .addCase(storeShapeAsync.rejected, state => {
        state.storeShapeStatus = "failed";
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
      .addCase(latitudeAsync.pending, state => {
        state.latitudeStatus = "loading";
      })
      .addCase(latitudeAsync.fulfilled, (state, action) => {
        state.latitudeStatus = "idle";
        state.latitude = action.payload;
      })
      .addCase(latitudeAsync.rejected, state => {
        state.latitudeStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(longitudeAsync.pending, state => {
        state.longitudeStatus = "loading";
      })
      .addCase(longitudeAsync.fulfilled, (state, action) => {
        state.longitudeStatus = "idle";
        state.longitude = action.payload;
      })
      .addCase(longitudeAsync.rejected, state => {
        state.longitudeStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(timeAsync.pending, state => {
        state.timeStatus = "loading";
      })
      .addCase(timeAsync.fulfilled, (state, action) => {
        state.timeStatus = "idle";
        state.time = action.payload;
      })
      .addCase(timeAsync.rejected, state => {
        state.timeStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(depthAsync.pending, state => {
        state.depthStatus = "loading";
      })
      .addCase(depthAsync.fulfilled, (state, action) => {
        state.depthStatus = "idle";
        state.depth = action.payload;
      })
      .addCase(depthAsync.rejected, state => {
        state.depthStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(bottomAsync.pending, state => {
        state.bottomStatus = "loading";
      })
      .addCase(bottomAsync.fulfilled, (state, action) => {
        state.bottomStatus = "idle";
        state.bottom = action.payload;
      })
      .addCase(bottomAsync.rejected, state => {
        state.bottomStatus = "failed";
      })
      // ----------------------------------------------- //
      .addCase(svAsync.pending, state => {
        state.svStatus = "loading";
      })
      .addCase(svAsync.fulfilled, (state, action) => {
        state.svStatus = "idle";
        state.sv = action.payload;
      })
      .addCase(svAsync.rejected, state => {
        state.svStatus = "failed";
      });
      // ----------------------------------------------- //
  },
});

export const {
  updateShip,
  updateCruise,
  updateSensor,
  updateSvMin,
  updateSvMax,
  //
  updateDepthIndex, // mouse click locations
  updateTimeIndex,
  updateFrequencyIndex, // <- derive from button?
  //
  updateColorMaps,
  updateColorMapButtonIndex,
  // TODO: colorMap
  updateFrequencies,
  updateFrequencyButtonIndex, // holds button select index
  updateLatitude,
  updateLongitude,
  updateTime,
  updateDepth,
  updateBottom,
  updateSv,
} = storeSlice.actions;

export default storeSlice.reducer;

export const selectStoreAttributes = (state: RootState) => state.store.storeAttributes;
export const selectStoreShape = (state: RootState) => state.store.storeShape;
export const selectShip = (state: RootState) => state.store.ship;
export const selectCruise = (state: RootState) => state.store.cruise;
export const selectSensor = (state: RootState) => state.store.sensor;
export const selectSvMin = (state: RootState) => state.store.svMin;
export const selectSvMax = (state: RootState) => state.store.svMax;

export const selectColorMaps = (state: RootState) => state.store.colorMaps;
export const selectColorMapButtonIndex = (state: RootState) => state.store.colorMapButtonIndex;

// store the indices of the clicked position
export const selectDepthIndex = (state: RootState) => state.store.depthIndex;
export const selectTimeIndex = (state: RootState) => state.store.timeIndex; // url timeIndex jump to
export const selectFrequencyIndex = (state: RootState) => state.store.frequencyIndex;

// export const selectAttributes = (state: RootState) => state.store.attributes; // TODO: remove
export const selectFrequencies = (state: RootState) => state.store.frequencies;
export const selectFrequencyButtonIndex = (state: RootState) => state.store.frequencyButtonIndex;
export const selectLatitude = (state: RootState) => state.store.latitude;
export const selectLongitude = (state: RootState) => state.store.longitude;
export const selectTime = (state: RootState) => state.store.time;
export const selectDepth = (state: RootState) => state.store.depth;
export const selectBottom = (state: RootState) => state.store.bottom;
export const selectSv = (state: RootState) => state.store.sv;

// Just getting metadata from the store
export const storeAttributesAsync = createAsyncThunk(
  "store/fetchStoreAttributes",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchStoreAttributes(ship, cruise, sensor);
    return response;
  },
)

export const storeShapeAsync = createAsyncThunk( // gets the shape of the overall Sv array
  "store/fetchStoreShape",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchStoreShape(ship, cruise, sensor);
    return response;
  },
)

export const frequenciesAsync = createAsyncThunk(
  "store/fetchFrequencies",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchFrequencies(ship, cruise, sensor);
    return [...response.data].map((x) => Number(x));
  },
)

export const latitudeAsync = createAsyncThunk( // only need to pass in the index value for one indice
  "store/fetchLatitude",
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }) => {
    const response = await fetchLatitude(ship, cruise, sensor, indexTime);
    return Math.round(response * 1e5) / 1e5;
  },
)

export const longitudeAsync = createAsyncThunk(
  "store/fetchLongitude",
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }) => {
    const response = await fetchLongitude(ship, cruise, sensor, indexTime);
    return Math.round(response * 1e5) / 1e5;
  },
)

export const timeAsync = createAsyncThunk(
  "store/fetchTime",
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }) => {
    const response = await fetchTime(ship, cruise, sensor, indexTime);
    return response;
  },
)

export const depthAsync = createAsyncThunk(
  "store/fetchDepth",
  async ({ ship, cruise, sensor, indexDepth }: { ship: string, cruise: string, sensor: string, indexDepth: number }) => {
    const response = await fetchDepth(ship, cruise, sensor, indexDepth);
    return Math.round(response * 1e2) / 1e2;
  },
)

export const bottomAsync = createAsyncThunk(
  "store/fetchBottom",
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }) => {
    const response = await fetchBottom(ship, cruise, sensor, indexTime);
    return Math.round(response * 1e2) / 1e2;
  },
)

export const svAsync = createAsyncThunk(
  "store/fetchSv",
  async ({
    ship,
    cruise,
    sensor,
    indexDepth,
    indexTime,
    indexFrequency,
  }: {
    ship: string,
    cruise: string,
    sensor: string,
    indexDepth: number,
    indexTime: number,
    indexFrequency: number,
  }) => {
    const response = await fetchSv(ship, cruise, sensor, indexDepth, indexTime, indexFrequency);
    return [...response.data].map((x: number) => Number(Math.round(x * 1e2) / 1e2))
  },
)