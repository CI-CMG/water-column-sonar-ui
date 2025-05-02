import {
  useEffect,
  // useState,
  useRef
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSearchParams } from 'react-router';
import {
  MapContainer,
  LayersControl,
  LayerGroup,
  Circle,
} from "react-leaflet";
import {
  useMap,
  useMapEvents
} from 'react-leaflet/hooks'
import { CRS } from "leaflet";
// import * as zarr from "zarrita";
// import CustomLayer from "./CustomLayer";
import InformationPanel from "./InformationPanel";

import {
  updateShip,
  updateCruise,
  updateSensor,
  selectShip,
  selectCruise,
  selectSensor,
  //
  selectDepthIndex,
  selectTimeIndex,
  //
  storeAsync,
  frequenciesAsync,
  latitudeAsync,
  longitudeAsync,
  timeAsync,
  depthAsync,
  bottomAsync,
  svAsync,
  //
  updateDepthIndex,
  updateTimeIndex,
} from "../../reducers/store/storeSlice";


// const bucketName = "noaa-wcsd-zarr-pds";
const mapParameters = {
  crs: CRS.Simple,
  zoom: 0,
  center: [0, 0],
  minZoom: 0,
  maxZoom: 0, // TODO: add two more levels of zoom
  zoomControl: false,
  tileSize: 512, // TODO: get from store?
};

/* -------- Main View of Water Column Page ---------- */
export default function WaterColumnView() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams(); // from searchparams update redux

  const ship = useAppSelector(selectShip); //  get from redux
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);

  const indexDepth = useAppSelector(selectDepthIndex);
  const indexTime = useAppSelector(selectTimeIndex);

  useEffect(() => {
    if(ship === null){
      dispatch(updateShip(searchParams.get('ship'))); // store in redux
    }
    if(cruise === null){
      dispatch(updateCruise(searchParams.get('cruise')));
    }
    if(sensor === null) {
      dispatch(updateSensor(searchParams.get('sensor')));
    }

    if(ship !== null && cruise !== null && sensor !== null) {
      dispatch(storeAsync({ ship, cruise, sensor })); // don't need to update each time
      dispatch(frequenciesAsync({ ship, cruise, sensor })); // don't need to update each time
    }
  }, [dispatch, searchParams, ship, cruise, sensor]); // TODO: update on click

  useEffect(() => {
    if(ship !== null && cruise !== null && sensor !== null) {
      dispatch(latitudeAsync({ ship, cruise, sensor, indexTime: indexTime }));
      dispatch(longitudeAsync({ ship, cruise, sensor, indexTime: indexTime }));
      dispatch(timeAsync({ ship, cruise, sensor, indexTime: indexTime }));
      dispatch(depthAsync({ ship, cruise, sensor, indexDepth: indexDepth }));
      dispatch(bottomAsync({ ship, cruise, sensor, indexTime: indexTime }));
      dispatch(svAsync({
        ship,
        cruise,
        sensor,
        indexDepth: indexDepth, // TODO: wire this up to mouse click
        indexTime: indexTime,
        indexFrequency: 0 // fix
      }));
    }
  }, [dispatch, searchParams, ship, cruise, sensor, indexDepth, indexTime]); // TODO: update on click

  const mapRef = useRef(null);

  const MapEvents = () => { // on mouse click print coordinates
    // const map = useMap()
    useMapEvents({
      click(e) {
        // console.log(`y: ${e.latlng.lat}, x: ${e.latlng.lng}`);
        dispatch(updateTimeIndex(parseInt(e.latlng.lng, 10))); // update mouse locations
        dispatch(updateDepthIndex(parseInt(e.latlng.lat * -1.0, 10)));
        
        // const center = map.getCenter();
        // console.log('map x center: ', center.lng); // TODO: write for the mini map viewer
      },
    });

    return null;
  }

  return (
    <div className="WaterColumnView">
      <MapContainer
        {...mapParameters}
        className="Map"
        ref={mapRef}
      >
        <LayersControl>
          <LayersControl.Overlay checked name="echogram">
            <LayerGroup>
              <Circle
                center={[-128, 128]}
                pathOptions={{ color: 'white', fillColor: 'white' }}
                radius={100}
                stroke={true}
              />
            </LayerGroup>
            {/* <>
              { // TODO: follow this to refresh the layer:
                //  https://react-leaflet.js.org/docs/core-architecture/
                (depthArray !== null &&
                timeArray !== null &&
                frequencyArray !== null &&
                latitudeArray !== null &&
                longitudeArray !== null &&
                svArray !== null)
                ?
                <CustomLayer svArray={svArray} selectedFrequency={Number(searchParams.get('frequency'))} /> : <></>
                // need to pass in the frequencyIndex
              }
            </> */}
          </LayersControl.Overlay>
        </LayersControl>
        <MapEvents />
      </MapContainer>

      <InformationPanel />
    </div>
  );
}