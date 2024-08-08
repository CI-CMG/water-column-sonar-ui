import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
// import { api } from './services/api.ts';
// import satellitesReducer from './reducers/satellitesSlice';
// import instrumentsReducer from './reducers/instrumentsSlice';
// import monitorReducer from './reducers/monitorSlice';
// import mediaReducer from './reducers/mediaSlice';
// import productCheckReducer from './reducers/productCheckSlice';
// import plotReducer from './reducers/plotSlice';
// import summaryReducer from './reducers/summarySlice';
// import downloadReducer from './reducers/downloadSlice';

const rootReducer = combineReducers({

  // satellites: satellitesReducer, // populated by nav

  // instruments: instrumentsReducer, // populated by nav

  // media: mediaReducer,

  // productCheck: productCheckReducer,

  // monitor: monitorReducer, // MonitorView

  // plot: plotReducer, // PlotView

  // summary: summaryReducer, // SummaryView

  // download: downloadReducer, // DownloadView

  // [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const setupStore = (preloadedState?: PreloadedState<RootState>) => configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    // api.middleware,
  ]),

  preloadedState,
});

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
