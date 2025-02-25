// import { useEffect, useState } from "react";
import { openArray, slice } from "zarr";
import { point, lineString } from "@turf/helpers";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";

// const zarrBaseURL="https://noaa-wcsd-zarr-pds.s3.us-east-1.amazonaws.com"
const bucketName = "noaa-wcsd-zarr-pds";

const zarrStoreUrl = (shipName, cruiseName, sensorName) => {
  return `https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`;
};

async function latitudeArray(shipName, cruiseName, sensorName) {
    const z = await openArray({
      store: zarrStoreUrl(shipName, cruiseName, sensorName),
      path: "latitude",
      mode: "r",
    });
    return await z.get([slice(null)]).then((d) => {
      return d.data;
    });
}

async function longitudeArray(shipName, cruiseName, sensorName) {
    const z = await openArray({
      store: zarrStoreUrl(shipName, cruiseName, sensorName),
      path: "longitude",
      mode: "r",
    });
    // debugger;
    return await z.get([slice(null)]).then((d) => {
      return d.data;
    });
}

// https://github.com/CI-CMG/echofish-aws-ui/blob/master/src/main/frontend/src/views/view/echofish/cruise/Echogram.vue
const GetZarrGeospatialIndex = function (cruise, lng, lat) {
  const clickedPoint = point([lng, lat]);
  console.log(`clicked cruise: ${cruise}`);
  const shipName = "Henry_B._Bigelow";
  const cruiseName = cruise; // HB1304 3,573,052 samples
  const sensorName = "EK60";

  return Promise.all([
    latitudeArray(shipName, cruiseName, sensorName),
    longitudeArray(shipName, cruiseName, sensorName),
  ])
    .then(([latitudeData, longitudeData]) => {
        let aa = Array.from(latitudeData);
        let bb = Array.from(longitudeData);

        const clickedLinestring = lineString(aa.map((e, i) => [bb[i], e]));
        let snapped = nearestPointOnLine(
            clickedLinestring, // [longitude, latitude]
            clickedPoint
        );
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
};

export default GetZarrGeospatialIndex;
