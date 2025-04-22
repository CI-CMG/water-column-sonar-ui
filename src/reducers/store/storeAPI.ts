import * as zarr from "zarrita";
import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita
import { slice } from "zarrita";


/* --- Zarr Store --- */
export const fetchStore = (ship: string, cruise: string, sensor: string): Promise<any> => {
    const bucketName = "noaa-wcsd-zarr-pds";
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            return rootPromise;
        })
}

/* --- FREQUENCY --- */
export const fetchFrequencies = (ship: string, cruise: string, sensor: string) => {
    const bucketName = "noaa-wcsd-zarr-pds";
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
            return zarrGroup;
        })
        .then((rootPromise) => {
            // 'rootPromise.attrs' has all the attributes, 
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
    const bucketName = "noaa-wcsd-zarr-pds";
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
    const bucketName = "noaa-wcsd-zarr-pds";
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

/* --- TIME --- */
export const fetchTime = (ship: string, cruise: string, sensor: string, indexTime: number ) => {
    const bucketName = "noaa-wcsd-zarr-pds";
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
export const fetchDepth = (
    ship: string,
    cruise: string,
    sensor: string,
    indexDepth: number,
): any => {
    const bucketName = "noaa-wcsd-zarr-pds";
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

/* --- SV --- */
export const fetchSv = (
    ship: string,
    cruise: string,
    sensor: string,
    indexDepth: number,
    indexTime: number,
    indexFrequency: number
): any => {
    const bucketName = "noaa-wcsd-zarr-pds";
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
            const sv = get(svArray, [indexDepth, indexTime, slice(null)]);
            return sv;
        });
}
