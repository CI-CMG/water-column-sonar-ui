import { useEffect, useRef } from "react";
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
// import {
//   HTTPStore, openArray, // ZarrArray, slice,
// } from 'zarr';
import {
  openArray,
  HTTPStore,
  ZarrArray,
  // slice,
  NestedArray,
  // slice
} from 'zarr';

const zarrBaseURL="https://noaa-wcsd-zarr-pds.s3.us-east-1.amazonaws.com"
const shipName="Henry_B._Bigelow"
const cruiseName="HB0706"
const sensorName="EK60"

let timeArray = ZarrArray;

// https://github.com/CI-CMG/echofish-aws-ui/blob/master/src/main/frontend/src/views/view/echofish/cruise/Echogram.vue
function load() {
  // const store = new HTTPStore(`${ZARR_BASE_URL}/level_2/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`);
  // const depthPromise = openArray({ store, path: 'depth', mode: 'r' });
  // const timePromise = openArray({ store, path: 'time', mode: 'r' });
  // const latitudePromise = openArray({ store, path: 'latitude', mode: 'r' });
  // const longitudePromise = openArray({ store, path: 'longitude', mode: 'r' });
  // const svPromise = openArray({ store, path: 'Sv', mode: 'r' });

  // Promise.all([
  //   depthPromise,
  //   timePromise,
  //   latitudePromise,
  //   longitudePromise,
  //   svPromise,
  // ]).then(([depthArray1, timeArray1, latitudeArray1, longitudeArray1, svArray1]) => {
  //   depthArray.value = depthArray1;
  //   timeArray.value = timeArray1;
  //   latitudeArray.value = latitudeArray1;
  //   longitudeArray.value = longitudeArray1;
  //   svArray.value = svArray1;
  // }).then(() => {
  //   // drawTiles();
  //   // const latlon = new LatLng(0, storeIndex.value);
  //   // svMarker.value = latlon;
  // }).then(() => {
  //   // moveend();
  // });

  // const binaryData = Int32Array.from([0,1,2,3,4,5]);
  // const n = new NestedArray(binaryData, [2, 3]);

  // console.log(n);

  const store = new HTTPStore(`${zarrBaseURL}/level_2/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`);
  // const depthPromise = openArray({ store, path: 'depth', mode: 'r' });
  const timePromise = openArray({ store, path: 'time', mode: 'r' });
  // const latitudePromise = openArray({ store, path: 'latitude', mode: 'r' });
  // const longitudePromise = openArray({ store, path: 'longitude', mode: 'r' });
  // const svPromise = openArray({ store, path: 'Sv', mode: 'r' });

  // let timeArray = new Array();

  Promise.all([
    // depthPromise,
    timePromise,
    // latitudePromise,
    // longitudePromise,
    // svPromise,
  ]).then(([tA]) => {
    // depthArray.value = dA;
    timeArray = tA;
    // latitudeArray.value = laA;
    // longitudeArray.value = loA;
  });
  // .then(() => {
  //   console.log('loaded promise')
  //   console.log(timeArray['value']['length'])
  // });
}

// https://guido.io/zarr.js/#/installation
export default function ZarrView() {
  useEffect(() => {
    document.title = `Zarr Data`;
    load();
  }, []);

  const refContainer = useRef(null);
  const { search } = useLocation();
  const values = queryString.parse(search)


  useEffect(() => {
    // load();
    console.log("Loading Zarr View...")
    console.log(timeArray.length)
  }, [timeArray]);

  return (
    <div className="ZarrView">
      {/* <p>ship: {values.ship}, cruise: {values.cruise}</p> */}
      <h1>Zarr View</h1>
      <p>testing 123</p>
    </div>
  );
}
