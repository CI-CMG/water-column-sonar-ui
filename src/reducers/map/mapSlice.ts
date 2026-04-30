import type { PayloadAction } from "@reduxjs/toolkit"
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.js";
import {
  fetchGeospatialIndex,
} from "../store/storeAPI.js";

// For variables related to the main map view

export interface MapState {
  
  shipHovered: string | null,
  cruiseHovered: string | null,
  sensorHovered: string | null,

  geospatialIndex: number | null,
  geospatialIndexStatus: "idle" | "loading" | "failed",
}

const initialState: MapState = {

  shipHovered: null,
  cruiseHovered: null,
  sensorHovered: null,

  geospatialIndex: null,
  geospatialIndexStatus: "idle",
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
    //
    updateGeospatialIndex: (state, action: PayloadAction<any>) => {
      state.geospatialIndex = action.payload;
    },
  },

  extraReducers: builder => {
    builder
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
      });
  },
});

export const {
  
  updateShipHovered,
  updateCruiseHovered,
  updateSensorHovered,
  updateGeospatialIndex,
} = mapSlice.actions;

export default mapSlice.reducer;

export const selectShipHovered = (state: RootState) => state.map.shipHovered;
export const selectCruiseHovered = (state: RootState) => state.map.cruiseHovered;
export const selectSensorHovered = (state: RootState) => state.map.sensorHovered;

export const selectGeospatialIndex = (state: RootState) => state.map.geospatialIndex;
export const selectGeospatialIndexStatus = (state: RootState) => state.map.geospatialIndexStatus;

export const geospatialIndexAsync = createAsyncThunk( // for geohash lookup
  "store/fetchGeospatialIndex",
  async ({ ship, cruise, sensor, longitude, latitude }: { ship: string, cruise: string, sensor: string, longitude: number, latitude: number }) => {
    const response =  await fetchGeospatialIndex(ship, cruise, sensor, longitude, latitude)
      
    return response;
  },
)