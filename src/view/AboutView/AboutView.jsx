import { useEffect, useState } from "react";
// import { useGetSatellitesQuery } from "../../services/api.js";
import NOAALogo from "../../../src/assets/images/noaa/noaa.png";
import XarrayLogo from "../../../src/assets/images/xarray/xarray.png";
import DaskLogo from "../../../src/assets/images/dask/dask.png";
import ZarrLogo from "../../../src/assets/images/zarr/zarr.png";
import PandasLogo from "../../../src/assets/images/pandas/pandas.png";
// import HenryBBigelow from "../../../src/assets/images/noaa/henry_b._bigelow.png";
import Echopype from "../../../src/assets/images/echopype/echopype.png";
import OSPool from "../../../src/assets/images/osdf/OSPool.png";
import OSDF from "../../../src/assets/images/osdf/OSDF.png";
import AWSLogo from "../../../src/assets/images/aws/aws.png";

export default function AboutView() {
  useEffect(() => {
    document.title = `About`;
    console.log(`App Name: ${import.meta.env.VITE_REACT_APP_NAME}, App Version: ${import.meta.env.VITE_REACT_APP_VERSION}`)
  }, []);

  const params = {
    geometry: "-39.85499,13.21980",
    geometryType: "esriGeometryPoint",
    returnGeometry: false,
    returnCatalogItems: false,
    f: "json",
  };
  // const [isLoading, setLoading] = useState(false);
  // const [value, setValue] = useState("nothing here");
  // const [errorMessage, setErrorMessage] = useState(null);

  // Call API
  // const apiResult = useGetSatellitesQuery(params);

  // Update files data on changed API result
  // useEffect(() => {
  //   if (apiResult.status === "fulfilled") {
  //     setValue(apiResult.data.value);
  //   } else if (apiResult.status === "rejected") {
  //     setErrorMessage("API error");
  //   }
  //   setLoading(false);
  // }, [apiResult]);

  return (
    <div className="AboutView">

      <div>
        <div>
          <br />
          <h1>Water Column Sonar Data Lake</h1>
          <br />
          <p>version {import.meta.env.VITE_REACT_APP_VERSION}</p>
          <hr />

          <h2>The Henry Bigelow Research Vessel</h2>
          <p>Henry B. Bigelow is a fisheries research vessel that surveys the east coast of the United Sates collecting oceanographic data.</p>
          <p>The ship&apos;s surveys focus on assessments of fish stocks and research of the marine biome.</p>

          <br />
          {/* <img src={HenryBBigelow} width={400} /> */}
          {/* <p><i>NOAAS Henry B. Bigelow (R 225). https://en.wikipedia.org/wiki/NOAAS_Henry_B._Bigelow</i></p> */}

        </div>

        {/* EK60 Echosounders */}
        <div>
          <h2>EK60 Echosounders</h2>
          <p>EK60 data are a sonar reflectivity measurement.</p>
          <p>[Holoview Data visualization]</p>
        </div>

        {/* NODD — NOAA Open Data Dissemination */}
        <div>
          <h2>NODD — NOAA Open Data Dissemination</h2>
          <p>NOAA curates hundreds of terabytes of water column sonar data. The NOAA Open Data Dissemination program provides public access to NOAA's data via AWS S3 bucket access.</p>
          <img src={NOAALogo} width={100} height={100} />
          <img src={AWSLogo} height={100} />
          <p>The water column sonar archive includes nearly 300 TB of echosounder data ready for analysis.</p>

          <br />
          <p>Datasets are available at three different processing levels:</p>
          <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/"
          >
            Level 0
          </a>
          <br />
          <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/"
          >
            Level 1
          </a>
          <br />
          <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/"
          >
            Level 2
          </a>
          <br />
          <p>For more discussion on processing levels for water column sonar data, see here:</p>
          <a rel="noopener noreferrer" href="https://echopype.readthedocs.io/en/v0.8.0/processing-levels.html">https://echopype.readthedocs.io/en/v0.8.0/processing-levels.html</a>
        </div>

        {/* Where */}
        <div>
          <h2>Where</h2>
          <p>Publicly available data sets</p>
          <p>[MAP]</p>
          <br />
        </div>

        {/* ZarrJS */}
        <div>
          <h3>ZarrJS</h3>
          <p>Data are available in a cloud-native Zarr format.</p>
          <img src={ZarrLogo} height={100} />
          <p>[ThreeJS graphic of cube]</p>
          <br />
        </div>

        <div>
          <h2>When</h2>
          <p>2001 to Present</p>
          <p>[bee diagram datasets by size — circles]</p>
        </div>

        <div>
          <h2>Why</h2>
          <p>Goal is to evaluate large scale interactions between climate change and the atlantic herring population</p>
          <p>map of population collapse</p>
          <br />
          <p>Global Warming</p>
          {/* https://threejs.org/examples/css3d_molecules.html */}
          <p>co2 plot -- co2 molecule</p>
        </div>

        <div>
          <h2>Processing Utilities</h2>

          <h3>echopype</h3>
          <p>Data conversions are made possible using the open source project,
            {' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://echopype.readthedocs.io/en/stable/"
            >
              echopype
            </a>.
          </p>
          <img src={Echopype} width={200} />
          <br />
          <p>Lee, W., Mayorga, E., Setiawan, L., Majeed, I., Nguyen, K., & Staneva, V. (2021). Echopype: A Python library for interoperable and scalable processing of water column sonar data for biological information. arXiv preprint arXiv:2111.00187</p>
          <br />

          <h3>OSPool</h3>
          <img src={OSPool} height={100} />
          <img src={OSDF} height={100} />
          <p><i>This research was done using services provided by the OSG Consortium [1,2,3,4], which is supported by the National Science Foundation awards #2030508 and #1836650.</i></p>
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://osg-htc.org/projects.html?project=NOAA_Bell"
            >
              See more about our current processing statistics here.
            </a>
          <br />
        </div>

        <div>
          <h2>Our Data Science Ecosystem</h2>
          <p>Analysis is interoperable between a suite of scientific tools in the Python ecosystem.</p>
          {/* TODO: make these actual links to projects */}
          <img src={XarrayLogo} height={100} />
          <img src={DaskLogo} height={40} />
          <img src={ZarrLogo} height={100} />
          <img src={PandasLogo} height={100} />
          <br />
          <br />
          <br />
        </div>

        <br />
        {/* https://sbcode.net/threejs/animate-on-scroll/ */}

        {/* <div>
          <p>
            {isLoading ? "loading value" : `api depth value: ${value} meters`}
          </p>
          {errorMessage &&
            <p>{`error message: ${errorMessage}`}</p>
          }
        </div> */}
      </div>
    </div>
  );
}
