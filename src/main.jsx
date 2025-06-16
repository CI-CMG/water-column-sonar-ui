import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from "react";
import App from "./App.jsx";
import { store } from './app/store.ts';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/css/Main.scss';


const root = ReactDOM.createRoot(document.getElementById('root'));

/* dev branding */
window.console.log.apply(
  console,
  ['%c %c %c CIRES — Marine Geology and Geophysics %c  %c https://github.com/CI-CMG/ %c  %c', 'background: #befbef; padding: 5px 0;', 'background: #befbef; padding:5px 0;', 'color: #befbef; padding: 5px 0;', 'background: #befbef; padding: 5px 0;', 'background:rgb(93, 32, 237); padding: 5px 0;', 'background: #befbef; padding: 5px 0;', 'padding: 5px 0;'],
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
