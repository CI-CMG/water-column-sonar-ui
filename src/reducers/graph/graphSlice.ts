import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.js";

// For variables related to the knowledge graph view
//  search interface

export interface GraphState {

  searchClassification: string,
  searchPhaseOfDay: string,
  searchAltitude: number[],
  searchDistanceFromCoastline: number[],
}

const initialState: GraphState = {

  searchClassification: "AH_School",
  searchPhaseOfDay: "dawn",
  searchAltitude: [-497, 395],
  searchDistanceFromCoastline: [42, 157942],
}

export const graphSlice = createSlice({
  name: "graph",
  
  initialState,
  
  reducers: {

    updateSearchClassification: (state, action: PayloadAction<string>) => {
      state.searchClassification = action.payload
    },
    updateSearchPhaseOfDay: (state, action: PayloadAction<string>) => {
      state.searchPhaseOfDay = action.payload
    },
    updateSearchAltitude: (state, action: PayloadAction<number[]>) => {
      state.searchAltitude = action.payload
    },
    updateSearchDistanceFromCoastline: (state, action: PayloadAction<number[]>) => {
      state.searchDistanceFromCoastline = action.payload
    },
  },

  extraReducers: builder => {},
});

export const {

  updateSearchClassification,
  updateSearchPhaseOfDay,
  updateSearchAltitude,
  updateSearchDistanceFromCoastline,
} = graphSlice.actions;

export default graphSlice.reducer;


export const selectSearchClassification = (state: RootState) => state.graph.searchClassification;
export const selectSearchPhaseOfDay = (state: RootState) => state.graph.searchPhaseOfDay;
export const selectSearchAltitude = (state: RootState) => state.graph.searchAltitude;
export const selectSearchDistanceFromCoastline = (state: RootState) => state.graph.searchDistanceFromCoastline;