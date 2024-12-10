import { useEffect, useState } from 'react';
import {
  openArray,
  slice,
} from 'zarr';
import * as turf from '@turf/turf'

// const zarrBaseURL="https://noaa-wcsd-zarr-pds.s3.us-east-1.amazonaws.com"
const bucketName="noaa-wcsd-zarr-pds"
const zarrStoreUrl = (shipName, cruiseName, sensorName) => {
  return `https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`
}

// https://github.com/CI-CMG/echofish-aws-ui/blob/master/src/main/frontend/src/views/view/echofish/cruise/Echogram.vue
export default function ZarrView() {
  const [shipName, setShipName] = useState("Henry_B._Bigelow");
  const [cruiseName, setCruiseName] = useState("HB0902"); // HB1304 3,573,052 samples
  const [sensorName, setSensorName] = useState("EK60");
  const [clickedLinestringIndex, setClickedLinestringIndex] = useState(null);
  const [error, setError] = useState(null);
  const [latitudeData, setLatitudeData] = useState(null);
  const [longitudeData, setLongitudeData] = useState(null);
  
  // lngLat: Pc {lng: -55.50282629333897, lat: 45.86529038585317}
  // const [clickedPoint, setClickedPoint] = useState(turf.point([-55.50282, 45.86529])); // turf.point([-77.037076, 38.884017])
  const [clickedPoint, setClickedPoint] = useState(null); // turf.point([-77.037076, 38.884017])
  const [clickedLinestring, setClickedLinestring] = useState(null);
  

  useEffect(() => {
    const latitudeArray = (shipName, cruiseName, sensorName) => openArray({store: zarrStoreUrl(shipName, cruiseName, sensorName), path: "latitude", mode: "r"});
    const longitudeArray = (shipName, cruiseName, sensorName) => openArray({store: zarrStoreUrl(shipName, cruiseName, sensorName), path: "longitude", mode: "r"});

    Promise
      .all([
        latitudeArray(shipName, cruiseName, sensorName),
        longitudeArray(shipName, cruiseName, sensorName)
      ])
      .then(([latitudeStore, longitudeStore]) => {
        latitudeStore.get([slice(null)]).then((d) => {
          setLatitudeData(d.data);
        });
        longitudeStore.get([slice(null)]).then((d) => {
          setLongitudeData(d.data);
        });
      })
      .catch((error) => {
        console.log(error)
        setError(error.message);
      });
  }, [cruiseName, shipName, sensorName]);

  useEffect(() => {
    if(latitudeData && longitudeData) {
      // setClickedPoint(turf.point([-28, 51]));
      // setClickedPoint(turf.point([-65, 42]));
      setClickedPoint(turf.point([-65, 41]));
      let aa = Array.from(latitudeData);
      let bb = Array.from(longitudeData);
      setClickedLinestring(turf.lineString(aa.map((e, i) => [bb[i], e])));
    }
  }, [latitudeData, longitudeData])

  useEffect(() => {
    if(clickedPoint && clickedLinestring) {
      let snapped = turf.nearestPointOnLine(
          clickedLinestring, // [longitude, latitude]
          clickedPoint,
          { units: 'kilometers' }
      )
      console.log('closest polyline index: ' + snapped.properties.index + ' of ' + latitudeData.length + ' indices.')
    
      setClickedLinestringIndex(snapped.properties.index)
    }
  }, [clickedPoint, clickedLinestring, latitudeData]);

  return (
    <div>
      {error ? (
        <div>Error: {error}</div>
      ) : latitudeData && longitudeData ? (
        <div>
          <h1>Zarr View</h1>
          <p>ship: {shipName}</p>
          <p>cruise: {cruiseName}</p>
          <p>sensor: {sensorName}</p>
          <hr />
          <p>number of samples: {latitudeData.length}</p>
          <p>latitude[0]: {turf.round(latitudeData[0], 5)}</p>
          <p>longitude[0]: {turf.round(longitudeData[0], 5)}</p>
          {clickedLinestring &&
            <p>clicked index: {clickedLinestringIndex}</p>
          }
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

// TODO: next use turf to get the linestring and point
// then calculate index of the closest point on the Line
// then jump to the water column view with the right props
