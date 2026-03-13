import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

function GraphForm() {
  const altitudeInitial = [-497, 395]; // [-496.4299927, 394.730011] from parquet
  const distanceFromCoastlineInitial = [42, 157942]; // from parquet file
  const phaseOfDayInitial = "night";  // from parquet file
  const classificationInitial = "AH_School"; // from parquet file
  const [phaseOfDay, setPhaseOfDay] = useState(phaseOfDayInitial);
  const [classification, setClassification] = useState(classificationInitial);
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
    
    setPhaseOfDay(checkedValues1.filter((x) => x[1])[0][0]);

    // classification
    const checkedValues2 = Array.from(event.target.group2).map((el) => [
      el.id,
      el.checked,
    ]);
    setClassification(checkedValues2.filter((x) => x[1])[0][0]);

    // query the graph
  };

  // TODO: need to have the checked values set to defaults on first load
  //  And need to assemble the values in to the api request.

  return (
    <div className="GraphForm" style={{ color: "white" }}>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Phase of the Day</Form.Label>
        <div key="inline-radio1" className="mb-3">
          <Form.Check
            inline
            defaultChecked
            label="Night"
            name="group1"
            type="radio"
            id="night"
          />
          <Form.Check
            inline
            label="Dawn"
            name="group1"
            type="radio"
            id="dawn"
          />
          <Form.Check
            inline
            label="Day"
            name="group1"
            type="radio"
            id="day"
          />
          <Form.Check
            inline
            label="Dusk"
            name="group1"
            type="radio"
            id="dusk"
          />
        </div>

        <br />

        <Form.Label>Classification</Form.Label>
        <div key="inline-radio2" className="mb-3">
          <Form.Check
            inline
            label="Unclassified"
            name="group2"
            type="radio"
            id="Unclassified"
          />
          <Form.Check
            inline
            defaultChecked
            label="AH_School"
            name="group2"
            type="radio"
            id="AH_School"
          />
          <Form.Check
            inline
            label="fish_school"
            name="group2"
            type="radio"
            id="fish_school"
          />
          <Form.Check
            inline
            label="possible_herring"
            name="group2"
            type="radio"
            id="possible_herring"
          />
          {/* <p>{JSON.stringify(classification)}</p> */}
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
          <br />
          <p>{JSON.stringify(altitude)}</p>
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
          <br />
          <p>{JSON.stringify(distanceFromCoast)}</p>
        </div>
        <br />

        <Button type="submit">Query the Graph</Button>
      </Form>
      
      <br />
      
      <p style={{ fontSize: "0.75em" }}>
        phaseOfDay: {JSON.stringify(phaseOfDay)},
        classification: {JSON.stringify(classification)},
        minAltitude: {altitude[0]}, maxAltitude: {altitude[1]},
        minDistanceFromCoast: {distanceFromCoast[0]}, maxDistanceFromCoast: {distanceFromCoast[1]}
      </p>
    </div>
  );
}

export default GraphForm;

GraphForm.propTypes = {};
