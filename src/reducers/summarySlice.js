import { createSlice } from '@reduxjs/toolkit';

export const summarySlice = createSlice({
  name: 'summary',

  initialState: {
    initialLoad: true, // if params present allow page to plot on load

    // holds list of parameters passed via the url
    sat: null,
    inst: null,
    startDate: null,
    period: 'days',
    endDate: null,
    instrumentNames: [],
  },

  reducers: {
    writeSat: (state, action) => {
      state.sat = action.payload;
    },
    writeInst: (state, action) => {
      state.Inst = action.payload;
    },
    writeStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    writePeriod: (state, action) => {
      state.period = action.payload;
    },
    writeEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    writeInstrumentNames: (state, action) => {
      state.instrumentNames = action.payload;
    },
  },
});

export const {
  writeSat,
  writeInst,
  writeStartDate,
  writePeriod,
  writeInstrumentNames,
} = summarySlice.actions;

export default summarySlice.reducer;
