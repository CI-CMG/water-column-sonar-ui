import {
  // useRef,
  // useState,
  useEffect,
} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useInView } from "react-intersection-observer";
import Image from 'react-bootstrap/Image';
import header from "../../../src/assets/images/header.jpg";
import logo_noaa from "../../../src/assets/images/noaa/noaa.png";
import logo_ncei from "../../../src/assets/images/noaa/ncei.png";
import { Link } from "react-router-dom";
import { MdOutlineAnchor } from "react-icons/md";
import { ImCompass } from "react-icons/im";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";

// import { useFrame } from "@react-three/fiber";
// import { RoundedBox } from "@react-three/drei";
// import { a, config, useSpring } from "@react-spring/three";
// import {
//   // useSpring,
//   // animated
// } from "@react-spring/web";
// import {
//   GlobalCanvas,
//   UseCanvas,
//   SmoothScrollbar,
// } from "@14islands/r3f-scroll-rig";
// import { StickyScrollScene } from "@14islands/r3f-scroll-rig/powerups";

// prototyping with this: https://codesandbox.io/p/sandbox/r3f-scroll-rig-sticky-box-w5v4u7?file=%2Fsrc%2FApp.jsx%3A6%2C36-6%2C70
// const AnimatedRoundedBox = a(RoundedBox);
// function SpinningBox({ scale, scrollState, inViewport }) {
//   const box = useRef();
//   const size = scale.xy.min() * 0.5;

//   useFrame(() => {
//     box.current.rotation.y = scrollState.progress * Math.PI * 2;
//   });

//   const spring = useSpring({
//     scale: inViewport ? size : size * 0.0,
//     config: inViewport ? config.wobbly : config.stiff,
//     delay: inViewport ? 100 : 0,
//   });

//   return (
//     <AnimatedRoundedBox ref={box} {...spring}>
//       <meshNormalMaterial />
//     </AnimatedRoundedBox>
//   );
// }

// function StickySection() {
//   const el = useRef();
//   return (
//     <section>
//       <div className="StickyContainer">
//         <div ref={el} className="SomeStickyContent Debug">
//           <p>This element is position:sticky and will be tracked.</p>
//         </div>
//       </div>
//       <UseCanvas>
//         <StickyScrollScene track={el}>
//           {(props) => (
//             <>
//               <SpinningBox {...props} />
//             </>
//           )}
//         </StickyScrollScene>
//       </UseCanvas>
//     </section>
//   );
// }

export default function DatasetView() {
  // const springs = useSpring({
  //   from: { background: "#ff6d6d", y: -40, x: -20 },
  //   to: [
  //     { x: 20, background: "#fff59a" },
  //     { y: 40, background: "#88DFAB" },
  //     { x: -20, background: "#569AFF" },
  //     { y: -40, background: "#ff6d6d" },
  //   ],
  //   loop: true,
  // });

  // const [isTouch, setTouch] = useState(false);
  // useEffect(() => {
  //   const isTouch =
  //     "ontouchstart" in window ||
  //     navigator.maxTouchPoints > 0 ||
  //     navigator.msMaxTouchPoints > 0;
  //   setTouch(isTouch);
  // }, []);

  useEffect(() => {
    document.title = `Dataset`;
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "-40px 0px",
  });

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
            <h1 className="text-left">NOAA NCEI Water Column Sonar Data</h1>
            <br />
            <br />
            
            <p>
              <Link
                to="/map"
              >
                Map View<MdOutlineAnchor />
              </Link>
              {' | '}
              <Link
                to="/water-column"
              >
                Water Column View<ImCompass />
              </Link>
            </p>
            <br />
            
            <p>
              Water column sonar, the acoustic back-scatter from the
              near-surface to the seafloor, is used to assess physical and
              biological characteristics of the ocean including the spatial
              distribution of plankton, fish, methane seeps, and underwater oil
              plumes.
            </p>

            <br />
            <p>
              In collaboration with NOAA's <b>National Marine Fisheries Service
              (NMFS)</b> and the <b>University of Colorado Boulder</b>, NOAA’s <b>National
              Centers for Environmental Information (NCEI)</b> established a
              national archive for water column sonar data. This project entails
              ensuring the long-term stewardship of well-documented water column
              sonar data, and enabling discovery and access to researchers and
              the public around the world.
            </p>

            <center>
              <Image src={logo_noaa} style={{ height: "100px", marginRight: "60px" }}/>
              <Image src={logo_ncei} style={{ height: "100px" }}/>
            </center>

            <br />
            <p>
              Data providers include NOAA National Marine Fisheries Service
              (NMFS), NOAA Office of Ocean Exploration and Research (OER), NOAA
              National Ocean Service (NOS), Rolling Deck to Repository (R2R),
              U.S. academic and private institutions, and international groups.
            </p>

            <br />
            <p>
              This data set comprises the water-column sonar data archived at
              NCEI in a more readily accessible media. Data provided to NCEI are
              in their raw format. Processing routines are being applied to a
              subset of the archive, specifically focusing on Simrad EK60 single
              and multiple frequency datasets. Ping alignment, noise removal
              algorithms (De Robertis & Higgenbottom, 2007; Ryan et al., 2015),
              and bottom detection algorithms are applied to the raw data binned
              into one hour intervals using Echoview (Myriax, v.10). The
              processed data are exported as a CSV for each interval and each
              frequency.
            </p>
            <br />

            <br />
            <h3>Additional Resources</h3>

            <br />
            <ul>
              <li>
                <a href="https://www.ncei.noaa.gov/products/water-column-sonar-data">
                  NCEI water-column sonar data archive
                </a>
              </li>
              <br />
              <li>
                <a href="https://www.ncei.noaa.gov/maps/water-column-sonar/">
                  NCEI water-column sonar archive data access page
                </a>
              </li>
            </ul>

            <br />
            <hr />
            <br />

            <h2>Data</h2>
            <br />
            <p>
              Raw archived data were collected using a variety of vessel-mounted
              sonars with Kongsberg's EM 122 (12 kHz) and EM 302 (30 kHz),
              Simrad's EK60 (18-710 kHz, split beam), ME70 (70-120 kHz, can be
              split beam), and EK80 (18-710 kHz, split beam and broadband) being
              the most common. The configuration of each cruise's sonar system
              (e.g., beam type and angle) can be found in the file metadata.
            </p>

            <br />
            <p>
              File names contain the start time for that file, and often include
              a preceding tag for that cruise. The timestamp in UTC follows the
              convention: ‘D’YYYYMMDD’-T’hhmmss. For example,
              “SaKe_2013-D20130522-T134850”, indicates a files from a 2013 SaKe
              cruise and the start of the file is May 22, 2013 at 13:48:50
              (UTC).
            </p>

            <br />
            <h3>Type</h3>
            <br />
            <p>Data are categorized in three levels.</p>

            <br />
            <h4>Level 0 — Raw Data Files</h4>
            <br />
            <p>
              Binary files are generated during individual cruises. Users would
              typically use a tool such as pyEcholab to open the files and
              process the data into a more conventional format.
            </p>

            <a href="https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/">
              Level 0: Raw data S3 Explorer
            </a>

            <br />
            <br />
            <br />
            <h4>Level 2a — File Level Zarr stores</h4>
            <br />
            <p>
              EK60 data are calibrated and converted using echopype to generate
              Zarr stores.
            </p>

            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/">
              Level 2a: Zarr store S3 Explorer
            </a>

            <br />
            <br />
            <br />
            <h4>Level 3a — Cruise Level Zarr stores</h4>
            <br />
            <p>
              Level 2a processed EK60 data is consolidated at a cruise level to
              form a larger singular Zarr store.
            </p>

            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/">
              Level 3a: Zarr store S3 Explorer
            </a>

            <br />
            <br />
            <br />
            <h4>Data Details</h4>
            <br />
            <p>
              The raw EK60 data are processed with the following routine.
            </p>

            <ul>
              <li>Match ping times</li>
              <li>Seafloor detection</li>
              <li>
                Noise removal including impulse, attenuation, transient, and
                background noise
              </li>
              <li>Re-sample by pings</li>
              <li>Removal of top 10 m of data due to bubble interference</li>
              <li>
                If EK60 data contain multiple frequencies, preprocess with a 3x3
                median convolution filter and apply multi-frequency single-beam
                imaging index outlined in Wall et al. (2016) using a threshold
                of -66 dB
              </li>
            </ul>

            <br />
            <hr />
            <br />
            <h2>Structure</h2>
            <br />
            <p>
              Data are archived in an Amazon S3 bucket with access to the
              general public. The folder structure is outlined as follows:
            </p>

            <br />
            <ul>
              <li>
                For processed data: cruise → transducer
                frequency/bottom/multi-frequency single-beam imaging index →
                file
              </li>
              <li>For raw data: ship → cruise → instrument → file</li>
            </ul>

            <br />
            <p>
              To download a 18 kHz frequency file from the SH1305 cruise such as
              "SaKe2013-D20130523-T080854_to_SaKe2013-D20130523-T085643.csv" you
              can read directly from the URL as follows:
            </p>
            <br />
            <p>
              <a href="https://ncei-wcsd-archive.s3-us-west-2.amazonaws.com/data/processed/SH1305/18kHz/SaKe2013-D20130523-T080854_to_SaKe2013-D20130523-T085643.csv">
                https://ncei-wcsd-archive.s3-us-west-2.amazonaws.com/data/processed/SH1305/18kHz/SaKe2013-D20130523-T080854_to_SaKe2013-D20130523-T085643.csv
              </a>
            </p>

            <br />
            <h3>Citation</h3>
            <br />
            <p>
              If the archived data are used in a future publication, please cite
              all used data sets to document and provide credit back to the data
              creators. Cruises have unique citations. See individual cruises
              for details. Citation information can be found at the NCEI
              water-column sonar data archive.
            </p>

            <br />
            <hr />
            <br />
            <h2>Access</h2>
            <br />
            <p>
              Raw and processed data are stored in the cloud on an Amazon Web
              Services S3 bucket and accessible for download using a variety of
              tools.
            </p>
            <br />
            <p>
              The library boto3 provides an object-oriented and well documented
              interface to the data set. We can configure the boto3 resource to
              access our bucket, &quot;noaa-wcsd-pds&quot; as an anonymous user using
              low-level functions from botocore.
            </p>

            <br />
            <hr />
            <br />
            <h2>Tutorials</h2>
            {/* <div
              ref={ref}
              className={`ordinary ${inView ? "itemShown" : "itemHidden"}`}
            >
              <span aria-label="Wave">🐍</span>
            </div> */}
            <br />
            <p>
              There are several tutorials that will help you download the data
              and begin analysis. They utilize both raw and processed data.
            </p>

            <br />
            <ul>
              <li>
                <a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Plotting_Raw_EK60_Data.ipynb">
                  Plotting Raw EK60 Data
                </a>
              </li>
              <li>
                <a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Frequency_Differencing_With_Raw_Data.ipynb">
                  Frequency Differencing with Raw Data
                </a>
              </li>
              <li>
                <a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Reading_And_Plotting_Processed_CSV_Data.ipynb">
                  Reading and Plotting Processed CSV Data
                </a>
              </li>
              <li>
                <a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Reading_And_Plotting_Bottom_Data.ipynb">
                  Reading and Plotting Raw Bottom Data
                </a>
              </li>
            </ul>

            <br />
            <p>
              Updated tutorials utilizing cloud-native Zarr data from NOAA's
              Open Data Dissemination can be found here:
            </p>

            <br />
            <ul>
              <li>
                <a href="https://colab.research.google.com/drive/14VVFf9KRlaFyr5T-dwkM0bytDl1QChAi?usp=sharing">
                  Echopype EK60 Cloud Processing
                </a>
              </li>
              <li>
                <a href="https://colab.research.google.com/drive/1-I56QOIftj9sewlbyzTzncdRt54Fh51d?usp=sharing">
                  Frequency Differencing with L2 EK60 Data
                </a>
              </li>
              <li>
                <a href="https://colab.research.google.com/drive/12hf-1gV6QyrR9pLPfsjYIQyzleTCp-Uz?usp=sharing">
                  Geospatial Indexing
                </a>
              </li>
            </ul>

            <br />
            <hr />
            <br />
            <h2>References</h2>
            <br />
            <ul>
              {/* TODO: add hyperlinks here... */}
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
            <h2>Acknowledgment</h2>
            <br />
            <ul>
              <li>
                This research was done using services provided by the OSG
                Consortium, which is supported by the National Science
                Foundation awards #2030508 and #2323298.
              </li>
            </ul>

            <br />
            <br />
            <br />
            <p className="text-end">
              <i>Contact <b>wcd.info@noaa.gov</b> for support with the dataset</i>
            </p>
            <hr />
            <br />
          </Col>

          {/* <Col sm={2} /> */}

          <Col sm={3} />
        </Row>
      </Container>
    </div>
  );
}
