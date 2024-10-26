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

      <p>Henry_B._Bigelow / HB0706</p>

      <Link to="/water-column?ship=Henry_B._Bigelow&cruise=HB0706">
        HB0706
      </Link>
    </div>
  );
}
