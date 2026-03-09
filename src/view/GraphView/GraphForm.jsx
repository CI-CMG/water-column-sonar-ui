import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Multiselect from 'react-bootstrap-multiselect'
// Reference for multiselect:
//  https://projects.skratchdot.com/react-bootstrap-multiselect/

function GraphForm() {
  const [phaseOfDayList, setPhaseOfDayList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [altitude, setAltitude] = useState(0);
  const [distanceFromCoast, setDistanceFromCoast] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // phase of the day
    const checkedValues1 = Array.from(event.target.group1).map(el => [
      el.id,
      el.checked
    ]);
    setPhaseOfDayList(checkedValues1.filter((x) => x[1]).map((x) => x[0]))

    // classification
    const checkedValues2 = Array.from(event.target.group2).map(el => [
      el.id,
      el.checked
    ]);
    setClassificationList(checkedValues2.filter((x) => x[1]).map((x) => x[0]))

    // slider 1 altitude
    setAltitude(Number(event.target.group3.value));

    // slider 2 distance
    setDistanceFromCoast(Number(event.target.group4.value));
  };

  return (
    <div className="GraphForm" style={{ color: "white" }}>
      <p>Query the Knowledge Graph</p>

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
            // onChange={(e) => foo(e)}
          />
          <Form.Check
            inline
            defaultChecked
            label="Dawn"
            name="group1"
            type="checkbox"
            id="dawn"
            // onChange={(e) => foo(e)}
          />
          <Form.Check
            inline
            defaultChecked
            label="Day"
            name="group1"
            type="checkbox"
            id="day"
            // onChange={(e) => foo(e)}
          />
          <Form.Check
            inline
            defaultChecked
            label="Dusk"
            name="group1"
            type="checkbox"
            id="dusk"
            // onChange={(e) => foo(e)}
          />
          <p>phase_of_day: {JSON.stringify(phaseOfDayList)}</p>
        </div>
        
        <br />

        <Form.Label>Classification</Form.Label>
        <div key="inline-checkbox2" className="mb-3">
          <Form.Check
            inline
            defaultChecked
            label="Unclassified"
            name="group2"
            type="checkbox"
            id="Unclassified"
            // onChange={(e) => foo(e)}
          />
          <Form.Check
            inline
            defaultChecked
            label="AH_School"
            name="group2"
            type="checkbox"
            id="AH_School"
            // onChange={(e) => foo(e)}
          />
          <Form.Check
            inline
            defaultChecked
            label="fish_school"
            name="group2"
            type="checkbox"
            id="fish_school"
            // onChange={(e) => foo(e)}
          />
          <Form.Check
            inline
            defaultChecked
            label="possible_herring"
            name="group2"
            type="checkbox"
            id="possible_herring"
            // onChange={(e) => foo(e)}
          />
          <p>classification: {JSON.stringify(classificationList)}</p>
        </div>
        
        <br />

        <div>
          <Form.Label>Altitude</Form.Label>
          <Form.Range min="0" max="200" step="10" id="customRange3" name="group3" />
          <p>altitude: {altitude}</p>
        </div>

        <br />

        <div>
          <Form.Label>Distance From the Coast</Form.Label>
          <Form.Range min="0" max="1000" step="100" id="customRange3" name="group4" />
          <p>distance_from_coast: {distanceFromCoast}</p>
        </div>

        <br />

        <Button type="submit">Submit form</Button>
      </Form>
    </div>
  );
}

export default GraphForm;

GraphForm.propTypes = {};
