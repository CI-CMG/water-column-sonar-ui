import Form from "react-bootstrap/Form";

function GraphForm() {
  return (
    <div className="GraphForm">
      <p style={{ color: "white" }}>Query the Knowledge Graph</p>

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
        <Form.Range min="0" max="200" step="10" value="100" id="customRange3" />
      </div>
      <br />
      <div style={{ color: "white" }}>
        <Form.Label>Distance From the Coast</Form.Label>
        <Form.Range
          min="0"
          max="1000"
          step="100"
          value="200"
          id="customRange3"
        />
      </div>
      <br />
      <Form style={{ color: "white" }}>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Include Unknown"
          default={true}
        />
      </Form>
    </div>
  );
}

export default GraphForm;

GraphForm.propTypes = {};
