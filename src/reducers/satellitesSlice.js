import { createSlice } from '@reduxjs/toolkit';

export const satellitesSlice = createSlice({
  name: 'satellites',

  initialState: {
    value: [],
  },

  reducers: {
    writeSatellites: (state, action) => {
      state.value = action.payload;
    },
  },

});

export const { writeSatellites } = satellitesSlice.actions;

export default satellitesSlice.reducer;
