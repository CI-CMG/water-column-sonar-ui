import { createSlice } from '@reduxjs/toolkit';

export const zarrSlice = createSlice({
  name: 'zarr',

  initialState: {
    value: [],
  },

  reducers: {
    writeTime: (state, action) => {
      state.value = action.payload;
    },
  },

});

export const { writeZarr } = zarrSlice.actions;

export default zarrSlice.reducer;
