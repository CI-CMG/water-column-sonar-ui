// import { useEffect } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import {
  CRS,
} from "leaflet";
import {
  HTTPStore, openArray, // ZarrArray, slice,
} from 'zarr';

const bucketName = "noaa-wcsd-zarr-pds";
const shipName = "Henry_B._Bigelow"
const cruiseName = "HB0707"
const sensorName = "EK60"


const zarrStoreUrl = (shipName, cruiseName, sensorName) => {
  return `https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`;
};


function load() {
  const store = new HTTPStore(zarrStoreUrl);
  const depthPromise = openArray({ store, path: 'depth', mode: 'r' });
  const timePromise = openArray({ store, path: 'time', mode: 'r' });
  const latitudePromise = openArray({ store, path: 'latitude', mode: 'r' });
  const longitudePromise = openArray({ store, path: 'longitude', mode: 'r' });
  const svPromise = openArray({ store, path: 'Sv', mode: 'r' });

  Promise.all([
    depthPromise,
    timePromise,
    latitudePromise,
    longitudePromise,
    svPromise,
  ]).then(([depthArray1, timeArray1, latitudeArray1, longitudeArray1, svArray1]) => {
    depthArray.value = depthArray1;
    timeArray.value = timeArray1;
    latitudeArray.value = latitudeArray1;
    longitudeArray.value = longitudeArray1;
    svArray.value = svArray1;
  }).then(() => {
    drawTiles();
    const latlon = new LatLng(0, storeIndex.value);
  }).then(() => {
    moveend();
  });
}


const mapOptions = {
  crs: CRS.Simple,
  zoom: 0,
  center:  [0, 0],
  minZoom: 0,
  maxZoom: 0,
  zoomControl: false,
};

// http://localhost:5173/water-column?ship=Henry_B._Bigelow&cruise=HB0706
export default function WaterColumnView() {

  const { search } = useLocation();
  const values = queryString.parse(search);

  // useEffect(() => {
  //   console.log("this");
  // }, []);

  return (
    <div className="WaterColumnView">
      <p>ship: {values.ship}, cruise: {values.cruise}, sensor: {values.sensor}, index: {values.index}</p>
      <MapContainer
        {...mapOptions}
        style={{ height: "500px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}
