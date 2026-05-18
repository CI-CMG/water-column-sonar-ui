import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store.js";

// For variables related to the knowledge graph view
//  and the respective search interface

export interface GraphState {

  searchClassification: string,
  searchPhaseOfDay: string,
  searchAltitude: number[],
  searchDistanceFromCoastline: number[],
  page: number,
}

const initialState: GraphState = {

  searchClassification: "AH_School",
  searchPhaseOfDay: "dawn",
  searchAltitude: [-497, 395],
  searchDistanceFromCoastline: [42, 157942],
  page: 0,
}

export const graphSlice = createSlice({
  name: "graph",
  
  initialState,
  
  reducers: {

    updateSearchClassification: (state, action: PayloadAction<string>) => {
      // state.page = 0; // changes to any params sets pagination back to zero
      state.searchClassification = action.payload
    },
    updateSearchPhaseOfDay: (state, action: PayloadAction<string>) => {
      // state.page = 0;
      state.searchPhaseOfDay = action.payload
    },
    updateSearchAltitude: (state, action: PayloadAction<number[]>) => {
      // state.page = 0;
      state.searchAltitude = action.payload
    },
    updateSearchDistanceFromCoastline: (state, action: PayloadAction<number[]>) => {
      // state.page = 0;
      state.searchDistanceFromCoastline = action.payload
    },
    updateSearchPage: (state, action: PayloadAction<number>) => {
      // debugger;
      state.page = action.payload;
    },
  },

  extraReducers: builder => {},
});

export const {

  updateSearchClassification,
  updateSearchPhaseOfDay,
  updateSearchAltitude,
  updateSearchDistanceFromCoastline,
  updateSearchPage,
} = graphSlice.actions;

export default graphSlice.reducer;


export const selectSearchClassification = (state: RootState) => state.graph.searchClassification;
export const selectSearchPhaseOfDay = (state: RootState) => state.graph.searchPhaseOfDay;
export const selectSearchAltitude = (state: RootState) => state.graph.searchAltitude;
export const selectSearchDistanceFromCoastline = (state: RootState) => state.graph.searchDistanceFromCoastline;
export const selectSearchPage = (state: RootState) => state.graph.searchPage;
