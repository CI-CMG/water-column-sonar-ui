import {
  React,
} from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';
import ErrorView from './view/ErrorView/ErrorView';
import HomeView from './view/HomeView/HomeView';
import LayoutView from './view/LayoutView';
import MapView from './view/MapView/MapView';
import WaterColumnView from './view/WaterColumnView/WaterColumnView';

export default function App() {
  return (
    <div className="AppView">
      <Routes>
        <Route path="/" element={<LayoutView />}>

          <Route index element={<HomeView />} />

          <Route path="map" element={<MapView />} />

          <Route path="water-column" element={<WaterColumnView />} />

          <Route path="*" element={<ErrorView />} />

        </Route>
      </Routes>
    </div>
  );
}
