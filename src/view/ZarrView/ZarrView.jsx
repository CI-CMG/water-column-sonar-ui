// import { Line } from '@react-three/drei';
// import { point } from '@turf/turf';
import { useEffect, useState } from 'react';
import {
  openArray,
  slice,
} from 'zarr';
import * as turf from '@turf/turf'

// const zarrBaseURL="https://noaa-wcsd-zarr-pds.s3.us-east-1.amazonaws.com"
const shipName="Henry_B._Bigelow"
const cruiseName="HB0706" // HB1304 3,573,052 samples
const sensorName="EK60"
const bucketName="noaa-wcsd-zarr-pds"
const zarrStoreUrl = (shipName, cruiseName, sensorName) => {
  return `https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`
}

function clickedMarkerPolyline(clickedPoint, clickedLinestring) {
  console.log(clickedPoint)
  console.log(clickedLinestring)
  // console.log("clicked polyline at: lat: " + e.latlng.lat + ", lng: " + e.latlng.lng)

  // let pt = clickedPoint // turf.point([e.latlng.lng, e.latlng.lat])
  let snapped = turf.nearestPointOnLine(
      clickedLinestring, // longitude, latitude
      clickedPoint,
      // { units: 'miles' }
      { units: 'kilometers' }
  )
  console.log('closest polyline index: ' + snapped.properties.index)

  /////// now do it with the full linestring  /////
  // let aa = Array.from(this.latitudeArrayData);
  // let bb = Array.from(this.longitudeArrayData);
  // let cc = aa.map(function(e, i) {
  //   return [bb[i], e];
  // });
  // let turf_linestring = turf.lineString(cc)
  // // why do i do this twice
  // let snapped2 = turf.nearestPointOnLine(
  //     turf_linestring, // longitude, latitude
  //     pt,
  //     { units: 'miles' }
  // )
  // this.clicked_index = snapped2.properties.index
  // const clicked_time = Array.from(this.timeArrayData)[snapped2.properties.index]
  // const clicked_latitude = Array.from(this.latitudeArrayData)[snapped2.properties.index]
  // const clicked_longitude = Array.from(this.longitudeArrayData)[snapped2.properties.index]
  // const tz = find(clicked_latitude, clicked_longitude)
  // const local_time = this.getDateTime(clicked_time, tz)
  // this.click_time = local_time._i + ' ' + local_time._z.name.toUpperCase()
  // console.log('closest polyline index full res: ' + snapped2.properties.index)
}

// https://github.com/CI-CMG/echofish-aws-ui/blob/master/src/main/frontend/src/views/view/echofish/cruise/Echogram.vue
export default function ZarrView() {
  const [error, setError] = useState(null);
  // const [timeData, setTimeData] = useState(null);
  const [latitudeData, setLatitudeData] = useState(null);
  const [longitudeData, setLongitudeData] = useState(null);
  const [clickedLinestring, setClickedLinestring] = useState(null);
  // lngLat: Pc {lng: -55.50282629333897, lat: 45.86529038585317}
  const [clickedPoint, setClickedPoint] = useState(turf.point([-55.50282, 45.86529])); // turf.point([-77.037076, 38.884017])

  // const timeArray = (shipName, cruiseName, sensorName) => openArray({store: zarrStoreUrl(shipName, cruiseName, sensorName), path: "time", mode: "r"});
  const latitudeArray = (shipName, cruiseName, sensorName) => openArray({store: zarrStoreUrl(shipName, cruiseName, sensorName), path: "latitude", mode: "r"});
  const longitudeArray = (shipName, cruiseName, sensorName) => openArray({store: zarrStoreUrl(shipName, cruiseName, sensorName), path: "longitude", mode: "r"});

  useEffect(() => {
    document.title = `Zarr Data`;

    Promise
      .all([
        // timeArray(shipName, cruiseName, sensorName),
        latitudeArray(shipName, cruiseName, sensorName),
        longitudeArray(shipName, cruiseName, sensorName)
      ])
      .then(([latitudeStore, longitudeStore]) => {
        // timeStore.get([slice(null)]).then((d) => {
        //   setTimeData(d.data); // 246,847 timestamps
        // });
        latitudeStore.get([slice(null)]).then((d) => {
          setLatitudeData(d.data);
        });
        longitudeStore.get([slice(null)]).then((d) => {
          setLongitudeData(d.data);
        });

        // zips linestring together from lat/lon
        let aa = Array.from(latitudeData);
        let bb = Array.from(longitudeData);
        let cc = aa.map(function(e, i) {
          return [bb[i], e];
        });
        setClickedLinestring(turf.lineString(cc))

        clickedMarkerPolyline(clickedPoint, clickedLinestring)
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [latitudeData, longitudeData]);

  // useEffect(() => {
  //   let aa = Array.from(latitudeData);
  //   let bb = Array.from(longitudeData);
  //   let cc = aa.map(function(e, i) {
  //     return [bb[i], e];
  //   });
  //   setTurfLinestring(turf.lineString(cc))
  // }, [latitudeData, longitudeData])

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
          <p>latitude[0]: {latitudeData[0]}</p>
          <p>longitude[0]: {longitudeData[0]}</p>
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
