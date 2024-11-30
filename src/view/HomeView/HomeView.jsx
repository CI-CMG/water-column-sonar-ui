import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import Image from "material-ui-image";
// import SpeedDial from "@mui/material/SpeedDial";
// import SpeedDialIcon from "@mui/material/SpeedDialIcon";
// import SpeedDialAction from "@mui/material/SpeedDialAction";
// import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
// import SaveIcon from "@mui/icons-material/Save";
// import PrintIcon from "@mui/icons-material/Print";
// import ShareIcon from "@mui/icons-material/Share";
// import SailingIcon from "@mui/icons-material/Sailing";

import { useGetSatellitesQuery } from "../../services/api.js";
import { Typography } from "@mui/material";
import NOAALogo from "../../../src/assets/images/noaa/noaa.png";

export default function HomeView() {
  console.log(`App Name: ${import.meta.env.VITE_REACT_APP_NAME}, App Version: ${import.meta.env.VITE_REACT_APP_VERSION}`)

  useEffect(() => {
    document.title = `Home`;
  }, []);

  const params = {
    geometry: "-39.85499,13.21980",
    geometryType: "esriGeometryPoint",
    returnGeometry: false,
    returnCatalogItems: false,
    f: "json",
  };
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState("nothing here");
  const [errorMessage, setErrorMessage] = useState("no errors");

  // Call API
  const apiResult = useGetSatellitesQuery(params);

  // Update files data on changed API result
  useEffect(() => {
    if (apiResult.status === "fulfilled") {
      setValue(apiResult.data.value);
    } else if (apiResult.status === "rejected") {
      setErrorMessage("API error");
    }
    setLoading(false);
  }, [apiResult]);

  return (
    <div className="HomeView">

      <Container maxWidth="md">
        <Paper square sx={{ m: 2, p: 2 }} elevation={10}>
          <h1>The Water Column</h1>
          <p>v{import.meta.env.VITE_REACT_APP_VERSION}</p>
          <hr />

          <h2>Henry B. Bigelow</h2>
          <p>The Henry B. Bigelow is a fisheries research vessel that surveys the marine biome, geology and oceanographic conditions along the east coast of the United States.</p>
          <p>The ship surveys fish stocks and conducts habitat assessments.</p>
          
          <br />
          <p>[image of the ship]</p>
          
          <hr />
                    
          <h2>NOAA Open Data Dissemination</h2>
          <p>NOAA curates hundreds of terabytes of water column sonar data. The NOAA Open Data Dissemination (NODD) program provides public access to NOAA's data via AWS S3 bucket access.</p>
          <p>The water column sonar archive includes ~300 TB of echosounder data ready for analysis.</p>
          
          <img src={NOAALogo} width={100} height={100} />

          <br />
          <p>Datasets:</p>
          <br />
          <Button href="https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/" variant="outlined" sx={{ mx: "auto", width: 200 }}>
            Level 0
          </Button>
          <br />
          <br />
          <Button href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/" variant="outlined" sx={{ mx: "auto", width: 200 }}>
            Level 1
          </Button>
          <br />
          <br />
          <Button href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/" variant="outlined" sx={{ mx: "auto", width: 200 }}>
            Level 2
          </Button>
          <br />

          <p>ZarrJS</p>
          <Typography align="center">[ThreeJS graphic of cube]</Typography>
          <hr />

          <h2>Where</h2>
          <p>Publicly available data sets</p>
          <p>[MAP]</p>
          <Button variant="contained">Go to s3 bucket</Button>
          <hr />

          <h2>When</h2>
          <p>2001 to Present</p>
          <p>[bee diagram datasets by size — circles]</p>
          <hr />

          <h2>Why</h2>
          <p>Goal is to evaluate large scale interactions between climate change and the atlantic herring population</p>
          <p>map of population collapse</p>
          <br />
          <p>Global Warming</p>
          <p>co2 plot -- co2 molecule</p>

          <hr />

          <h2>How</h2>
          <p>OSPool</p>
          <Button variant="outlined" sx={{ mx: "auto", width: 200 }}>OSPool</Button>
          <p>This research was done using services provided by the OSG Consortium [1,2,3,4], which is supported by the National Science Foundation awards #2030508 and #1836650.</p>
          <br />

          <p>echopype</p>
          <Button variant="outlined" sx={{ mx: "auto", width: 200 }}>echopype</Button>
          <p>Lee, W., Mayorga, E., Setiawan, L., Majeed, I., Nguyen, K., & Staneva, V. (2021). Echopype: A Python library for interoperable and scalable processing of water column sonar data for biological information. arXiv preprint arXiv:2111.00187</p>
          <br />
        </Paper>

        <br />
        {/* https://sbcode.net/threejs/animate-on-scroll/ */}

        <Paper square sx={{ m: 2, p: 2 }} elevation={10}>
          <p>
            {isLoading ? "loading value" : `api depth value: ${value} meters`}
          </p>
          <p>{`error message: ${errorMessage}`}</p>
        </Paper>
      </Container>
    </div>
  );
}
