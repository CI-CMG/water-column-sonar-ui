import {
  useEffect,
  // useRef,
  // useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSearchParams } from 'react-router';
// import { useLeafletContext } from '@react-leaflet/core';
import {
  MapContainer,
  // LayersControl,
  // LayerGroup,
  // Circle,
  // Marker,
  // Popup,
} from "react-leaflet";
import {
  useMapEvents,
  // useMap,
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
  selectFrequencyIndex,
  selectStoreAttributes,
  selectStoreShape,
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
  ////
  updateDepthIndex,
  updateTimeIndex,
  updateFrequencyIndex,
} from "../../reducers/store/storeSlice";


/* -------- Main View of Water Column Page ---------- */
export default function WaterColumnView() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams(); // from searchparams update redux
  // const { layerContainer } = useLeafletContext();
  
  function LocationMarker() {
    const dispatch = useAppDispatch();
  
    useMapEvents({
      click(e) {
        const newTimeIndex = parseInt(e.latlng.lng, 10);
        const newDepthIndex = parseInt(e.latlng.lat * -1.0, 10);
        console.log(`newTimeIndex: ${newTimeIndex}, newDepthIndex: ${newDepthIndex}`);
        dispatch(updateTimeIndex(newTimeIndex));
        dispatch(updateDepthIndex(newDepthIndex));

        // And update mouse locations
        setSearchParams(
          (prev) => {
            prev.set('time', newTimeIndex);
            return prev;
          },
        );
      },
    })

    return null;
  }


  const initialTimeIndex = Number(searchParams.get('time'));
  const initialFrequencyIndex = Number(searchParams.get('frequency'));

  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const indexDepth = useAppSelector(selectDepthIndex);
  const timeIndex = useAppSelector(selectTimeIndex); // we are opening the page for the first time
  const frequencyIndex = useAppSelector(selectFrequencyIndex);

  useEffect(() => { // initialize query parameters:
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
    if(timeIndex === null) {
      // console.log(`intialTimeIndex: ${initialTimeIndex}`);
      dispatch(updateTimeIndex(initialTimeIndex));
    }
    if(frequencyIndex === null) {
      dispatch(updateFrequencyIndex(initialFrequencyIndex));
    }
    
    if(ship !== null && cruise !== null && sensor !== null) {
      dispatch(storeAttributesAsync({ ship, cruise, sensor })); // don't need to update each time
      dispatch(storeShapeAsync({ ship, cruise, sensor }));
      dispatch(frequenciesAsync({ ship, cruise, sensor })); // don't need to update each time
    }
  }, [dispatch, searchParams, ship, cruise, sensor, timeIndex, initialTimeIndex, initialFrequencyIndex, frequencyIndex]);

  useEffect(() => { // make async requests for all infomation panel values
    if(ship && cruise && sensor && frequencyIndex !== null) {
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
        indexFrequency: frequencyIndex,
      }));
    }
  }, [dispatch, searchParams, ship, cruise, sensor, frequencyIndex]);

  const mapCenterX = initialTimeIndex;
  const mapCenterY = -1 * (window.innerHeight / 2) + 60;
  const mapCenter = [mapCenterY, mapCenterX];
  const margin = 400; // map maxBounds + margin

  return (
    <div className="WaterColumnView">
      {
        (storeShape !== null && attributes !== null && frequencyIndex !== null) ?
          <MapContainer
            crs={CRS.Simple}
            zoom={0}
            center={mapCenter}
            minZoom={0}
            maxZoom={0}
            zoomControl={false}
            tileSize={attributes.tile_size}
            className="Map"
            maxBounds={[
              [-1 * Math.ceil(storeShape[0]/attributes.tile_size)*attributes.tile_size - margin, 0 - margin], // bottomLeft?
              [0 + margin, storeShape[1] + margin], // topRight?
            ]}
          >
            <CustomLayer  />

            <LocationMarker />
          </MapContainer>
        :
          <></>
      }
      
      <InformationPanel />
    </div>
  );
}