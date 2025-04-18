import { createSlice } from '@reduxjs/toolkit';

export const waterColumnSlice = createSlice({
  name: 'waterColumn',

  // need to track ship/cruise/sensor/
  initialState: {
    min: -80,
    max: -30 
  },

  reducers: {

    svMinimumReducer(state, action) {
      // Check to see if the reducer cares about this action
      if (action.type === 'svMinimum/increment') {
        // If so, make a copy of `state`
        return {
          ...state,
          // and update the copy with the new value
          min: state.min + 1
        }
      }
      if (action.type === 'svMinimum/decrement') {
        return {
          ...state,
          min: state.min - 1
        }
      }
      return state
    },
    svMaximumReducer(state, action) {
      if (action.type === 'svMaximum/increment') {
        return {
          ...state,
          value: state.value + 1
        }
      }
      if (action.type === 'svMaximum/decrement') {
        return {
          ...state,
          value: state.value - 1
        }
      }
      return state
    }
  },

});

export const { svMinimumReducer, svMaximumReducer } = waterColumnSlice.actions;

export default waterColumnSlice.reducer;
