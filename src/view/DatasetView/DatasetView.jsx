import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function DatasetView() {
  useEffect(() => {
    document.title = `Map`;

    console.log(
      `★ ${import.meta.env.VITE_REACT_APP_NAME} — v${
        import.meta.env.VITE_REACT_APP_VERSION
      } — ${import.meta.env.DEV} ★`
    );
  }, []);

  return (
    <div className="DatasetView">
      <Container>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <br />
            <br />
            {/* <h1 style={{ backgroundColor: "lightblue" }}> */}
            <h1>NOAA — NCEI Water Column Sonar Dataset</h1>
            <br />

            <br />
            <p>
              Water column sonar data, the acoustic back-scatter from the
              near-surface to the seafloor, are used to assess physical and
              biological characteristics of the ocean including the spatial
              distribution of plankton, fish, methane seeps, and underwater oil
              plumes.
            </p>

            <br />
            <p>
              In collaboration with NOAA's National Marine Fisheries Service
              (NMFS) and the University of Colorado Boulder, NOAA’s National
              Centers for Environmental Information (NCEI) established a
              national archive for water column sonar data. This project entails
              ensuring the long-term stewardship of well-documented water column
              sonar data, and enabling discovery and access to researchers and
              the public around the world.
            </p>

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
                <a href="https://www.ngdc.noaa.gov/mgg/wcd/">
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
            <h4>Level 1 — File Level Zarr stores</h4>
            <br />
            <p>
              EK60 data are calibrated and converted using echopype to generate
              Zarr stores.
            </p>

            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/">
              Level 1: Zarr store S3 Explorer
            </a>

            <br />
            <br />
            <br />
            <h4>Level 2 — Cruise Level Zarr stores</h4>
            <br />
            <p>
              Level 1 processed EK60 data is consolidated at a cruise level to
              form a larger singular Zarr store.
            </p>

            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/">
              Level 2: Zarr store S3 Explorer
            </a>

            <br />
            <br />
            <br />
            <h4>Data Details</h4>
            <br />
            <p>
              The raw EK60 data are processed with the routine below. This
              routine will be available in pyEcholab in 2020. Processed data are
              not available for all raw data. However, more will be added over
              time as it is created.
            </p>

            <ul>
              <li>Match ping times</li>
              <li>Seafloor detection</li>
              <li>Noise removal including impulse, attenuation, transient, and background noise</li>
              <li>Re-sample by pings</li>
              <li>Removal of top 10 m of data due to bubble interference</li>
              <li>If EK60 data contain multiple frequencies, preprocess with a 3x3 median convolution filter and apply multi-frequency single-beam imaging index outlined in Wall et al. (2016) using a threshold of -66 dB</li>
            </ul>

            <br />
            <hr />
            <br />
            <h2>Structure</h2>
            <br />
            <p>Data are archived in an Amazon S3 bucket with access to the general public. The folder structure is outlined as follows:</p>

            <br />
            <ul>
              <li>For processed data: cruise → transducer frequency/bottom/multi-frequency single-beam imaging index → file</li>
              <li>For raw data: ship → cruise → instrument → file</li>
            </ul>

            <br />
            <p>To download a 18 kHz frequency file from the SH1305 cruise such as "SaKe2013-D20130523-T080854_to_SaKe2013-D20130523-T085643.csv" you can read directly from the URL as follows:</p>
            <br />
            <p><a href="https://ncei-wcsd-archive.s3-us-west-2.amazonaws.com/data/processed/SH1305/18kHz/SaKe2013-D20130523-T080854_to_SaKe2013-D20130523-T085643.csv">https://ncei-wcsd-archive.s3-us-west-2.amazonaws.com/data/processed/SH1305/18kHz/SaKe2013-D20130523-T080854_to_SaKe2013-D20130523-T085643.csv</a></p>

            <br />
            <h3>Citation</h3>
            <br />
            <p>If the archived data are used in a future publication, please cite all used data sets to document and provide credit back to the data creators. Cruises have unique citations. See individual cruises for details. Citation information can be found at the NCEI water-column sonar data archive.</p>

            <br />
            <hr />
            <br />
            <h2>Access</h2>
            <br />
            <p>Raw and processed data are stored in the cloud on an Amazon Web Services S3 bucket and accessible for download using a variety of tools.</p>
            <br />
            <p>The library boto3 provides an object-oriented and well documented interface to the data set. We can configure the boto3 resource to access our bucket, "noaa-wcsd-pds" as an anonymous user using low-level functions from botocore.</p>

            <br />
            <hr />
            <br />
            <h2>Tutorials</h2>
            <br />
            <p>There are several tutorials that will help you download the data and begin analysis. They utilize both raw and processed data.</p>

            <br />
            <ul>
              <li><a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Plotting_Raw_EK60_Data.ipynb">Plotting Raw EK60 Data</a></li>
              <li><a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Frequency_Differencing_With_Raw_Data.ipynb">Frequency Differencing with Raw Data</a></li>
              <li><a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Reading_And_Plotting_Processed_CSV_Data.ipynb">Reading and Plotting Processed CSV Data</a></li>
              <li><a href="https://github.com/CI-CMG/pyEcholab/tree/master/examples/cloud%20tutorials/Reading_And_Plotting_Bottom_Data.ipynb">Reading and Plotting Raw Bottom Data</a></li>
            </ul>

            <br />
            <p>Updated tutorials utilizing cloud-native Zarr data from NOAA's Open Data Dissemination can be found here:</p>

            <br />
            <ul>
              <li><a href="https://colab.research.google.com/drive/14VVFf9KRlaFyr5T-dwkM0bytDl1QChAi?usp=sharing">Echopype EK60 Cloud Processing</a></li>
              <li><a href="https://colab.research.google.com/drive/1-I56QOIftj9sewlbyzTzncdRt54Fh51d?usp=sharing">Frequency Differencing with L2 EK60 Data</a></li>
              <li><a href="https://colab.research.google.com/drive/12hf-1gV6QyrR9pLPfsjYIQyzleTCp-Uz?usp=sharing">Geospatial Indexing</a></li>
            </ul>

            <br />
            <hr />
            <br />
            <h2>References</h2>
            <br />
            <ul>
              <li>De Robertis, A., & Higginbottom, I. (2007). A post-processing technique to estimate the signal-to-noise ratio and remove echosounder background noise. ICES Journal of Marine Science, 64(6): 1282-1291.</li>
              <br />
              <li>Ryan, T.E., Downie, R.A., Kloser, R.J., and Keith, G. (2015). Reducing bias due to noise and attenuation in open-ocean echo integration data. ICES Journal of Marine Science, 72(8): 2482-2493.</li>
              <br />
              <li>Simmonds, E.J. and MacLennan, D.N. 2005. Fisheries Acoustics: Theory and practice. Blackwell Science, Oxford. 456pp.</li>
              <br />
              <li>Wall, C.C. (2016), Building an accessible archive for water column sonar data, Eos, 97, https://doi.org/10.1029/2016EO057595. Published on 15 August 2016.</li>
              <br />
              <li>Wall, C.C., Jech, J.M. and. McLean, S.J. (2016) Increasing the accessibility of acoustic data through global access and imagery, ICES Journal of Marine Science, 73(8): 2093–2103, DOI: https://doi.org/10.1093/icesjms/fsw014.</li>
            </ul>

            <br />
            <br />
            <br />
            <p className="text-end">Contact <i className="bi bi-person-arms-up"></i><b>wcd.info@noaa.gov</b> for support with the data set</p>
            <hr />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
