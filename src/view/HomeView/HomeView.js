import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";

import SailingIcon from "@mui/icons-material/Sailing";

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

  const actions = [
    { icon: <FileCopyIcon />, name: "Copy" },
    { icon: <SaveIcon />, name: "Save" },
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ];

  return (
    <Container maxWidth="md" className="HomeView">
      
      <Paper square sx={{ m: 2, p: 2 }} elevation={10}>
        <h1>Water Column Sonar Data Explorer</h1>
      </Paper>

      <br />
      {/* https://sbcode.net/threejs/animate-on-scroll/ */}

      <Paper square sx={{ m: 2, p: 2 }} elevation={10}>
        <Button variant="contained">Hello world</Button>

        <br />
        <Button variant="outlined" sx={{ mx: "auto", width: 200 }}>
          Outlined
        </Button>
        <p>
          {isLoading ? "loading value" : `api depth value: ${value} meters`}
        </p>
        <p>{`error message: ${errorMessage}`}</p>
      </Paper>

      <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
        <SailingIcon />

        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Box>
    </Container>
  );
}
