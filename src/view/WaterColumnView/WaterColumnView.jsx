import { useEffect, useState, useRef } from "react";
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
import * as zarr from "zarrita";
import CustomLayer from "./CustomLayer";
import InformationPanel from "./InformationPanel";
import {
  updateShip,
  updateCruise,
  updateSensor,
  selectShip,
  selectCruise,
  selectSensor,
} from ".././../reducers/cruise/cruiseSlice.ts";

import {
  storeAsync,
  frequenciesAsync,
  latitudeAsync,
  longitudeAsync,
  timeAsync,
  depthAsync,
  svAsync,
} from "../../reducers/store/storeSlice";


const bucketName = "noaa-wcsd-zarr-pds";

const mapParameters = {
  crs: CRS.Simple,
  zoom: 0,
  center: [0, 0],
  minZoom: 0,
  maxZoom: 0, // TODO: add two more levels of zoom
  zoomControl: false,
  tileSize: 512, // TODO: get from store?
};

// http://localhost:5173/water-column?ship=Henry_B._Bigelow&cruise=HB0706
export default function WaterColumnView() {
  const [searchParams, setSearchParams] = useSearchParams(); // from searchparams update redux

  const dispatch = useAppDispatch();
  dispatch(updateShip(searchParams.get('ship')));
  dispatch(updateCruise(searchParams.get('cruise')));
  dispatch(updateSensor(searchParams.get('sensor')));
  ////// just for prototyping /////////////
  
  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);

  // const count = useAppSelector(selectCount)
  // const status = useAppSelector(selectStatus)
  // const [incrementAmount, setIncrementAmount] = useState("2")
  // const incrementValue = Number(incrementAmount) || 0
  //////                  ///////

  const mapRef = useRef(null);

  const [calibrationStatus, setCalibrationStatus] = useState(null);
  const [processingSoftwareName, setProcessingSoftwareName] = useState(null);
  const [processingSoftwareTime, setProcessingSoftwareTime] = useState(null);
  const [processingSoftwareVersion, setProcessingSoftwareVersion] = useState(null);

  const [depthArray, setDepthArray] = useState(null);
  const [timeArray, setTimeArray] = useState(null);
  const [frequencyArray, setFrequencyArray] = useState(null);
  const [latitudeArray, setLatitudeArray] = useState(null);
  const [longitudeArray, setLongitudeArray] = useState(null);
  const [svArray, setSvArray] = useState(null);

  const [depthIndices, setDepthIndices] = useState(null); // change to depthIndexMax?
  const [timeIndices, setTimeIndices] = useState(null);
  const [frequencyIndices, setFrequencyIndices] = useState(null);
  const [chunkShape, setChunkShape] = useState(null);

  useEffect(() => {
    const indexX = 256;
    const indexY = 128;
    const indexZ = 0;
    dispatch(storeAsync({ ship, cruise, sensor }));
    
    dispatch(frequenciesAsync({ ship, cruise, sensor }));
    
    // dispatch(latitudeAsync({ ship, cruise, sensor, index: index }));
    // const store = useAppSelector(selectStore); // comes from storeSlice
    dispatch(latitudeAsync({ ship, cruise, sensor, indexTime: indexX }));
    dispatch(longitudeAsync({ ship, cruise, sensor, indexTime: indexX }));
    dispatch(timeAsync({ ship, cruise, sensor, indexTime: indexX }));
    dispatch(depthAsync({ ship, cruise, sensor, indexDepth: indexY }));
    dispatch(svAsync({
      ship,
      cruise,
      sensor,
      indexDepth: indexY,
      indexTime: indexX,
      indexFrequency: indexZ
    }));

  }, [dispatch, ship, cruise, sensor]);

  useEffect(() => {
    const storePromise = zarr.withConsolidated(
      new zarr.FetchStore(
        `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`
      )
    );

    storePromise // need to store the time/latitude/longitude/Sv/depth arrays for iterative use
      .then((storePromise) => {
        return zarr.open.v2(storePromise, { kind: "group" });
      })
      .then((rootPromise) => {
        setCalibrationStatus(rootPromise.attrs.calibration_status);
        setProcessingSoftwareName(rootPromise.attrs.processing_software_name);
        setProcessingSoftwareTime(rootPromise.attrs.processing_software_time);
        setProcessingSoftwareVersion(rootPromise.attrs.processing_software_version);

        const depthPromise = zarr.open(rootPromise.resolve("depth"), {
          kind: "array",
        });
        const timePromise = zarr.open(rootPromise.resolve("time"), {
          kind: "array",
        });
        const frequencyPromise = zarr.open(rootPromise.resolve("frequency"), {
          kind: "array",
        });
        const latitudePromise = zarr.open(rootPromise.resolve("latitude"), {
          kind: "array",
        });
        const longitudePromise = zarr.open(rootPromise.resolve("longitude"), {
          kind: "array",
        });
        const svPromise = zarr.open(rootPromise.resolve("Sv"), {
          kind: "array",
        });

        Promise.all([
          depthPromise,
          timePromise,
          frequencyPromise,
          latitudePromise,
          longitudePromise,
          svPromise,
        ]).then(
          ([
            depthArray,
            timeArray,
            frequencyArray,
            latitudeArray,
            longitudeArray,
            svArray,
          ]) => {
            setDepthArray(depthArray);
            setTimeArray(timeArray);
            setFrequencyArray(frequencyArray);
            setLatitudeArray(latitudeArray);
            setLongitudeArray(longitudeArray);
            setSvArray(svArray);
          }
        );
      });

      // TODO: return statement for end of lifecycle
  }, []);

  useEffect(() => {
    if (
      depthArray !== null &&
      timeArray !== null &&
      frequencyArray !== null &&
      latitudeArray !== null &&
      longitudeArray !== null &&
      svArray !== null
    ) {
      const svArrayShape = svArray.shape;
      setDepthIndices(svArrayShape[0]);
      setTimeIndices(svArrayShape[1]);
      setFrequencyIndices(svArrayShape[2]);
      setChunkShape(svArray.chunks);
    }
  }, [
    depthArray,
    timeArray,
    frequencyArray,
    latitudeArray,
    longitudeArray,
    svArray,
  ]);

  const MapEvents = () => { // on mouse click print coordinates
    const map = useMap()
    useMapEvents({
      click(e) {
        console.log(`y: ${e.latlng.lat}, x: ${e.latlng.lng}`);
        const center = map.getCenter();
        console.log('map x center: ', center.lng); // TODO: write for the mini map viewer
      },
    });

    return null;
  }

  return (
    <div className="WaterColumnView">
      {/* <button
        onClick={() => {
          dispatch(incrementAsync(2))
        }}
      ></button> */}
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
            <>
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
            </>
          </LayersControl.Overlay>
        </LayersControl>
        <MapEvents />
      </MapContainer>

      <InformationPanel
        // queryParameters={queryParameters}
        calibrationStatus={calibrationStatus}
        processingSoftwareName={processingSoftwareName}
        processingSoftwareTime={processingSoftwareTime}
        processingSoftwareVersion={processingSoftwareVersion}
        // timeArray={timeArray}
        // latitudeArray={latitudeArray}
        // longitudeArray={longitudeArray}
        // frequencyArray={frequencyArray}
      />
    </div>
  );
}