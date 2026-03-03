// import { useEffect } from "react";
// import { useAppSelector, useAppDispatch } from "../../../app/hooks.ts";
// import { parquetDataAsync } from "../../../reducers/store/storeSlice";
// import {
//   selectTimeMinValue,
//   selectTimeMaxValue,
// } from "../../../reducers/store/storeSlice.ts";


// /*
// From blog.echo.fish, working on filtering times
// df_select = df[(df["time_end"] >= np.datetime64("2019-09-26T05:00:00.000000")) & (df["time_start"] <= np.datetime64("2019-09-26T05:20:00.000000"))]

// start_time = "2019-09-26T05:00:00.000000"
// end_time = "2019-09-26T05:20:00.000000"

// df[(df["time_end"] >= np.datetime64("2019-09-26T05:00:00.000000")) & (df["time_start"] <= np.datetime64("2019-09-26T05:20:00.000000"))]

// TO view parquet file:
// goto: https://hyperparam.app/?preview
// and drag and drop file
// */

// // File Size: 3.9 MB
// // const url = "https://github.com/CI-CMG/water-column-sonar-annotation/releases/download/v26.1.0/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet";
// // const parquet_url = "https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/pmtiles/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet";
// // const all_columns = [
//   // "geometry_hash",
//   // "classification",
//   // "point_count",
//   // "time_start",
//   // "time_end",
//   // "depth_min",
//   // "depth_max",
//   // "month",
//   // "altitude",
//   // "latitude",
//   // "longitude",
//   // "local_time",
//   // "distance_from_coastline",
//   // "solar_altitude",
//   // "filename",
//   // "region_id",
//   // "ship",
//   // "cruise",
//   // "instrument",
//   // "phase_of_day",
//   // "x",
//   // "y",
// // ];
// // const file = await asyncBufferFromUrl({ parquet_url }); // wrap url for async fetching


// function ReadParquetData() {
//   const dispatch = useAppDispatch();
  
//   const startTime = new Date("2019-09-26T05:00:00.000000" + "Z"); // NOTE: requires 'Z'
//   const endTime = new Date("2019-09-26T23:10:00.000000" + "Z");
  
//   const timeMinValue = useAppSelector(selectTimeMinValue); // for drawing leaflet polygons
//   const timeMaxValue = useAppSelector(selectTimeMaxValue);

//   useEffect(() => {
//     console.log(`${timeMinValue}, ${timeMaxValue}`);

//     dispatch(parquetDataAsync({ startTime, endTime, selectColumns: ['time_start', 'time_end'] }));
//   }, [selectTimeMinValue, selectTimeMaxValue])

//   return (
//     <div className="ReadFile">
//       <p>Reading parquet file...</p>
//     </div>
//   );
// }

// export default ReadParquetData;
