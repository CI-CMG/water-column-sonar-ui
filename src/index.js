import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
// import store from './store.ts';
import { setupStore } from './store.ts';

// Custom SCSS Directives
import './assets/css/Main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

const store = setupStore();

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
