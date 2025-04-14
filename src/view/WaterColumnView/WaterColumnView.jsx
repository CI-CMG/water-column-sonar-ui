import { useEffect, useState, useRef } from "react";

import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { MapContainer, LayersControl } from "react-leaflet";
import { CRS } from "leaflet";
import * as zarr from "zarrita";
// import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita
import CustomLayer from "./CustomLayer";
import InformationPanel from "./InformationPanel";

const bucketName = "noaa-wcsd-zarr-pds";
// const shipName = "Henry_B._Bigelow";
// const cruiseName = "HB0707";
// const sensorName = "EK60";
// https://www.echo.fish/view/echofish/cruise/David_Starr_Jordan/DS0604/EK60/104377/447/38000
// ?ship=Henry_B._Bigelow&cruise=HB0707&sensor=EK60&x=100&y=200&frequency=38000
// const time_index = 100;

// const zarrStoreUrl = (ship, cruise, sensor) => {
// //   return `https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr`;
//   return "https://noaa-wcsd-zarr-pds.s3.amazonaws.com/level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr/";
// };

const mapParameters = {
  crs: CRS.Simple,
  zoom: 0,
  center: [0, 0],
  minZoom: 0,
  maxZoom: 2,
  zoomControl: false,
  tileSize: 1024, // TODO: get from store?
};

// http://localhost:5173/water-column?ship=Henry_B._Bigelow&cruise=HB0706
export default function WaterColumnView() {
  const mapRef = useRef(null);

  const { search } = useLocation();
  const queryParameters = queryString.parse(search);

  // const [zarrLoaded, setZarrLoaded] = useState(false);

  const [calibrationStatus, setCalibrationStatus] = useState(null);
  const [processingSoftwareName, setProcessingSoftwareName] = useState(null);
  const [processingSoftwareTime, setProcessingSoftwareTime] = useState(null);
  const [processingSoftwareVersion, setProcessingSoftwareVersion] =
    useState(null);

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

  // function loadZarrArrays() {
  //   console.log('______loading zarr arrays______');
  // }

  useEffect(() => {
    const storePromise = zarr.withConsolidated(
      new zarr.FetchStore(
        `https://${bucketName}.s3.amazonaws.com/level_2/${queryParameters.ship}/${queryParameters.cruise}/${queryParameters.sensor}/${queryParameters.cruise}.zarr/`
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

      // return () => {
      //   storePromise.cancel();
      // };
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
      // console.log(depthArray);
      // console.log(timeArray);
      // console.log(frequencyArray);
      // console.log(latitudeArray);
      // // const latitudeSlice = get(latitudePromise, [zarr.slice(2, 4)]);
      // console.log(longitudeArray);
      // console.log(svArray);

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

  return (
    <div className="WaterColumnView">
      <MapContainer
        {...mapParameters}
        className="Map"
        ref={mapRef}
      >
        <LayersControl>
          {/* <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
          <LayersControl.Overlay checked name="Grid Example">
            <>{
              (depthArray !== null &&
              timeArray !== null &&
              frequencyArray !== null &&
              latitudeArray !== null &&
              longitudeArray !== null &&
              svArray !== null)
              ?
              <CustomLayer svArray={svArray} selectedFrequency={1} /> : <></>
            }</>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      <InformationPanel
        queryParameters={queryParameters}
        calibrationStatus={calibrationStatus}
        processingSoftwareName={processingSoftwareName}
        processingSoftwareTime={processingSoftwareTime}
        processingSoftwareVersion={processingSoftwareVersion}
        // TODO: pass in frequency information?
        // frequencyArray={frequencyArray}
      />
    </div>
  );
}
