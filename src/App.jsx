import {
  Route,
  Routes,
} from 'react-router-dom';
import LayoutView from './view/LayoutView/LayoutView';
import MapView from './view/MapView/MapView';
import WaterColumnView from './view/WaterColumnView/WaterColumnView';
import DatasetView from './view/DatasetView/DatasetView';
import CatalogView from './view/CatalogView/CatalogView';
import AboutView from './view/AboutView/AboutView';
import ErrorView from './view/ErrorView/ErrorView';
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <div className="AppView">
      <Routes>
        <Route path="/" element={<LayoutView />}>
          <Route index element={<MapView />} />

          <Route path="water-column" element={<WaterColumnView />} />

          <Route path="dataset" element={<DatasetView />} />

          <Route path="catalog" element={<CatalogView />} />

          <Route path="about" element={<AboutView />} />

          <Route path="*" element={<ErrorView />} />

        </Route>
      </Routes>
    </div>
  );
}
