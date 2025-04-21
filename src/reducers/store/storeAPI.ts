import { cruiseSlice } from './../cruise/cruiseSlice';
import * as zarr from "zarrita";
import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita
import { slice } from "zarrita";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectShip,
    selectCruise,
    selectSensor,
  } from "../cruise/cruiseSlice";
  
// const bucketName = "noaa-wcsd-zarr-pds";
// const ship = useAppSelector(selectShip);
// const cruise = useAppSelector(selectCruise);
// const sensor = useAppSelector(selectSensor);
// const ship = "Henry_B._Bigelow";
// const cruise = "HB0707";
// const sensor = "EK60";

// A mock function to mimic making an async request for data
//export const fetchCount = (amount = 1): Promise<{ data: number }> =>
//    new Promise<{ data: number }>(resolve =>
//      setTimeout(() => {
//        resolve({ data: amount })
//      }, 2000),
//    )

export const fetchStore = (ship: string, cruise: string, sensor: string): Promise<any> => {
    const bucketName = "noaa-wcsd-zarr-pds";
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;

    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            return zarr.open.v2(storePromise, { kind: "group" });
        })
}

// todo; pass in url params
export const fetchFrequencies = (ship: string, cruise: string, sensor: string) => {

    const bucketName = "noaa-wcsd-zarr-pds";
    const url = `https://${bucketName}.s3.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr/`;
    return zarr.withConsolidated(new zarr.FetchStore(url))
        .then((storePromise) => {
            return zarr.open.v2(storePromise, { kind: "group" });
        })
        .then((rootPromise) => {
            return zarr.open(rootPromise.resolve("frequency"), { kind: "array" });
        })
        .then((frequencyArray) => {
            // this gets all the data in a BigUint64Array
            const frequencies = get(frequencyArray, [slice(null)]);
            return frequencies;
        });
}

// https://zarrita.dev/cookbook
// let store = await zarr.withConsolidated(new zarr.FetchStore(url));
// let root = await zarr.open.v2(store, { kind: "group" });
// let calibration_status = root.attrs.calibration_status
// console.log(calibration_status)

// export const fetchTime = () => zarr.open(root.resolve("time"), { kind: "array" });
// export const fetchFrequency = await zarr.open(root.resolve("frequency"), { kind: "array" });
// export const fetchDepth = await zarr.open(root.resolve("depth"), { kind: "array" });
// export const fetchLatitude = await zarr.open(root.resolve("latitude"), { kind: "array" });
// export const fetchLongitude = await zarr.open(root.resolve("longitude"), { kind: "array" });
// export const fetchSv = await zarr.open(root.resolve("Sv"), { kind: "array" });
// TODO: add bottom and speed
  