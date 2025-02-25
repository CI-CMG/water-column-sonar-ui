import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from "react";
import { Leva } from 'leva'

import App from "./App.jsx";
import { setupStore } from './store.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/Main.scss';

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
