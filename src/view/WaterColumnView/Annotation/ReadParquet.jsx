import { useEffect } from "react";
import { asyncBufferFromUrl, parquetReadObjects } from "hyparquet";
import { compressors } from "hyparquet-compressors";

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
const url = "https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/pmtiles/Henry_B._Bigelow_HB1906_neo4j_with_geometry.parquet";
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
const file = await asyncBufferFromUrl({ url }); // wrap url for async fetching

async function GetSelectGeometries(rowStart, rowEnd) {
  const data = await parquetReadObjects({
    file,
    compressors,
    columns: ['x', 'y'],
    rowStart: rowStart,
    rowEnd: rowEnd,
  });

  return data;
}

async function GetData(select_columns = ['time_start', 'time_end']) {
  const data = await parquetReadObjects({
    file,
    compressors,
    columns: select_columns,
  });

  return data;
}

function ReadParquetFile() {
  const start_time = new Date("2019-09-26T05:00:00.000000" + "Z"); // NOTE: requires 'Z'
  // const end_time = new Date("2019-09-26T05:20:00.000000" + "Z");
  const end_time = new Date("2019-09-26T23:10:00.000000" + "Z");

  useEffect(() => {
    GetData()
      .then((d) => {
        const time_starts = d.map((x) => x.time_start);
        const time_ends = d.map((x) => x.time_end);

        // TODO: get all start times
        let matches_starts = time_starts.map((v, i) => (v.getTime() < end_time.getTime()) ? i : -1).filter(v => v > -1);
        let matches_ends = time_ends.map((v, i) => (v.getTime() > start_time.getTime()) ? i : -1).filter(v => v > -1);        
        // console.log(matches_starts.length);
        // console.log(matches_ends.length);
        const overlapping_indices = matches_starts.filter(x => matches_ends.includes(x));
        
        const rowStart = overlapping_indices[-1]
        const rowEnd = overlapping_indices[overlapping_indices.length -1]

        // get intersection of two
        GetSelectGeometries(rowStart, rowEnd)
          .then((d) => {
            // At this point 'd' has all the geometries in the viewport
            console.log(d.length);
          }).catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="ReadFile">
      <p>Reading parquet file...</p>
    </div>
  );
}

export default ReadParquetFile;
