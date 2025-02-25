import {
  Route,
  Routes,
} from 'react-router-dom';
import LayoutView from './view/LayoutView/LayoutView';
import MapView from './view/MapView/MapView';
import WaterColumnView from './view/WaterColumnView/WaterColumnView';
import DatasetView from './view/DatasetView/DatasetView';
import AboutView from './view/AboutView/AboutView';
// import ZarrView from './view/ZarrView/ZarrView';
import ErrorView from './view/ErrorView/ErrorView';
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <div className="AppView">
      <Routes>
        <Route path="/" element={<LayoutView />}>
          <Route index element={<MapView />} />

          <Route path="/water-column" element={<WaterColumnView />} />

          <Route path="/dataset" element={<DatasetView />} />

          <Route path="/about" element={<AboutView />} />

          {/* <Route path="/zarr" element={<ZarrView />} /> */}

          <Route path="*" element={<ErrorView />} />

        </Route>
      </Routes>
    </div>
  );
}
