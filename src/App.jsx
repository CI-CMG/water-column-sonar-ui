import {
  Route,
  Routes,
} from 'react-router-dom';
import ErrorView from './view/ErrorView/ErrorView';
import HomeView from './view/HomeView/HomeView';
import LayoutView from './view/LayoutView';
import CruiseView from './view/CruiseView/CruiseView';
import MapView from './view/MapView/MapView';
import WaterColumnView2 from './view/WaterColumnView/WaterColumnView2';
// import { useParams } from 'react-router-dom';


export default function App() {
  // let { cruise } = useParams();

  return (
    <div className="AppView">
      <Routes>
        <Route path="/" element={<LayoutView />}>

          <Route index element={<HomeView />} />

          <Route path="/cruises" element={<CruiseView />} />

          <Route path="/map" element={<MapView />} />

          <Route path="/water-column" element={<WaterColumnView2 />} />

          <Route path="*" element={<ErrorView />} />

        </Route>
      </Routes>
    </div>
  );
}
