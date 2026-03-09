import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Multiselect from 'react-bootstrap-multiselect'
// Reference for multiselect:
//  https://projects.skratchdot.com/react-bootstrap-multiselect/

function GraphForm() {
  const [field, setField] = useState([]);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    // const form = event.currentTarget;
    const checkedValues = Array.from(event.target.group1).map(el => [
      el.id,
      el.checked
    ]);
    console.log(Object.fromEntries(checkedValues));
  };


  return (
    <div className="GraphForm" >
      <p style={{ color: "white" }}>Query the Knowledge Graph</p>

      <Form style={{ color: "white" }} onSubmit={handleSubmit}>
        <Form.Label>Phase of the Day</Form.Label>
        <div key={`inline-checkbox`} className="mb-3">
          <Form.Check
            inline
            checked
            label="Night"
            name="group1"
            type="checkbox"
            id="inline-checkbox-1"
          />
          <Form.Check
            inline
            label="Dawn"
            name="group1"
            type="checkbox"
            id="inline-checkbox-2"
          />
          <Form.Check
            inline
            label="Day"
            name="group1"
            type="checkbox"
            id="inline-checkbox-3"
          />
          <Form.Check
            inline
            label="Dusk"
            name="group1"
            type="checkbox"
            id="inline-checkbox-4"
          />
        </div>
        <Button type="submit">Submit form</Button>
      </Form>

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
    </div>
  );
}

export default GraphForm;

GraphForm.propTypes = {};
