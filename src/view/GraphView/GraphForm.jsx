import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

function GraphForm() {
  const altitudeInitial = [-497, 395]; // [-496.4299927, 394.730011] from parquet
  const distanceFromCoastlineInitial = [42, 157942]; // from parquet file
  const [phaseOfDayList, setPhaseOfDayList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [altitude, setAltitude] = useState(altitudeInitial);
  const [distanceFromCoast, setDistanceFromCoast] = useState(distanceFromCoastlineInitial);

  const handleUpdateAltitude = (e) => {
    setAltitude(e);
  }
  const handleUpdateDistanceFromCoastline = (e) => {
    setDistanceFromCoast(e);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // phase of the day
    const checkedValues1 = Array.from(event.target.group1).map((el) => [
      el.id,
      el.checked,
    ]);
    setPhaseOfDayList(checkedValues1.filter((x) => x[1]).map((x) => x[0]));

    // classification
    const checkedValues2 = Array.from(event.target.group2).map((el) => [
      el.id,
      el.checked,
    ]);
    setClassificationList(checkedValues2.filter((x) => x[1]).map((x) => x[0]));
  };


  return (
    <div className="GraphForm" style={{ color: "white" }}>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Phase of the Day</Form.Label>
        <div key="inline-checkbox1" className="mb-3">
          <Form.Check
            inline
            defaultChecked
            label="Night"
            name="group1"
            type="checkbox"
            id="night"
          />
          <Form.Check
            inline
            defaultChecked
            label="Dawn"
            name="group1"
            type="checkbox"
            id="dawn"
          />
          <Form.Check
            inline
            defaultChecked
            label="Day"
            name="group1"
            type="checkbox"
            id="day"
          />
          <Form.Check
            inline
            defaultChecked
            label="Dusk"
            name="group1"
            type="checkbox"
            id="dusk"
          />
          <p>{JSON.stringify(phaseOfDayList)}</p>
        </div>

        <br />

        <Form.Label>Classification</Form.Label>
        <div key="inline-checkbox2" className="mb-3">
          <Form.Check
            inline
            label="Unclassified"
            name="group2"
            type="checkbox"
            id="Unclassified"
          />
          <Form.Check
            inline
            defaultChecked
            label="AH_School"
            name="group2"
            type="checkbox"
            id="AH_School"
          />
          <Form.Check
            inline
            defaultChecked
            label="fish_school"
            name="group2"
            type="checkbox"
            id="fish_school"
          />
          <Form.Check
            inline
            defaultChecked
            label="possible_herring"
            name="group2"
            type="checkbox"
            id="possible_herring"
          />
          <p>{JSON.stringify(classificationList)}</p>
        </div>

        <br />

        <div>
          <Form.Label>Altitude (meters)</Form.Label>
          <RangeSlider
            min={altitudeInitial[0]}
            max={altitudeInitial[1]}
            step={1}
            defaultValue={altitudeInitial}
            onInput={(e) => { handleUpdateAltitude(e) }}
          />
          <p>altitude: {JSON.stringify(altitude)}</p>
        </div>

        <br />

        <div>
          <Form.Label>Distance From Coastline (meters)</Form.Label>
          <RangeSlider
            min={distanceFromCoastlineInitial[0]}
            max={distanceFromCoastlineInitial[1]}
            step={1}
            defaultValue={distanceFromCoastlineInitial}
            onInput={(e) => { handleUpdateDistanceFromCoastline(e) }}
          />
          <p>distance_from_coastline: {JSON.stringify(distanceFromCoast)}</p>
        </div>
        <br />

        <Button type="submit">Query the Graph</Button>
      </Form>
    </div>
  );
}

export default GraphForm;

GraphForm.propTypes = {};
