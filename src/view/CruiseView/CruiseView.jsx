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
      <Link to="/water-column?ship=Henry_B._Bigelow&cruise=HB0707&sensor=EK60&index=123">HB0707</Link>
      <p>HB0710</p>
      <p>HB0711</p>
      <p>HB20TR</p>
    </div>
  );
}
