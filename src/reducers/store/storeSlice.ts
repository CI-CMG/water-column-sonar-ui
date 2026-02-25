// import { RootState } from './../../app/store';
import type { PayloadAction } from "@reduxjs/toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.ts";
import { useSearchParams } from 'react-router';
// @ts-ignore
import { WaterColumnColors } from '../../view/WaterColumnView/WaterColumnColors';

import {
  fetchStoreAttributes,
  fetchStoreShape,
  fetchFrequencies,
  fetchLatitude,
  fetchLongitude,
  fetchGeospatialIndex,
  fetchTime,
  fetchTimeArray,
  fetchDepth,
  fetchDepthArray,
  fetchBottom,
  fetchSv,
  fetchSpeed,
  fetchDistance,
  // alex's ai results
  fetchAIStoreAttributes, // probably don't need, just need tile?
  fetchAIStoreShape,
  fetchAISvTile,
} from "./storeAPI.js";


export interface StoreState {
  // showInfoPanel: boolean,

  ship: string | null,
  cruise: string | null,
  sensor: string | null,

  shipHovered: string | null,
  cruiseHovered: string | null,
  sensorHovered: string | null,

  // Sv Range thresholds
  svMin: number,
  svMax: number,

  depthIndex: number,
  timeIndex: number | null, // value passed in via url to jump to location
  frequencyIndex: number | null,
  colorIndex: number | null,

  depthMinIndex: number | null, // leaflet minY for axes
  depthMaxIndex: number | null, // leaflet maxY for axes
  
  depthArray: Array<number> | null,
  depthArrayStatus: "idle" | "loading" | "failed",

  timeMinIndex: number | null, // leaflet minX for axes
  timeMaxIndex: number | null, // leaflet maxX for axes
  
  timeArray: Array<number> | null,
  timeArrayStatus: "idle" | "loading" | "failed",

  colorMaps: any, // TODO: get rid of this?

  annotation: boolean, // highlights polygon annotations on the leaflet layer
  annotationColor: string, // color of polygon for annotations --> should be string

  // alex's ai
  annotationAI: boolean, // allows overlay of ai results

  storeAttributes: any,
  storeAttributesStatus: "idle" | "loading" | "failed",
  // attributes: any, // metadata of the store
  // calibration_status, cruise_name, processing_software_name, processing_software_time, processing_software_version, sensor_name, ship_name, tile_size

  // Alex's AI
  aiStoreAttributes: any,
  aiStoreAttributesStatus: "idle" | "loading" | "failed",

  storeShape: number[] | null,
  storeShapeStatus: "idle" | "loading" | "failed",
  // alex's ai
  aiStoreShape: number[] | null,
  aiStoreShapeStatus: "idle" | "loading" | "failed",

  frequencies: any,
  frequenciesStatus: "idle" | "loading" | "failed",
  
  latitude: number | null,
  latitudeStatus: "idle" | "pending" | "succeeded" | "failed",

  longitude: number | null,
  longitudeStatus: "idle" | "pending" | "succeeded" | "failed",
  // longitudeStatus: "idle" | "pending" | "succeeded" | "failed",
  // longitudeError: string | null,

  geospatialIndex: number | null,
  geospatialIndexStatus: "idle" | "loading" | "failed",

  time: any,
  timeStatus: "idle" | "loading" | "failed",

  depth: number | null,
  depthStatus: "idle" | "loading" | "failed",

  bottom: number | null,
  bottomStatus: "idle" | "loading" | "failed",

  sv: any, // BigUInt64? -> Float32Array
  svStatus: "idle" | "loading" | "failed",

  speed: any,
  speedStatus: "idle" | "loading" | "failed",

  distance: any,
  distanceStatus: "idle" | "loading" | "failed",

  // Alex's AI
  aiSv: any, // BigUInt64? -> Float32Array
  aiSvStatus: "idle" | "loading" | "failed",
}

const initialState: StoreState = {
  // showInfoPanel: false,

  ship: null, // "Henry_B._Bigelow",
  cruise: null, // "HB0707",
  sensor: null, // "EK60",

  shipHovered: null,
  cruiseHovered: null,
  sensorHovered: null,

  svMin: -120, // default values for min & max Sv threshold
  svMax: -10,

  depthIndex: 0, // these will hold mouse click coordinates
  timeIndex: null,
  frequencyIndex: null,

  depthMinIndex: null,
  depthMaxIndex: null,
  
  depthArray: null, // will hold result of query
  depthArrayStatus: "idle",
  
  timeMinIndex: null,
  timeMaxIndex: null,
  
  timeArray: null,
  timeArrayStatus: "idle",

  colorIndex: null,
  colorMaps: WaterColumnColors, // get rid of

  annotation: false,
  annotationColor: "#fff",

  annotationAI: false,

  storeAttributes: null,
  storeAttributesStatus: "idle",
  // attributes: null
  // alexs ai
  aiStoreAttributes: null,
  aiStoreAttributesStatus: "idle",

  storeShape: null,
  storeShapeStatus: "idle",
  // alexs ai
  aiStoreShape: null,
  aiStoreShapeStatus: "idle",

  frequencies: null, // BigUint64Array(4)
  frequenciesStatus: "idle",
  // frequencyButtonIndex: null, // start with first frequency selected
  
  latitude: null,
  latitudeStatus: "idle",
  
  longitude: null,
  longitudeStatus: "idle",

  geospatialIndex: null,
  geospatialIndexStatus: "idle",

  time: null,
  timeStatus: "idle",

  depth: null,
  depthStatus: "idle",

  bottom: null,
  bottomStatus: "idle",
  
  sv: null,
  svStatus: "idle",

  speed: null,
  speedStatus: "idle",

  distance: null,
  distanceStatus: "idle",

  // alexs ai
  aiSv: null,
  aiSvStatus: "idle",
}

export const storeSlice = createSlice({
  name: "store",
  
  initialState,
  
  reducers: {
    // updateShowInfoPanel: (state, action: PayloadAction<boolean>) => {
    //   state.showInfoPanel = action.payload
    // },
    //
    updateShip: (state, action: PayloadAction<string>) => {
      state.ship = action.payload
    },
    updateCruise: (state, action: PayloadAction<string>) => {
      state.cruise = action.payload
    },
    updateSensor: (state, action: PayloadAction<string>) => {
      state.sensor = action.payload
    },
    //
    updateShipHovered: (state, action: PayloadAction<string>) => {
      state.shipHovered = action.payload
    },
    updateCruiseHovered: (state, action: PayloadAction<string>) => {
      state.cruiseHovered = action.payload
    },
    updateSensorHovered: (state, action: PayloadAction<string>) => {
      state.sensorHovered = action.payload
    },
    //
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
      // console.log('store slice updateTimeIndex');
      state.timeIndex = action.payload;
    },
    updateFrequencyIndex: (state, action: PayloadAction<number>) => {
      state.frequencyIndex = action.payload;
    },
    //
    updateDepthMinIndex: (state, action: PayloadAction<number>) => {
      state.depthMinIndex = action.payload; // TODO: wrap with Math.round()
    },
    updateDepthMaxIndex: (state, action: PayloadAction<number>) => {
      state.depthMaxIndex = action.payload;
    },
    updateDepthArray: (state, action: PayloadAction<Array<number>>) => { // TODO: Fix this type!!!
      state.depthArray = action.payload;
    },
    updateTimeMinIndex: (state, action: PayloadAction<number>) => {
      state.timeMinIndex = action.payload;
    },
    updateTimeMaxIndex: (state, action: PayloadAction<number>) => {
      state.timeMaxIndex = action.payload;
    },
    updateTimeArray: (state, action: PayloadAction<Array<number>>) => {
      state.timeArray = action.payload;
    },
    //
    updateColorIndex: (state, action: PayloadAction<number>) => {
      state.colorIndex = action.payload;
    },
    //
    updateColorMaps: (state, action: PayloadAction<any>) => { // do i need these
      state.colorMaps = action.payload;
    },
    // updateColorIndex: (state, action: PayloadAction<any>) => {
    //   state.colorMapIndex = action.payload;
    // },
    updateAnnotation: (state, action: PayloadAction<any>) => {
      state.annotation = action.payload;
    },
    updateAnnotationColor: (state, action: PayloadAction<any>) => {
      state.annotationColor = action.payload;
    },

    updateAnnotationAI: (state, action: PayloadAction<any>) => {
      state.annotationAI = action.payload;
    },

    updateFrequencies: (state, action: PayloadAction<any>) => { // do i need these
      state.frequencies = action.payload;
    },
    // updateFrequencyButtonIndex: (state, action: PayloadAction<any>) => {
    //   state.frequencyButtonIndex = action.payload;
    // },
    //
    updateLatitude: (state, action: PayloadAction<any>) => {
      state.latitude = action.payload;
    },
    updateLongitude: (state, action: PayloadAction<any>) => {
      state.longitude = action.payload;
    },
    //
    updateGeospatialIndex: (state, action: PayloadAction<any>) => {
      state.geospatialIndex = action.payload;
    },
    //
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
    updateSpeed: (state, action: PayloadAction<any>) => {
      state.speed = action.payload;
    },
    updateDistance: (state, action: PayloadAction<any>) => {
      state.distance = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      // STOREATTRIBUTES-------------------------------- //
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
      // STORESHAPE------------------------------------- //
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
      // FREQUENCIES------------------------------------ //  
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
      // LATITUDE--------------------------------------- //
      .addCase(latitudeAsync.pending, state => {
        state.latitudeStatus = "pending";
      })
      .addCase(latitudeAsync.fulfilled, (state, action) => {
        state.latitudeStatus = "succeeded";
        state.latitude = action.payload;
      })
      .addCase(latitudeAsync.rejected, state => {
        state.latitudeStatus = "failed";
        // state.longitudeError = action.error.message ?? 'Unknown Error';
      })
      // LONGITUDE-------------------------------------- //
      .addCase(longitudeAsync.pending, (state, action) => {
        // state.longitudeStatus = "loading";
        state.longitudeStatus = "pending";
      })
      .addCase(longitudeAsync.fulfilled, (state, action) => {
        // state.longitudeStatus = "idle";
        state.longitudeStatus = "succeeded";
        state.longitude = action.payload;
      })
      .addCase(longitudeAsync.rejected, (state, action) => {
        state.longitudeStatus = "failed";
        // state.longitudeError = action.error.message ?? 'Unknown Error';
      })
      // GEOSPATIAL------------------------------------- //
      .addCase(geospatialIndexAsync.pending, state => {
        state.geospatialIndexStatus = "loading";
      })
      .addCase(geospatialIndexAsync.fulfilled, (state, action) => {
        state.geospatialIndexStatus = "idle";
        state.geospatialIndex = action.payload;
      })
      .addCase(geospatialIndexAsync.rejected, state => {
        state.geospatialIndexStatus = "failed";
      })
      // TIME------------------------------------------- //
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
      // TIMEARRAY-------------------------------------- //
      .addCase(timeArrayAsync.pending, state => {
        state.timeArrayStatus = "loading";
      })
      .addCase(timeArrayAsync.fulfilled, (state, action) => {
        state.timeArrayStatus = "idle";
        state.timeArray = action.payload;
      })
      .addCase(timeArrayAsync.rejected, state => {
        state.timeArrayStatus = "failed";
      })
      // DEPTH------------------------------------------ //
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
      // DEPTHARRAY------------------------------------- //
      .addCase(depthArrayAsync.pending, state => {
        state.depthArrayStatus = "loading";
      })
      .addCase(depthArrayAsync.fulfilled, (state, action) => {
        state.depthArrayStatus = "idle";
        state.depthArray = action.payload;
      })
      .addCase(depthArrayAsync.rejected, state => {
        state.depthArrayStatus = "failed";
      })
      // BOTTOM----------------------------------------- //
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
      // SV--------------------------------------------- //
      .addCase(svAsync.pending, state => {
        state.svStatus = "loading";
      })
      .addCase(svAsync.fulfilled, (state, action) => {
        state.svStatus = "idle";
        state.sv = action.payload;
      })
      .addCase(svAsync.rejected, state => {
        state.svStatus = "failed";
      })
      // SPEED------------------------------------------ //
      .addCase(speedAsync.pending, state => {
        state.speedStatus = "loading";
      })
      .addCase(speedAsync.fulfilled, (state, action) => {
        state.speedStatus = "idle";
        state.speed = action.payload;
      })
      .addCase(speedAsync.rejected, state => {
        state.speedStatus = "failed";
      })
      // DISTANCE---------------------------------------- //
      .addCase(distanceAsync.pending, state => {
        state.distanceStatus = "loading";
      })
      .addCase(distanceAsync.fulfilled, (state, action) => {
        state.distanceStatus = "idle";
        state.distance = action.payload;
      })
      .addCase(distanceAsync.rejected, state => {
        state.distanceStatus = "failed";
      });
      // ----------------------------------------------- //
  },
});

export const {
  // updateShowInfoPanel, // controls map view panel
  //
  updateShip,
  updateCruise,
  updateSensor,
  //
  updateShipHovered,
  updateCruiseHovered,
  updateSensorHovered,
  //
  updateSvMin,
  updateSvMax,
  //
  updateDepthIndex, // mouse click locations
  updateTimeIndex,
  updateFrequencyIndex, // <- derive from button?
  //
  updateDepthMinIndex, // indices determining the indices of view bounds for leaflet
  updateDepthMaxIndex,
  updateDepthArray,
  updateTimeMinIndex,
  updateTimeMaxIndex,
  updateTimeArray,
  //
  updateColorIndex,
  //
  updateColorMaps,
  // updateColorMapButtonIndex, // TODO: get rid of
  updateAnnotation,
  updateAnnotationColor,
  //
  updateAnnotationAI,
  // TODO: colorMap
  updateFrequencies,
  updateLatitude,
  updateLongitude,
  //
  updateGeospatialIndex,
  //
  updateTime,
  updateDepth,
  updateBottom,
  updateSv,
  updateSpeed,
  updateDistance,
} = storeSlice.actions;

export default storeSlice.reducer;

export const selectStoreAttributes = (state: RootState) => state.store.storeAttributes;
export const selectStoreShape = (state: RootState) => state.store.storeShape;

export const selectShowInfoPanel = (state: RootState) => state.store.showInfoPanel;

export const selectShip = (state: RootState) => state.store.ship;
export const selectCruise = (state: RootState) => state.store.cruise;
export const selectSensor = (state: RootState) => state.store.sensor;

export const selectShipHovered = (state: RootState) => state.store.shipHovered;
export const selectCruiseHovered = (state: RootState) => state.store.cruiseHovered;
export const selectSensorHovered = (state: RootState) => state.store.sensorHovered;

export const selectSvMin = (state: RootState) => state.store.svMin;
export const selectSvMax = (state: RootState) => state.store.svMax;

export const selectColorMaps = (state: RootState) => state.store.colorMaps;
// export const selectColorMapButtonIndex = (state: RootState) => state.store.colorMapButtonIndex;
export const selectAnnotation = (state: RootState) => state.store.annotation;
export const selectAnnotationColor = (state: RootState) => state.store.annotationColor;

export const selectAnnotationAI = (state: RootState) => state.store.annotationAI;

// store the indices of the clicked position
export const selectDepthIndex = (state: RootState) => state.store.depthIndex;
export const selectTimeIndex = (state: RootState) => state.store.timeIndex; // url timeIndex jump to
export const selectFrequencyIndex = (state: RootState) => state.store.frequencyIndex;

export const selectDepthMinIndex = (state: RootState) => state.store.depthMinIndex; // use to query depth array
export const selectDepthMaxIndex = (state: RootState) => state.store.depthMaxIndex;
export const selectDepthArray = (state: RootState) => state.store.depthArray; // wip
export const selectTimeMinIndex = (state: RootState) => state.store.timeMinIndex;
export const selectTimeMaxIndex = (state: RootState) => state.store.timeMaxIndex;
export const selectTimeArray = (state: RootState) => state.store.timeArray;

export const selectColorIndex = (state: RootState) => state.store.colorIndex;

// export const selectAttributes = (state: RootState) => state.store.attributes; // TODO: remove
export const selectFrequencies = (state: RootState) => state.store.frequencies;
// export const selectFrequencyButtonIndex = (state: RootState) => state.store.frequencyButtonIndex;
export const selectLatitude = (state: RootState) => state.store.latitude;
export const selectLatitudeStatus = (state: RootState) => state.store.latitudeStatus;
export const selectLongitude = (state: RootState) => state.store.longitude;
export const selectLongitudeStatus = (state: RootState) => state.store.longitudeStatus;
//
export const selectGeospatialIndex = (state: RootState) => state.store.geospatialIndex;
export const selectGeospatialIndexStatus = (state: RootState) => state.store.geospatialIndexStatus;
//
export const selectTime = (state: RootState) => state.store.time;
export const selectDepth = (state: RootState) => state.store.depth;
export const selectBottom = (state: RootState) => state.store.bottom;
export const selectSv = (state: RootState) => state.store.sv;
export const selectSpeed = (state: RootState) => state.store.speed;
export const selectDistance = (state: RootState) => state.store.distance;

// Just getting metadata from the store
export const storeAttributesAsync = createAsyncThunk(
  // https://redux.js.org/tutorials/essentials/part-5-async-logic#checking-async-thunk-conditions
  "store/fetchStoreAttributes",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchStoreAttributes(ship, cruise, sensor);
    return response;
  },
  // {
  //   condition(arg, thunkApi) {
  //     const postsStatus = selectStoreAttributes(thunkApi.getState())
  //     if (postsStatus !== 'idle') {
  //       return false
  //     }
  //   }
  // }
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
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }, thunkAPI) => {
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

export const geospatialIndexAsync = createAsyncThunk( // for geohash lookup
  "store/fetchGeospatialIndex",
  async ({ ship, cruise, sensor, longitude, latitude }: { ship: string, cruise: string, sensor: string, longitude: number, latitude: number }) => {
    console.log('getting index...');
    // debugger;
    const response =  await fetchGeospatialIndex(ship, cruise, sensor, longitude, latitude)
      
    return response;
  },
)

export const timeAsync = createAsyncThunk(
  "store/fetchTime",
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }) => {
    const response = await fetchTime(ship, cruise, sensor, indexTime);
    return response;
  },
)

export const timeArrayAsync = createAsyncThunk( // Fetches subset of the time array
  "store/fetchTimeArray",
  async ({ ship, cruise, sensor, indexStart, indexEnd }: { ship: string, cruise: string, sensor: string, indexStart: number, indexEnd: number }) => {
    const response = await fetchTimeArray(ship, cruise, sensor, indexStart, indexEnd);
    return response.data;
  },
)

export const depthAsync = createAsyncThunk(
  "store/fetchDepth",
  async ({ ship, cruise, sensor, indexDepth }: { ship: string, cruise: string, sensor: string, indexDepth: number }) => {
    const response = await fetchDepth(ship, cruise, sensor, indexDepth);
    return Math.round(response * 1e2) / 1e2;
  },
)

export const depthArrayAsync = createAsyncThunk( // Fetches the full depth array
  "store/fetchDepthArray",
  async ({ ship, cruise, sensor }: { ship: string, cruise: string, sensor: string }) => {
    const response = await fetchDepthArray(ship, cruise, sensor);
    return response.data; // Float32Array
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
    const response = await fetchSv(ship, cruise, sensor, indexDepth, indexTime);
    return [...response.data].map((x: number) => Number(Math.round(x * 1e2) / 1e2))
  },
)

export const speedAsync = createAsyncThunk(
  "store/fetchSpeed",
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }) => {
    const response = await fetchSpeed(ship, cruise, sensor, indexTime);
    // debugger;
    return response; // TODO: do I round?
  },
)

export const distanceAsync = createAsyncThunk(
  "store/fetchDistance",
  async ({ ship, cruise, sensor, indexTime }: { ship: string, cruise: string, sensor: string, indexTime: number }) => {
    const response = await fetchDistance(ship, cruise, sensor, indexTime);
    // debugger;
    return response;  // TODO: do I round?
  },
)