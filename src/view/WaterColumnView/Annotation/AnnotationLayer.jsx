import { useEffect, useState } from "react";
import {
  Rectangle,
  Tooltip,
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
  selectParquetData,
} from "../../../reducers/store/storeSlice.ts";

/*
From blog.echo.fish, working on filtering times
df_select = df[(df["time_end"] >= np.datetime64("2019-09-26T05:00:00.000000")) & (df["time_start"] <= np.datetime64("2019-09-26T05:20:00.000000"))]
df[(df["time_end"] >= np.datetime64("2019-09-26T05:00:00.000000")) & (df["time_start"] <= np.datetime64("2019-09-26T05:20:00.000000"))]
goto: https://hyperparam.app/?preview
*/
// File Size: 3.9 MB
// const url = "https://github.com/CI-CMG/water-column-sonar-annotation/releases/download/v26.1.0/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet";
// const parquet_url = "https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/pmtiles/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet";

// reference: https://github.com/CI-CMG/water-column-sonar-ui/blob/5c27612f375fa5a6819410a5f80d42410ecf9f45/src/view/WaterColumnView/WaterColumnVisualization.jsx

// const all_rectangles = [
//  [[-564, 2187169], [-591, 2187178]],
//  [[-574, 2187877], [-602, 2187893]],
// ]

// const rectangleItems = all_rectangles.map((rectangle, i) =>
//   <Rectangle
//     bounds={rectangle}
//     key={i}
//     opacity={0.75}
//     fillColor="white"
//     fillOpacity={0.10}
//     weight={2}
//     title="Annotation"
//     className="Annotation"
//     pathOptions={{ color: '#FF69B4' }}
//   >
//     <Tooltip>AH_School</Tooltip>
//   </Rectangle>
// )

export default function AnnotationLayer() {
  const dispatch = useAppDispatch();
  const timeMinValue = useAppSelector(selectTimeMinValue); // for drawing leaflet polygons
  const timeMaxValue = useAppSelector(selectTimeMaxValue);
  const parquetData = useAppSelector(selectParquetData);
  // const [rectangles, setRectangles] = useState(rectangleItems);
  // const [map, setMap] = useState(null);

  // useEffect(() => {
  //   if (map) {
  //     map.eachLayer((x) => {
  //       if (x.options.className === "Annotation") {
  //         x.setStyle({
  //           color: annotationColor,
  //         });
  //       }
  //     });
  //   }
  // }, [map]);

  useEffect(() => {
    if (timeMinValue !== null && timeMaxValue !== null) {
      const startTime = new Date(new Date(timeMinValue / 1000000).toISOString());
      const endTime = new Date(new Date(timeMaxValue / 1000000).toISOString());
      dispatch(parquetDataAsync({ startTime, endTime }));
    }
  }, [timeMinValue, timeMaxValue, dispatch]);

  return (
    <div className="AnnotationLayer">
      { parquetData !== null ? (
        parquetData.classifications?.map((classification, i) => {
          return (<p key={i}>{classification}</p>)
        })
      ) : (
        <></>
      )}
    </div>
  );
}

// {/* <>{rectangleItems}</>
//           <Polygon pathOptions={limeOptions} positions={polygon} /> */}
