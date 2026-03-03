import { useEffect } from "react";
import {
  // Rectangle,
  // Tooltip,
  // Polygon,
} from "react-leaflet";
import {
  selectAnnotation,
  // selectTimeMinValue,
  // selectTimeMaxValue,
} from "../../../reducers/store/storeSlice.ts";
// import { GetDateTime } from "../GetDateTime.jsx";
// import ReadParquetData from "./ReadParquetData.jsx";
import { useAppSelector, useAppDispatch } from "../../../app/hooks.ts";
import { parquetDataAsync } from "../../../reducers/store/storeSlice";
import {
  selectTimeMinValue,
  selectTimeMaxValue,
} from "../../../reducers/store/storeSlice.ts";

/*
From blog.echo.fish, working on filtering times
df_select = df[(df["time_end"] >= np.datetime64("2019-09-26T05:00:00.000000")) & (df["time_start"] <= np.datetime64("2019-09-26T05:20:00.000000"))]

start_time = "2019-09-26T05:00:00.000000"
end_time = "2019-09-26T05:20:00.000000"

df[(df["time_end"] >= np.datetime64("2019-09-26T05:00:00.000000")) & (df["time_start"] <= np.datetime64("2019-09-26T05:20:00.000000"))]

TO view parquet file:
goto: https://hyperparam.app/?preview
and drag and drop file
*/

// File Size: 3.9 MB
// const url = "https://github.com/CI-CMG/water-column-sonar-annotation/releases/download/v26.1.0/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet";
// const parquet_url = "https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/pmtiles/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet";
// const all_columns = [
  // "geometry_hash",
  // "classification",
  // "point_count",
  // "time_start",
  // "time_end",
  // "depth_min",
  // "depth_max",
  // "month",
  // "altitude",
  // "latitude",
  // "longitude",
  // "local_time",
  // "distance_from_coastline",
  // "solar_altitude",
  // "filename",
  // "region_id",
  // "ship",
  // "cruise",
  // "instrument",
  // "phase_of_day",
  // "x",
  // "y",
// ];
// const file = await asyncBufferFromUrl({ parquet_url }); // wrap url for async fetching


// const rectangles = [
//   [
//     [-120, 3965719],
//     [-235, 3967091],
//   [
//     [-50, 4009524],
//     [-80, 4009534],
//   ],
// ];

// const rectangleItems = rectangles.map((rectangle, i) => (
//   <Rectangle
//     bounds={rectangle}
//     key={rectangle}
//     opacity={0.75}
//     fillColor="white"
//     fillOpacity={0.2}
//     // weight={3}
//     title="Annotation"
//     className="Annotation"
//     pathOptions={{ color: "#FF69B4", weight: 2 }}
//   >
//     <Tooltip direction="bottom" opacity={0.65}>
//       AH_School {i}
//       <br />
//       d20191016_t121103-t233917_Zsc-DWBA-Schools_All-RegionDefs.evr
//     </Tooltip>
//   </Rectangle>
// ));

// const polygon = [
//   [-120, 3965719],
//   [-100, 3965729],
//   [-110, 3965739],
//   [-60, 3965749],
//   [-120, 3965759],
// ];
// const limeOptions = { color: "lime" };

export default function AnnotationLayer() {
  const dispatch = useAppDispatch();
  const annotation = useAppSelector(selectAnnotation);
  
  const startTime = new Date("2019-09-26T05:00:00.000000" + "Z"); // NOTE: requires 'Z'
  const endTime = new Date("2019-09-26T23:10:00.000000" + "Z");
  
  const timeMinValue = useAppSelector(selectTimeMinValue); // for drawing leaflet polygons
  const timeMaxValue = useAppSelector(selectTimeMaxValue);

  useEffect(() => {
    // console.log(`${startTime}, ${endTime}`);
    // console.log(`${timeMinValue}, ${timeMaxValue}`);
    dispatch(parquetDataAsync({ startTime, endTime, selectColumns: ['time_start', 'time_end'] }));
  }, [timeMinValue, timeMaxValue])

  return (
    <div className="AnnotationLayer">
      {/* <p className="text-end" style={{ color: "grey" }}>
        min: {GetDateTime(timeMinValue)}
        <br />
        max: {GetDateTime(timeMaxValue)}
      </p> */}

      {annotation ? (
        <>
          <p>{`${timeMinValue}, ${timeMaxValue}`}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

// {/* <>{rectangleItems}</>
//           <Polygon pathOptions={limeOptions} positions={polygon} /> */}
