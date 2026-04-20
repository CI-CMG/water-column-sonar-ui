// import { useEffect } from "react";
import {
  useGetAllAnnotationsSearchQuery,
} from '../../services/annotation';
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';
import PropTypes from "prop-types";

function GraphList({
  classification,
  phaseOfDay,
  minAltitude,
  maxAltitude,
  minDistanceFromCoastline,
  maxDistanceFromCoastline,
}) {
  // useEffect(() => {}, []);
  // http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
  const { data: annotations, isLoading } = useGetAllAnnotationsSearchQuery({
    classification: classification, //"AH_School",
    phaseOfDay: phaseOfDay, //"dawn",
    minAltitude: minAltitude, // -100,
    maxAltitude: maxAltitude, // 500,
    minDistanceFromCoastline: minDistanceFromCoastline, // 0,
    maxDistanceFromCoastline: maxDistanceFromCoastline, // 200_000,
    size: 40,
    page: 0,
    sort: "distanceFromCoastline"
  })
  
  if (isLoading) {
    return <div style={{ color: "white" }}>Loading</div>
  }
  
  if (!annotations) {
    return <div style={{ color: "white" }}>No Results Found!</div>
  }

  const listItems = annotations.map((annotation, i) =>
    <GraphCard
      key={i}
      classification={annotation.classification}
      ship={annotation.ship}
      cruise={annotation.cruise}
      instrument={annotation.instrument}
      startTime={annotation.timeStart}
      endTime={annotation.timeEnd}
      localTime={annotation.localTime}
      longitude={annotation.longitude}
      latitude={annotation.latitude}
      depthMin={annotation.depthMin}
      depthMax={annotation.depthMax}
      altitude={annotation.altitude}
      distanceFromCoast={annotation.distanceFromCoastline}
      solarAltitude={annotation.solarAltitude}
      phaseOfDay={annotation.phaseOfDay}
      geometryHash={annotation.geometryHash}
    />
  );

  return (
    <div style={{ minHeight: "400px" }}>
      {listItems !== null ? (
        <CardGroup>
          {listItems}
        </CardGroup>
      ) : (
        <></>
      )}

      <br />
    </div>
  )
}

export default GraphList;

GraphList.propTypes = {
  classification: PropTypes.string.isRequired,
  phaseOfDay:  PropTypes.string.isRequired,
  minAltitude:  PropTypes.number.isRequired,
  maxAltitude:  PropTypes.number.isRequired,
  minDistanceFromCoastline:  PropTypes.number.isRequired,
  maxDistanceFromCoastline:  PropTypes.number.isRequired,
};
