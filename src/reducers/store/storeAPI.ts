import {
  point,
  lineString,
} from "@turf/helpers";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import * as zarr from "zarrita";
import { get } from "@zarrita/ndarray";
import { slice } from "zarrita";

// TODO: move somewhere else?
const bucketName = "noaa-wcsd-zarr-pds";
const level = "level_2";

/* --- Zarr Store --- */
export const fetchStoreAttributes = (ship: string, cruise: string, sensor: string): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            return rootPromise.attrs;
        });
}

/* --- Zarr Store --- */
export const fetchStoreShape = (ship: string, cruise: string, sensor: string): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const svArray = zarr.open(rootPromise.resolve("Sv"), { kind: "array" });
            return svArray;
        })
        .then((svArray) => {
            // Gathers info about the store
            // svArray.chunks = [512, 512, 1]
            // svArray.dtype = 'float32'
            // svArray.shape = [2538, 4_228_924, 4] ==> now write to 
            return svArray.shape;
        });
}

/* --- FREQUENCY --- */
export const fetchFrequencies = (ship: string, cruise: string, sensor: string) => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            // note: 'rootPromise.attrs' has all the attributes, 
            const frequencyArray = zarr.open(rootPromise.resolve("frequency"), { kind: "array" });
            return frequencyArray;
        })
        .then((frequencyArray) => {
            // returns all the data in a BigUint64Array
            return get(frequencyArray, [slice(null)]); // TODO: specify "slice(null)" as param
        });
}

/* --- LATITUDE --- */
// export const fetchLatitude = (ship: string, cruise: string, sensor: string, index: number ): Promise<number>  => {
export const fetchLatitude = (ship: string, cruise: string, sensor: string, indexTime: number ): any => {    
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const latitudeArray = zarr.open(rootPromise.resolve("latitude"), { kind: "array" });
            return latitudeArray;
        })
        .then((latitudeArray) => {
            // returns all the data in a BigUint64Array
            return get(latitudeArray, [indexTime]);
        });
}

/* --- LONGITUDE --- */
export const fetchLongitude = (ship: string, cruise: string, sensor: string, indexTime: number ): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const longitudeArray = zarr.open(rootPromise.resolve("longitude"), { kind: "array" });
            return longitudeArray;
        })
        .then((longitudeArray) => {
            // returns all the data in a BigUint64Array
            return get(longitudeArray, [indexTime]);
        });
}

/* --- LATITUDE All — for ping-time lookup --- */
export const fetchLatitudeAll = (ship: string, cruise: string, sensor: string ): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;    
    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const latitudeArray = zarr.open(rootPromise.resolve("latitude"), { kind: "array" });
            return latitudeArray;
        })
        .then((latitudeArray) => {
            return get(latitudeArray, [slice(null)]); // returns all the data!
        });
}

/* --- LONGITUDE All — for ping-time lookup --- */
export const fetchLongitudeAll = (ship: string, cruise: string, sensor: string ): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;    
    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            return zarr.open.v2(storePromise, { kind: "group" });
        })
        .then((rootPromise) => {
            return zarr.open(rootPromise.resolve("longitude"), { kind: "array" });
        })
        .then((longitudeArray) => {
            return get(longitudeArray, [slice(null)]); // returns all the data!
        });
}

/* --- LNG/LAT All — for Geospatial lookup --- */
export const fetchGeospatialIndex = (
    ship: string,
    cruise: string,
    sensor: string,
    longitude: number,
    latitude: number,
): any => {
    // const ship = "Henry_B._Bigelow"; // TODO: fix this
    // const cruise = cruise;
    // const sensor = "EK60";
    console.log(`s:${ship},c:${cruise},i:${sensor}`);
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    const clickedPoint = point([longitude, latitude]);
    
    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            return zarr.open.v2(storePromise, { kind: "group" });
        })
        .then((rootPromise) => {
            return Promise.all([
                zarr.open(rootPromise.resolve("longitude"), { kind: "array" }),
                zarr.open(rootPromise.resolve("latitude"), { kind: "array" }),
            ])
        })
        .then(([longitudeArray, latitudeArray]) => {
            return Promise.all([
                get(longitudeArray, [slice(null)]),
                get(latitudeArray, [slice(null)]),
            ])
        }).then(([longitudeData, latitudeData]) => {
            let aa = Array.from(latitudeData.data);
            let bb = Array.from(longitudeData.data);

            const dataJoined = aa.map((e, i) => {
                const bbNoise = bb[i] + (Math.random()/10000);
                return [bbNoise, e];
            })
            // Note: redundant points will cause problems, fixed with noise
            const clickedLinestring = lineString(dataJoined);
            let snapped = nearestPointOnLine(clickedLinestring, clickedPoint);
            return snapped.properties.index;
        })
}

/* --- TIME --- */
export const fetchTime = (ship: string, cruise: string, sensor: string, indexTime: number ) => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const timeArray = zarr.open(rootPromise.resolve("time"), { kind: "array" });
            return timeArray;
        })
        .then((timeArray) => {
            // returns all the data in a BigUint64Array
            return get(timeArray, [indexTime]);
        });
}

/* --- TIME ARRAY --- */
export const fetchTimeArray = (ship: string, cruise: string, sensor: string, indexStart: number, indexEnd: number ): any => {
    // console.log(`fetching timeArray: ${indexStart}, ${indexEnd}`)
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const timeArray = zarr.open(rootPromise.resolve("time"), { kind: "array" });
            return timeArray;
        })
        .then((timeArray) => {
            const max_indices = timeArray.shape[0];
            // Limit query to the bounds o
            return get(timeArray, [
                    slice(
                        Math.max(indexStart, 0),
                        Math.min(indexEnd, max_indices),
                    )
                ]
            );
        });
}

/* --- DEPTH --- */
export const fetchDepth = ( ship: string, cruise: string, sensor: string, indexDepth: number ): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const depthArray = zarr.open(rootPromise.resolve("depth"), { kind: "array" });
            return depthArray;
        })
        .then((depthArray) => {
            // returns all the data in a BigUint64Array
            return get(depthArray, [indexDepth]);
        });
}

/* --- DEPTH ARRAY --- */
export const fetchDepthArray = (
    ship: string,
    cruise: string,
    sensor: string,
    // indexStart: number,
    // indexEnd: number,
): any => {
    // console.log(`fetching: depthArray`)
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            return zarr.open.v2(storePromise, { kind: "group" });
        })
        .then((rootPromise) => {
            return zarr.open(rootPromise.resolve("depth"), { kind: "array" });
        })
        .then((depthArray) => {
            // returns all the data in a BigUint64Array
            return get(depthArray, [slice(null)]); // , [slice(indexStart, indexEnd)]);
        });
}

/* --- BOTTOM --- */
export const fetchBottom = (ship: string, cruise: string, sensor: string, indexTime: number ): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const bottomArray = zarr.open(rootPromise.resolve("bottom"), { kind: "array" });
            return bottomArray;
        })
        .then((bottomArray) => {
            // returns all the data in a BigUint64Array
            return get(bottomArray, [indexTime]);
        });
}

/* --- SV — gets a slice across all frequencies --- */
export const fetchSv = (
    ship: string,
    cruise: string,
    sensor: string,
    indexDepth: number,
    indexTime: number,
    indexFrequency: number, // TODO: remove this
): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            return zarr.open.v2(storePromise, { kind: "group" });
        })
        .then((rootPromise) => {
            const svArray = zarr.open(rootPromise.resolve("Sv"), { kind: "array" });
            return svArray;
        })
        .then((svArray) => {
            // returns all the data in a BigUint64Array
            // const sv = get(svArray, [indexDepth, indexTime, indexFrequency]);
            return get(svArray, [indexDepth, indexTime, slice(null)]); // TODO: get index of frequency
            // TODO: get the following
            // svArray.chunks = [512, 512, 1]
            // svArray.dtype = 'float32'
            // svArray.shape = [2538, 4_228_924, 4] ==> now write to 
            // return [sv, svArray.chunks, svArray.shape];
        });
}

/* --- SV TILE — gets data for drawing tiles --- */
export const fetchSvTile = (
    ship: string,
    cruise: string,
    sensor: string,
    indicesTop: number,
    indicesBottom: number,
    indicesLeft: number,
    indicesRight: number,
    selectedFrequency: number,
): any => {
    const url = `https://${bucketName}.s3.amazonaws.com/${level}/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            return zarr.open.v2(storePromise, { kind: "group" });
        })
        .then((rootPromise) => {
            return zarr.open(rootPromise.resolve("Sv"), { kind: "array" });
        })
        .then((svArray) => {
            return get(svArray, [slice(indicesTop, indicesBottom), slice(indicesLeft, indicesRight), selectedFrequency]);
        });
}