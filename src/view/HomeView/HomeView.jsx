import {
  useEffect,
} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import header from "../../../src/assets/images/header.jpg";
import logo_noaa_fisheries from "../../../src/assets/images/noaa/noaa_fisheries_logo.png";
import logo_ncei from "../../../src/assets/images/noaa/ncei_logo.png";
import logo_echopype from "../../../src/assets/images/echopype/echopype.png";
import logo_cires from "../../../src/assets/images/cu/cires_cu_logo.png";
import { Link } from "react-router-dom";
import { MdAnchor } from "react-icons/md";

export default function HomeView() {
  useEffect(() => {
    document.title = `EchoFish`;
  }, []);

  // const { ref, inView } = useInView({
  //   triggerOnce: false,
  //   rootMargin: "-40px 0px",
  // });

  return (
    <div className="DatasetView">
      <Container fluid>
        <Row>
          <Image src={header} />
        </Row>
        <Row>
          <Col sm={3} />

          <Col sm={6}>
            <br />
            <br />
            <br />
            <h1 className="text-left" style={{ lineHeight: "1.7em", fontWeight: "600", color: "LightSlateGrey" }}>
              EchoFish<br />Exploring Water Column Sonar Data
            </h1>
            <br />
            <br />

            <p className="text-center">
              <Link to="/map" className="LinkToMap">
                Go to the Map
                {' '}
                <i className="bi bi-arrow-right" />
              </Link>
            </p>
            <br />
            <br />

            <p>
              Water column sonar, the acoustic backscatter from the
              near-surface to the seafloor, is used to assess physical and
              biological characteristics of the ocean including the spatial
              distribution of plankton, fish, methane seeps, and underwater oil
              plumes.
            </p>

            <br />
            <p>
              In collaboration with NOAA&apos;s National Marine Fisheries
              Service (NMFS) and the University of Colorado Boulder, NOAA’s
              National Centers for Environmental Information (NCEI) established
              a national archive for <a target="_blank" href="https://www.ncei.noaa.gov/products/water-column-sonar-data">water column sonar data</a>. This archive
              ensures the long-term stewardship of well-documented
              water column sonar data, and enables discovery and access to
              researchers and the public around the world through a <a target="_blank" href="https://www.ncei.noaa.gov/maps/water-column-sonar/">dedicated portal</a>.
            </p>
            <br />
            <p>
              This portal comprises water column sonar data archived at NCEI that
              have been translated into a more readily accessible media. Data provided
              to NCEI are in their raw format. Processing routines are being applied
              to a subset of the archive, currently focusing on Simrad EK60 single and
              multiple frequency datasets. Interactive visualization of the sonar data
              enables exploration and understanding of large volumes of complex sonar
              data to a broader audience.
            </p>
            <br />

            <div className="d-flex justify-content-evenly">
              <div>
                <a target="_blank" href="https://www.fisheries.noaa.gov/">
                  <Image
                    src={logo_noaa_fisheries}
                    style={{ height: "90px", padding: "5px" }}
                  />
                </a>
              </div>
              <div>
                <a target="_blank" href="https://www.ncei.noaa.gov/">
                  <Image
                    src={logo_ncei}
                    style={{ height: "90px", padding: "5px" }}
                  />
                </a>
              </div>
              <div>
                <a target="_blank" href="https://cires.colorado.edu/">
                  <Image
                    src={logo_cires}
                    style={{ height: "90px", padding: "5px" }}
                  />
                </a>
              </div>
            </div>
            <br />

            <hr />
            <br />
            <br />
            <h2>Data</h2>
            <br />
            <p>
              Raw archived data were collected using a variety of vessel and
              bottom-mounted sonar systems. Data collected from NOAA survey
              vessels using Kongsberg&apos;s EM122 (12 kHz) and EM302 (30 kHz), and
              Simrad&apos;s EK60, ME70, and EK80 (narrowband and broadband) comprise
              the majority of the archive holdings.
            </p>
            <br />
            <p>
              Data providers include NOAA NMFS, NOAA Office of Ocean Exploration
              and Research (OER), NOAA National Ocean Service (NOS), Rolling Deck
              to Repository (R2R), U.S. academic and private institutions, and
              international research organizations.
            </p>

            <br />
            <h3>Data Levels</h3>
            <br />
            <h4>Level 0: Raw AWS S3 Explorer</h4>
            <br />
            <p>
              A copy of the NCEI Water Column Sonar Data Archive is available
              this Level 0 S3 Explorer. The raw (binary) sonar files are generated
              during individual cruises and are accompanied by associated metadata
              and calibration information. Users can use open source tools such as
              {" "}
              <a
                target="_blank"
                href="https://echopype.readthedocs.io/en/latest/"
              >
                echopype
              </a>{" "}
              to open the files and process the data into a more conventional
              Xarray Dataset format.
            </p>

            <br />
            <p style={{ textIndent: "2em" }}>
              <a
                target="_blank"
                href="https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/"
              >
                Level 0: Raw data S3 Explorer
              </a>
            </p>

            <br />
            <br />
            <h4>Level 2a — File Level Zarr stores</h4>
            <br />
            <p>
              EK60 data are opened and calibrated using{" "}
              <a
                target="_blank"
                href="https://echopype.readthedocs.io/en/latest/"
              >
                echopype
              </a>{" "}
              to generate Xarray datasets which are then saved as Zarr stores.
            </p>
            <br />
            <center>
              <a target="_blank" href="https://echopype.readthedocs.io/">
                <Image src={logo_echopype} style={{ height: "50px" }} />
              </a>
            </center>
            <br />
            <br />

            <p style={{ textIndent: "2em" }}>
              <a
                target="_blank"
                href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/"
              >
                Level 2a: Zarr store S3 Explorer
              </a>
            </p>

            <br />
            <br />
            <h4>Level 3a — Cruise Level Zarr stores</h4>
            <br />
            <p>
              Level 2a processed EK60 data is consolidated at a cruise level to
              form a larger singular Zarr store.
            </p>
            <br />
            <br />
            <p style={{ textIndent: "2em" }}>
              <a
                target="_blank"
                href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2a/"
              >
                Level 3a: Zarr store S3 Explorer
              </a>
            </p>
            <br />

            {/* <br />
            <br />
            <a
              target="_blank"
              href="https://radiantearth.github.io/stac-browser/#/external/noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/catalog/catalog.json?.language=en"
            >
              Stac Catalog for the Zarr stores
            </a> */}

            <br />

            <hr />
            <br />
            <br />
            <h2>Acknowledgment</h2>
            <br />
            <ul>
              <li>
                This portal was supported by NOAA Fisheries and NOAA Center for
                Artificial Intelligence under the University of Colorado Cooperative
                Institute award #NA22OAR4320151, and the National Science Foundation
                (NSF) award #2311843.
              </li>
              <br />
              <li>
                The team leveraged services provided by the
                OSG Consortium supported by NSF awards #2030508 and #2323298 and <a target="_blank" href="https://doi.org/10.1093/icesjms/fsae133">Echopype</a>
                {' '}led by Dr. Wu-Jung Lee and team at the University of Washington.
              </li>
            </ul>

            <br />
            <hr />
            <br />
            <br />
            <h2>Additional Resources</h2>
            <br />
            <ul>
              <li><a target="_blank" href="https://www.ncei.noaa.gov/products/water-column-sonar-data">NCEI Water Column Sonar Data Archive</a></li>
              <li><a target="_blank" href="https://www.ncei.noaa.gov/maps/water-column-sonar/">NCEI Water Column Sonar Data Archive Map Viewer</a></li>
              <li><a target="_blank" href="https://www.ngdc.noaa.gov/mgg/wcd/citations.html">Cruise Citations</a></li>
              <li><a target="_blank" href="https://cires.gitbook.io/ncei-wcsd-archive">Background, AWS structure, and notebook tutorials</a></li>
              <li><a target="_blank" href="https://echolevels.readthedocs.io/en/latest/">Echosounder Data Processing Levels</a></li>
              <li><a target="_blank" href="https://echopype.readthedocs.io/en/latest/">Echopype</a></li>
            </ul>
            <br />
            <p>
              Please cite archived datasets in any future publication to document
              and provide credit back to the data creators. Citations
              can be found <a target="_blank" href="https://www.ngdc.noaa.gov/mgg/wcd/citations.html">here</a>.
            </p>
            <br />
            <h3>Tutorials</h3>
            <br />
            <p>
              There are several tutorials that will help you download the data
              and begin analysis. They utilize both raw and processed data.
            </p>

            <br />
            <ul>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Plotting_Raw_EK60_Data.ipynb"
                >
                  Plotting Raw EK60 Data
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Frequency_Differencing_With_Raw_Data.ipynb"
                >
                  Frequency Differencing with Raw Data
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Reading_And_Plotting_Processed_CSV_Data.ipynb"
                >
                  Reading and Plotting Processed CSV Data
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Reading_And_Plotting_Bottom_Data.ipynb"
                >
                  Reading and Plotting Raw Bottom Data
                </a>
              </li>
            </ul>

            <br />
            <p>
              Updated tutorials utilizing cloud-native Zarr data from NOAA&apos;s
              Open Data Dissemination can be found here:
            </p>

            <br />
            <ul>
              <li>
                <a
                  target="_blank"
                  href="https://colab.research.google.com/drive/14VVFf9KRlaFyr5T-dwkM0bytDl1QChAi?usp=sharing"
                >
                  Echopype EK60 Cloud Processing
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://colab.research.google.com/drive/1-I56QOIftj9sewlbyzTzncdRt54Fh51d?usp=sharing"
                >
                  Frequency Differencing with L2 EK60 Data
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://colab.research.google.com/drive/12hf-1gV6QyrR9pLPfsjYIQyzleTCp-Uz?usp=sharing"
                >
                  Geospatial Indexing
                </a>
              </li>
            </ul>

            <br />

            <br />
            <hr />
            <br />
            <br />
            <h2>References</h2>
            <br />
            <ul>
              <li>
                Wu-Jung Lee, Landung Setiawan, Caesar Tuguinay, Emilio Mayorga,
                Valentina Staneva, Interoperable and scalable echosounder data
                processing with Echopype, ICES Journal of Marine Science, Volume
                81, Issue 10, December 2024, Pages 1941–1951,{' '}
                <a
                  target="_blank"
                  href="https://doi.org/10.1093/icesjms/fsae133"
                >
                  https://doi.org/10.1093/icesjms/fsae133
                </a>
              </li>
              <br />
              <li>
                De Robertis, A., & Higginbottom, I. (2007). A post-processing
                technique to estimate the signal-to-noise ratio and remove
                echosounder background noise. ICES Journal of Marine Science,
                64(6): 1282-1291.
              </li>
              <br />
              <li>
                Ryan, T.E., Downie, R.A., Kloser, R.J., and Keith, G. (2015).
                Reducing bias due to noise and attenuation in open-ocean echo
                integration data. ICES Journal of Marine Science, 72(8):
                2482-2493.
              </li>
              <br />
              <li>
                Simmonds, E.J. and MacLennan, D.N. 2005. Fisheries Acoustics:
                Theory and practice. Blackwell Science, Oxford. 456pp.
              </li>
              <br />
              <li>
                Wall, C.C. (2016), Building an accessible archive for water
                column sonar data, Eos, 97,
                https://doi.org/10.1029/2016EO057595. Published on 15 August
                2016.
              </li>
              <br />
              <li>
                Wall, C.C., Jech, J.M. and. McLean, S.J. (2016) Increasing the
                accessibility of acoustic data through global access and
                imagery, ICES Journal of Marine Science, 73(8): 2093–2103, DOI:
                https://doi.org/10.1093/icesjms/fsw014.
              </li>
              <br />
              <li>
                Pordes, R., Petravick, D., Kramer, B., Olson, D., Livny, M.,
                Roy, A., Avery, P., Blackburn, K., Wenaus, T., Würthwein, F.,
                Foster, I., Gardner, R., Wilde, M., Blatecky, A., McGee, J., &
                Quick, R. (2007). The open science grid. J. Phys. Conf. Ser.,
                78, 012057. https://doi.org/10.1088/1742-6596/78/1/012057.
              </li>
              <br />
              <li>
                Sfiligoi, I., Bradley, D. C., Holzman, B., Mhashilkar, P.,
                Padhi, S., & Wurthwein, F. (2009). The pilot way to grid
                resources using glideinWMS. 2009 WRI World Congress on Computer
                Science and Information Engineering, 2, 428–432.
                https://doi.org/10.1109/CSIE.2009.950.
              </li>
              <br />
              <li>
                OSG. (2006). OSPool. OSG. https://doi.org/10.21231/906P-4D78.
              </li>
              <br />
              <li>
                OSG. (2015). Open Science Data Federation. OSG.
                https://doi.org/10.21231/0KVZ-VE57.
              </li>
            </ul>

            <br />
            <hr />
            <br />
            <br />
            <h2>Code Source</h2>
            <br />
            <div className="d-flex justify-content-evenly">
              <a target="_blank" href="https://pypi.org/project/water-column-sonar-processing">
                <img alt="PyPI - Version" src="https://img.shields.io/pypi/v/water-column-sonar-processing?style=plastic&label=water-column-sonar-processing&link=https%3A%2F%2Fpypi.org%2Fproject%2Fwater-column-sonar-processing%2F"></img>
              </a>
              <a target="_blank" href="https://pypi.org/project/water-column-sonar-annotation">
                <img alt="PyPI - Version" src="https://img.shields.io/pypi/v/water-column-sonar-annotation?style=plastic&label=water-column-sonar-annotation&link=https%3A%2F%2Fpypi.org%2Fproject%2Fwater-column-sonar-annotation%2F"></img>
              </a>
              <a target="_blank" href="https://github.com/CI-CMG/water-column-sonar-ui">
                <img alt="GitHub Tag" src="https://img.shields.io/github/v/tag/CI-CMG/water-column-sonar-ui?label=water-column-sonar-ui"></img>
              </a>
            </div>
            
            <br />

            <div className="d-flex justify-content-evenly">
              <a target="_blank" href="https://github.com/CI-CMG/water-column-sonar-api">
                <img alt="GitHub Tag" src="https://img.shields.io/github/v/tag/CI-CMG/water-column-sonar-api?label=water-column-sonar-api"></img>
              </a>
              <a target="_blank" href="https://github.com/CI-CMG/water-column-sonar-catalog">
                <img alt="GitHub Tag" src="https://img.shields.io/github/v/tag/CI-CMG/water-column-sonar-catalog?label=water-column-sonar-catalog"></img>
              </a>
            </div>

            <br />
            <br />
            <p className="text-end">
              <i>
                Contact <b>wcd.info@noaa.gov</b> with any questions
              </i>
            </p>
            <hr />
            <br />
          </Col>

          <Col sm={3} />

          <br />
          <br />
          <br />
        </Row>
        <br />
        <br />
        <p className="text-center">
          <MdAnchor />
        </p>
        <br />
      </Container>
    </div>
  );
}
