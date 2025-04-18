// import { configureStore } from '@reduxjs/toolkit';
// // import clickReducer from './reducers/clickSlice.js';
// // import cruiseReducer from './reducers/cruiseSlice.js';
// // import waterColumnReducer from './reducers/waterColumnSlice.js';
// import counterReducer from './reducers/counterSlice.js';

// // tutorial: https://redux-toolkit.js.org/introduction/why-rtk-is-redux-today

// export const store = configureStore({
//   reducer: {
//     counterReducer,
//     // clicks: clickReducer,
//     // cruise: cruiseReducer,
//     // waterColumn: waterColumnReducer,
//   },
// });

// // console.log(store.getState());
// // store.dispatch({ type: 'counter/increment' })
// // console.log(store.getState());

import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../reducers/counter/counterSlice";
import cruiseReducer from "../reducers/cruise/cruiseSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cruise: cruiseReducer,
  },
})

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
