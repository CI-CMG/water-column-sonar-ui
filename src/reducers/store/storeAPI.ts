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
            const frequencies = get(frequencyArray, [slice(null)]); // TODO: specify "slice(null)" as param
            return frequencies;
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
            const latitude = get(latitudeArray, [indexTime]);
            return latitude;
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
            const longitude = get(longitudeArray, [indexTime]);
            return longitude;
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
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const longitudeArray = zarr.open(rootPromise.resolve("longitude"), { kind: "array" });
            return longitudeArray; // TODO: don't need to create consts here...
        })
        .then((longitudeArray) => {
            return get(longitudeArray, [slice(null)]); // returns all the data!
        });
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
            const time = get(timeArray, [indexTime]);
            return time;
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
            const depth = get(depthArray, [indexDepth]);
            return depth;
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
            const bottom = get(bottomArray, [indexTime]);
            return bottom;
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
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            const svArray = zarr.open(rootPromise.resolve("Sv"), { kind: "array" });
            return svArray;
        })
        .then((svArray) => {
            // returns all the data in a BigUint64Array
            // const sv = get(svArray, [indexDepth, indexTime, indexFrequency]);
            const sv = get(svArray, [indexDepth, indexTime, slice(null)]); // TODO: get index of frequency
            // TODO: get the following
            // svArray.chunks = [512, 512, 1]
            // svArray.dtype = 'float32'
            // svArray.shape = [2538, 4_228_924, 4] ==> now write to 
            // return [sv, svArray.chunks, svArray.shape];
            return sv;
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