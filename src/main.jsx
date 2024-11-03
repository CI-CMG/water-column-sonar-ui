import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import { Leva } from 'leva'

import App from "./App.jsx";
import { setupStore } from './store.js';
import './assets/css/Main.scss';
// import "./index.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = setupStore();

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Leva collapsed />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

