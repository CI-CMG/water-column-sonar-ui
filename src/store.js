import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from './services/api.js';
import summaryReducer from './reducers/summarySlice.js';

const rootReducer = combineReducers({

  summary: summaryReducer, // SummaryView

  [api.reducerPath]: api.reducer,
});

// export type RootState = ReturnType<typeof rootReducer>;
// export type RootState = ReturnType<typeof rootReducer>;

export const setupStore = () => configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    api.middleware,
  ]),
});

// export type AppStore = ReturnType<typeof setupStore>;
// export type AppDispatch = AppStore['dispatch'];
