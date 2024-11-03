import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import SpeedDial from "@mui/material/SpeedDial";
// import SpeedDialIcon from "@mui/material/SpeedDialIcon";
// import SpeedDialAction from "@mui/material/SpeedDialAction";
// import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
// import SaveIcon from "@mui/icons-material/Save";
// import PrintIcon from "@mui/icons-material/Print";
// import ShareIcon from "@mui/icons-material/Share";
// import SailingIcon from "@mui/icons-material/Sailing";

import { useGetSatellitesQuery } from "../../services/api.js";

export default function HomeView() {
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
      <h1>Home</h1>

      <Container maxWidth="md">
        <Paper square sx={{ m: 2, p: 2 }} elevation={10}>
          <h1>Water Column Sonar Data</h1>
          <hr />

          <h2>Who</h2>
          <p>N ships</p>
          <p>[map ships traveling geojson paths]</p>
          <hr />
                    
          <h2>What</h2>
          <p>200 TB of EK60 echosounder data</p>
          <Button variant="outlined" sx={{ mx: "auto", width: 200 }}>
            Echosounder data
          </Button>
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
          <hr />

          <h2>How</h2>
          <p>OSPool</p>
          <Button variant="contained">OSPool</Button>
          <br />

          <p>echopype</p>
          <p>Lee, W., Mayorga, E., Setiawan, L., Majeed, I., Nguyen, K., & Staneva, V. (2021). Echopype: A Python library for interoperable and scalable processing of water column sonar data for biological information. arXiv preprint arXiv:2111.00187</p>
          
          <p>ZarrJS</p>
          <p>[ThreeJS graphic of cube]</p>
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
