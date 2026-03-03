import { point, lineString } from "@turf/helpers";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import * as zarr from "zarrita";
import { get } from "@zarrita/ndarray"; // TODO: get rid of ndarray, it's old
import { slice } from "zarrita";
//
import { useEffect } from "react";
import { asyncBufferFromUrl, parquetReadObjects } from "hyparquet";
import { compressors } from "hyparquet-compressors";

// TODO: move somewhere else?
const bucketName = "noaa-wcsd-zarr-pds";
// const level = "level_2";

// paths to alex's ai ml results
const aiBucketName = "noaa-wcsd-zarr-ai-pds";
const aiLevel = "level_4";
const aiVariableName = "sonar_clusters";
const level = "level_2a";

/* --- ATTRIBUTES --- */
export const fetchStoreAttributes = (
  ship: string,
  cruise: string,
  sensor: string
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root, { kind: "group" }).then((rootPromise) => {
    return rootPromise.attrs;
  });
};

/* --- SV SHAPE --- */
export const fetchStoreShape = (
  ship: string,
  cruise: string,
  sensor: string
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("Sv"), { kind: "array" }).then((arr) => {
    return arr.shape;
  });
};

/* --- FREQUENCY --- */
export const fetchFrequencies = (
  ship: string,
  cruise: string,
  sensor: string
) => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve("frequency"), { kind: "array" })
    .then((arr) => {
      return get(arr, [slice(null)]);
    });
};

/* --- LATITUDE --- */
export const fetchLatitude = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve("latitude"), { kind: "array" })
    .then((arr) => {
      return get(arr, [indexTime]);
    });
};

/* --- LONGITUDE --- */
export const fetchLongitude = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve("longitude"), { kind: "array" })
    .then((arr) => {
      return get(arr, [indexTime]);
    });
};

// TODO: can I delete these?!
/* --- LATITUDE All — for ping-time lookup --- */
export const fetchLatitudeAll = (
  ship: string,
  cruise: string,
  sensor: string
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve("latitude"), { kind: "array" })
    .then((arr) => {
      return get(arr, [slice(null)]);
    });
};

/* --- LONGITUDE All — for ping-time lookup --- */
export const fetchLongitudeAll = (
  ship: string,
  cruise: string,
  sensor: string
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve("longitude"), { kind: "array" })
    .then((arr) => {
      return get(arr, [slice(null)]);
    });
};

/* --- LNG/LAT All — for Geospatial lookup --- */
export const fetchGeospatialIndex = (
  ship: string,
  cruise: string,
  sensor: string,
  longitude: number,
  latitude: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));
  const clickedPoint = point([longitude, latitude]);

  return Promise.all([
    zarr.open.v3(root.resolve("longitude"), { kind: "array" }),
    zarr.open.v3(root.resolve("latitude"), { kind: "array" }),
  ])
  .then((values) => {
    return Promise.all([
      get(values[0], [slice(null)]),
      get(values[1], [slice(null)]),
    ]);
  })
  .then(([longitudeData, latitudeData]) => {
    let aa = Array.from(latitudeData.data);
    let bb = Array.from(longitudeData.data);

    const dataJoined = aa.map((e, i) => {
      const bbNoise = bb[i] + Math.random() / 10000;
      return [bbNoise, e];
    });
    // Note: redundant points will cause problems, fixed with noise
    const clickedLinestring = lineString(dataJoined);
    let snapped = nearestPointOnLine(clickedLinestring, clickedPoint);
    return snapped.properties.index;
  });
};

/* --- TIME --- */
export const fetchTime = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
) => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("time"), { kind: "array" }).then((arr) => {
    return get(arr, [indexTime]);
  });
};

/* --- MIN MAX TIME for Leaflet Plot --- */
export const fetchTimeMinValue = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
) => { // TODO: type as number in nanoseconds
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("time"), { kind: "array" }).then((arr) => {
    if (!arr.is("number")) {
      throw Error("data type not supported!");
    }
    return get(arr, [indexTime]);
  });
};

export const fetchTimeMaxValue = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
) => { // TODO: type as number in nanoseconds
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("time"), { kind: "array" }).then((arr) => {
    if (!arr.is("number")) {
      throw Error("data type not supported!");
    }
    return get(arr, [indexTime]);
  });
};

/* --- TIME ARRAY --- */
export const fetchTimeArray = (
  ship: string,
  cruise: string,
  sensor: string,
  indexStart: number,
  indexEnd: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve("time"), { kind: "array" })
    .then((timeArray) => {
      // Limit query to the bounds //
      const max_indices = timeArray.shape[0];

      return get(timeArray, [
        slice(Math.max(indexStart, 0), Math.min(indexEnd, max_indices)),
      ]);
    });
};

/* --- DEPTH INDEXED --- */
export const fetchDepth = (
  ship: string,
  cruise: string,
  sensor: string,
  indexDepth: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("depth"), { kind: "array" }).then((arr) => {
    return get(arr, [indexDepth]);
  });
};

/* --- DEPTH ARRAY --- */
export const fetchDepthArray = (
  ship: string,
  cruise: string,
  sensor: string
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("depth"), { kind: "array" }).then((arr) => {
    return get(arr, [slice(null)]);
  });
};

/* --- BOTTOM --- */
export const fetchBottom = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("bottom"), { kind: "array" }).then((arr) => {
    return get(arr, [indexTime]);
  });
};

/* --- SV — gets a slice across all frequencies --- */
export const fetchSv = (
  ship: string,
  cruise: string,
  sensor: string,
  indexDepth: number,
  indexTime: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("Sv"), { kind: "array" }).then((arr) => {
    return get(arr, [indexDepth, indexTime, slice(null)]);
  });
};

/* --- SPEED --- */
export const fetchSpeed = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("speed"), { kind: "array" }).then((arr) => {
    return get(arr, [indexTime]);
  });
};

/* --- DISTANCE --- */
export const fetchDistance = (
  ship: string,
  cruise: string,
  sensor: string,
  indexTime: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve("distance"), { kind: "array" })
    .then((arr) => {
      return get(arr, [indexTime]);
    });
};

/* --- SV TILE — Gets Data for Drawing Each Tile --- */
export const fetchSvTile = (
  ship: string,
  cruise: string,
  sensor: string,
  indicesTop: number,
  indicesBottom: number,
  indicesLeft: number,
  indicesRight: number,
  selectedFrequency: number
): any => {
  const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v3(root.resolve("Sv"), { kind: "array" }).then((arr) => {
    return get(arr, [
      slice(indicesTop, indicesBottom),
      slice(indicesLeft, indicesRight),
      selectedFrequency,
    ]);
  });
};

/* ----------------------------------------------------*/
/* ---------------------ALEXs Results------------------*/
/* ----------------------------------------------------*/

/* --- AI Zarr Store --- */
export const fetchAIStoreAttributes = (
  ship: string,
  cruise: string,
  sensor: string
): any => {
  const url = `https://${aiBucketName}.s3.amazonaws.com/${aiLevel}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open.v2(root, { kind: "group" }).then((arr) => {
    return arr.attrs;
  });
};

/* --- AI Zarr Store --- */
export const fetchAIStoreShape = (
  ship: string,
  cruise: string,
  sensor: string
): any => {
  const url = `https://${aiBucketName}.s3.amazonaws.com/${aiLevel}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v2(root.resolve(aiVariableName), { kind: "array" })
    .then((arr) => {
      return arr.shape;
    });
};

/* --- AI SV TILE — gets data for drawing tiles --- */
export const fetchAISvTile = (
  ship: string,
  cruise: string,
  sensor: string,
  indicesTop: number,
  indicesBottom: number,
  indicesLeft: number,
  indicesRight: number,
  selectedFrequency: number
): any => {
  const url = `https://${aiBucketName}.s3.amazonaws.com/${aiLevel}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
  const root = zarr.root(new zarr.FetchStore(url));

  return zarr.open
    .v3(root.resolve(aiVariableName), { kind: "array" })
    .then((arr) => {
      return get(arr, [
        slice(indicesTop, indicesBottom),
        slice(indicesLeft, indicesRight),
        selectedFrequency,
      ]);
    });
};

/* ----------------------------------------------------*/
/* ---------------------PARQUET DATA-------------------*/
/* ----------------------------------------------------*/
// const all_columns = ["geometry_hash", "classification", "point_count", "time_start", "time_end", "depth_min", "depth_max", "month", "altitude", "latitude", "longitude", "local_time", "distance_from_coastline", "solar_altitude", "filename", "region_id", "ship", "cruise", "instrument", "phase_of_day", "x", "y",];
const parquetFile = await asyncBufferFromUrl({
  // url: "https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/pmtiles/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet"
  url: "https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/parquet/Henry_B._Bigelow_HB1906_geometry_26_3_2.parquet"
});

export const GetSelectGeometries = (rowStart: number, rowEnd: number): any => {
  return parquetReadObjects({
    file: parquetFile,
    compressors: compressors,
    columns: ['x_index', 'y_index'],
    rowStart: rowStart,
    rowEnd: rowEnd,
  }).then((d) => {
    debugger;
    return d;
  });
}

// const start_time = new Date("2019-09-26T05:00:00.000000" + "Z");
// const end_time = new Date("2019-09-26T23:10:00.000000" + "Z");
export const fetchParquetData = (startTime: Date, endTime: Date, selectColumns=['time_start', 'time_end']) => {
  return parquetReadObjects({
    file: parquetFile,
    compressors: compressors,
    columns: selectColumns,
  }).then((d) => {
        const time_starts = d.map((x) => x.time_start);
        const time_ends = d.map((x) => x.time_end);

        let matches_starts = time_starts.map((v, i) => (v.getTime() < endTime.getTime()) ? i : -1).filter(v => v > -1);
        let matches_ends = time_ends.map((v, i) => (v.getTime() > startTime.getTime()) ? i : -1).filter(v => v > -1);        
        const overlapping_indices = matches_starts.filter(x => matches_ends.includes(x));
        
        const rowStart = overlapping_indices[0]
        const rowEnd = overlapping_indices[overlapping_indices.length -1]

        // get intersection of two
        return GetSelectGeometries(rowStart, rowEnd)
          .then((d: any) => {
            // TODO: write to x_index and y_index vertices
            return d[0];
          }).catch((error: any) => console.error(error));
      })
      .catch((error) => console.error(error));

  // return data;
}


// export const fetchParquetData = (
//   ship: string,
//   cruise: string,
//   sensor: string,
//   indexStart: number,
//   indexEnd: number
// ): any => {
//   const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
//   const root = zarr.root(new zarr.FetchStore(url));

//   return zarr.open
//     .v3(root.resolve("time"), { kind: "array" })
//     .then((timeArray) => {
//       // Limit query to the bounds //
//       const max_indices = timeArray.shape[0];

//       return get(timeArray, [
//         slice(Math.max(indexStart, 0), Math.min(indexEnd, max_indices)),
//       ]);
//     });
// };

/* ----------------------------------------------------*/
/* ----------------------------------------------------*/
/* ----------------------------------------------------*/
/* ----------------------------------------------------*/
