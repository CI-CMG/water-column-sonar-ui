import {
  point,
  lineString,
} from "@turf/helpers";
// import { cleanCoords } from "@turf/clean-coords";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import {
  fetchLatitudeAll,
  fetchLongitudeAll
} from "../../reducers/store/storeAPI.ts";

// const bucketName = "noaa-wcsd-zarr-pds";
// const level = "level_2"
// const zarrStoreUrl = (shipName, cruiseName, sensorName) => {
//   return `https://${bucketName}.s3.us-east-1.amazonaws.com/${level}/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`;
// };

async function latitudeArray(ship, cruise, sensor) {
  // console.log('async fet latAll');
  return fetchLatitudeAll(ship, cruise, sensor)
    .then((d1) => {
      return d1.data;
    });
}

async function longitudeArray(ship, cruise, sensor) {
  // console.log('async fet lonAll');
  return fetchLongitudeAll(ship, cruise, sensor)
    .then((d1) => {
      return d1.data;
    });
}

// https://github.com/CI-CMG/echofish-aws-ui/blob/master/src/main/frontend/src/views/view/echofish/cruise/Echogram.vue
const GetZarrGeospatialIndex = function (cruise, lng, lat) {
  // MOVING TO storeAPI
  // TODO: add 'ship' and 'sensor' as variables
  const clickedPoint = point([lng, lat]);
  const shipName = "Henry_B._Bigelow"; // TODO: fix this
  const cruiseName = cruise; // HB1304 3,573,052 samples
  const sensorName = "EK60";

  return Promise.all([
    latitudeArray(shipName, cruiseName, sensorName),
    longitudeArray(shipName, cruiseName, sensorName),
  ])
    .then(([latitudeData, longitudeData]) => {
      let aa = Array.from(latitudeData);
      let bb = Array.from(longitudeData);

      const dataJoined = aa.map((e, i) => {
        const bbNoise = bb[i] + (Math.random()/10000);
        return [bbNoise, e];
      })
      // Note: redundant points will cause problems, fixed with noise
      const clickedLinestring = lineString(dataJoined);
      let snapped = nearestPointOnLine(clickedLinestring, clickedPoint);
      console.log(
          "closest polyline index: " +
          snapped.properties.index +
          " of " +
          latitudeData.length +
          " indices."
      );
      return snapped.properties.index;
    })
    .catch((e) => {
      console.log(e);
    });
    //   ).then((clickedIndex) => {
    //     console.log(`got geospatial index: ${clickedIndex}`)
    //     dispatch(updateTimeIndex(clickedIndex));
    //   });
};

export default GetZarrGeospatialIndex;
