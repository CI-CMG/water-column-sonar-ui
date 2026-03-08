import { useState } from "react";
import Form from "react-bootstrap/Form";
// import Multiselect from 'react-bootstrap-multiselect'
// Reference for multiselect:
//  https://projects.skratchdot.com/react-bootstrap-multiselect/

function GraphForm() {
  const [field, setField] = useState([]);

  return (
    <div className="GraphForm">
      <p style={{ color: "white" }}>Query the Knowledge Graph</p>

      <Form style={{ color: "white" }}>
        <div key={`inline-checkbox`} className="mb-3">
          <Form.Check
            inline
            label="Night"
            name="group1"
            type="checkbox"
            id={`inline-checkbox-1`}
          />
          <Form.Check
            inline
            label="Dawn"
            name="group1"
            type="checkbox"
            id={`inline-checkbox-2`}
          />
          <Form.Check
            inline
            label="Day"
            name="group1"
            type="checkbox"
            id={`inline-checkbox-3`}
          />
          <Form.Check
            inline
            label="Dusk"
            name="group1"
            type="checkbox"
            id={`inline-checkbox-4`}
          />
        </div>
      </Form>

      <Form.Select aria-label="Default select example">
        <option>Phase of the Day</option>
        <option value="1">Night</option>
        <option value="2">Dawn</option>
        <option value="3">Day</option>
        <option value="4">Dusk</option>
      </Form.Select>

      <br />

      <Form.Select aria-label="Default select example">
        <option>Classification</option>
        <option value="1">AH_School</option>
        <option value="2">Unclassified</option>
        <option value="3">fish_school</option>
        <option value="4">possible_herring</option>
      </Form.Select>

      <br />

      <div style={{ color: "white" }}>
        <Form.Label>Altitude</Form.Label>
        <Form.Range min="0" max="200" step="10" id="customRange3" />
      </div>

      <br />

      <div style={{ color: "white" }}>
        <Form.Label>Distance From the Coast</Form.Label>
        <Form.Range min="0" max="1000" step="100" id="customRange3" />
      </div>

      <br />

      {/* <Form style={{ color: "white" }}>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Include Unknown"
          default={true}
        />
      </Form> */}
    </div>
  );
}

export default GraphForm;

GraphForm.propTypes = {};
