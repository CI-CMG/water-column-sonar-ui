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
// export const fetchLatitude = (ship: string, cruise: string, sensor: string, index: number ) => {
//     const bucketName = "noaa-wcsd-zarr-pds";
//     const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

//     return zarr.withConsolidated(new zarr.FetchStore(url))
//         .then((storePromise) => {
//             const zarrGroup = zarr.open.v2(storePromise, { kind: "group" });
//             return zarrGroup;
//         })
//         .then((rootPromise) => {
//             const latitudeArray = zarr.open(rootPromise.resolve("latitude"), { kind: "array" });
//             return latitudeArray;
//         })
//         .then((latitudeArray) => {
//             // returns all the data in a BigUint64Array
//             const latitude = get(latitudeArray, [index]); // TODO: specify "slice(null)" as param
//             return latitude;
//         });
// }
/* --- LATITUDE WITH STORE --- */
// export const fetchLatitude = (selectStore: any, index: number ) => {
    
//     return zarr.open(selectStore.resolve("/latitude"), { kind: "array" })
//         .then((latitudeArray) => {
//             const latitude = get(latitudeArray, [index]); // TODO: specify "slice(null)" as param
//             return latitude;
//         });
// }
export const fetchLatitudeArray = (ship: string, cruise: string, sensor: string): Promise<any> => {
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
            return latitudeArray;
        });
}

