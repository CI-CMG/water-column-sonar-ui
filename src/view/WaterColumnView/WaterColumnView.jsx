import {
  useEffect,
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
  useMapEvents
} from 'react-leaflet/hooks'
import { CRS } from "leaflet";
import CustomLayer from "./CustomLayer";
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
  selectStoreAttributes,
  //
  storeAttributesAsync,
  storeShapeAsync,
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


/* -------- Main View of Water Column Page ---------- */
export default function WaterColumnView() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams(); // from searchparams update redux

  const ship = useAppSelector(selectShip); //  get from redux
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  const attributes = useAppSelector(selectStoreAttributes);

  const indexDepth = useAppSelector(selectDepthIndex);
  const timeIndex = useAppSelector(selectTimeIndex);

  useEffect(() => {
    // Write out the query parameters:
    // /water-column?ship=Henry_B._Bigelow&cruise=HB1906&sensor=EK60&frequency=0&color=2&time=1024
    if(ship === null){
      dispatch(updateShip(searchParams.get('ship'))); // store in redux
    }
    if(cruise === null){
      dispatch(updateCruise(searchParams.get('cruise')));
    }
    if(sensor === null) {
      dispatch(updateSensor(searchParams.get('sensor')));
    }
    if(timeIndex === 0) { // can this create problems?
      dispatch(updateTimeIndex(Number(searchParams.get('time'))));
    }

    if(ship !== null && cruise !== null && sensor !== null) {
      dispatch(storeAttributesAsync({ ship, cruise, sensor })); // don't need to update each time
      dispatch(storeShapeAsync({ ship, cruise, sensor }));
      dispatch(frequenciesAsync({ ship, cruise, sensor })); // don't need to update each time
    }
  }, [dispatch, searchParams, ship, cruise, sensor, timeIndex]); // TODO: update on click

  useEffect(() => {
    if(ship !== null && cruise !== null && sensor !== null) {
      dispatch(latitudeAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(longitudeAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(timeAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(depthAsync({ ship, cruise, sensor, indexDepth: indexDepth }));
      dispatch(bottomAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(svAsync({
        ship,
        cruise,
        sensor,
        indexDepth: indexDepth, // TODO: wire this up to mouse click
        indexTime: timeIndex,
        indexFrequency: 0 // TODO: remove this param
      }));
    }
  }, [dispatch, searchParams, ship, cruise, sensor, indexDepth, timeIndex]); // TODO: update on click

  const mapRef = useRef(null);

  const MapEvents = () => { // on mouse click print coordinates
    useMapEvents({
      click(e) {
        const newTimeIndex = parseInt(e.latlng.lng, 10);
        dispatch(updateTimeIndex(newTimeIndex));
        // And update mouse locations
        setSearchParams(
          (prev) => {
            prev.set('time', newTimeIndex);
            return prev;
          },
          // { preventScrollReset: true }
        );
        //
        dispatch(updateDepthIndex(parseInt(e.latlng.lat * -1.0, 10)));

        // const center = map.getCenter();
        // console.log('map x center: ', center.lng); // TODO: write for the mini map viewer
      },
    });

    return null;
  }

  const mapParameters = {
    crs: CRS.Simple,
    zoom: 0,
    center: [-1 * (window.innerHeight / 2) + 60, (window.innerWidth / 2) - 20], // TODO: needs to accept "center" ping time index
    minZoom: 0,
    maxZoom: 0, // TODO: add two more levels of zoom
    zoomControl: false,
    tileSize: 512, // TODO: get from store... see custom layer
  };
  

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
                center={[-1, 1]}
                pathOptions={{ color: '#D1FFBD', fillColor: 'white' }}
                radius={10}
                stroke={true}
              />
            </LayerGroup>
            <>
              {
              (attributes !== null)
              ?
              <CustomLayer  /> : <></>
              }
            </>
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