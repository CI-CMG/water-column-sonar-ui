import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";

function GraphCard({
  classification="fish_school",
  ship="Henry_B._Bigelow",
  cruise="HB1906",
  instrument="EK60",
  startTime="2025-02-06 10:50:00",
  endTime="2025-02-06 10:51:00",
  localTime="2019-09-25T10:02:06.60",
  longitude=-69.80750,
  latitude=41.79967,
  depthMin=11.12,
  depthMax=13.15,
  altitude=1.23,
  distanceFromCoast=250,
  solarAltitude=35.02,
  phaseOfDay="day",
  geometryHash="1d4b073ae6dda69972e42d4f707134640c1897c63b04c620d355dc527f7ef4ed",
}) {
  return (
    <div className="GraphCard">
      <Card
        style={{ width: '18rem' }}
        bg="light"
        text='dark'
        className="m-2"
      >
        <Card.Img
          variant="top"
          src={`https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/${geometryHash}.jpeg`}
        />
        <Card.Body>
          <Card.Text className="text-center">
            <strong>&quot;{classification}&quot;</strong>
            <br />
            {ship} | {cruise} | {instrument}
            <br />
            {startTime} to {endTime}
            <br />
            (local time: {localTime})
            <br />
            coordinates: {longitude}° E, {latitude}° N
            <br />
            depth: [{depthMin}, {depthMax}] m | altitude: {altitude} m
            <br />
            distance from coast: {distanceFromCoast} m
            <br />
            solar altitude: {solarAltitude}° | phase: {phaseOfDay}
            <br />
            {/* TODO: need to convert time to ping_time */}
            <Card.Link
              href={`/water-column?ship=${ship}&cruise=${cruise}&sensor=${instrument}&frequency=0&color=2&time=3974082`}
              target="_blank"
            >
              View in the water column →
            </Card.Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default GraphCard;

GraphCard.propTypes = {
  classification: PropTypes.string.isRequired,
  ship: PropTypes.string.isRequired,
  cruise: PropTypes.string.isRequired,
  instrument: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  localTime: PropTypes.string.isRequired,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  depthMin: PropTypes.number.isRequired,
  depthMax: PropTypes.number.isRequired,
  altitude: PropTypes.number.isRequired,
  distanceFromCoast: PropTypes.number.isRequired,
  solarAltitude: PropTypes.number.isRequired,
  phaseOfDay: PropTypes.string.isRequired,
  geometryHash: PropTypes.string.isRequired,
};
