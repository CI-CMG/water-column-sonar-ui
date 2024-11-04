import { useEffect } from "react";
import { Link } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";

export default function CruiseView() {
  useEffect(() => {
    document.title = `Cruise`;
  }, []);

  return (
    <div className="CruiseView">
      <h1>Cruises</h1>

      <p>Ship: Henry_B._Bigelow</p>

      <Link to="/water-column?ship=Henry_B._Bigelow&cruise=HB0706">HB0706</Link>
      <br />
      <Link to="/water-column?ship=Henry_B._Bigelow&cruise=HB0707">HB0707</Link>
      <p>HB0710</p>
      <p>HB0711</p>
      <p>HB0802</p>
      <p>HB0803</p>
      <p>HB0805</p>
      <p>HB0807</p>
      <p>HB0901</p>
      <p>HB0902</p>
      <p>HB0904</p>
      <p>HB0905</p>
      <p>HB1002</p>
      <p>HB1006</p>
      <p>HB1102</p>
      <p>HB1103</p>
      <p>HB1105</p>
      <p>HB1201</p>
      <p>HB1206</p>
      <p>HB1301</p>
      <p>HB1303</p>
      <p>HB1304</p>
      <p>HB1401</p>
      <p>HB1403</p>
      <p>HB1405</p>
      <p>HB1501</p>
      <p>HB1502</p>
      <p>HB1503</p>
      <p>HB1506</p>
      <p>HB1507</p>
      <p>HB1601</p>
      <p>HB1603</p>
      <p>HB1604</p>
      <p>HB1701</p>
      <p>HB1702</p>
      <p>HB1801</p>
      <p>HB1802</p>
      <p>HB1803</p>
      <p>HB1804</p>
      <p>HB1805</p>
      <p>HB1806</p>
      <p>HB1901</p>
      <p>HB1902</p>
      <p>HB1903</p>
      <p>HB1906</p>
      <p>HB1907</p>
      <p>HB2001</p>
      <p>HB2006</p>
      <p>HB2007</p>
      <p>HB20ORT</p>
      <p>HB20TR</p>
    </div>
  );
}
