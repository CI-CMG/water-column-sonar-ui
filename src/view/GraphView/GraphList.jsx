import {
  useGetAllAnnotationsSearchQuery,
} from '../../services/annotation';
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';

function GraphList() {
  
  // http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
  const { data: annotations, isLoading } = useGetAllAnnotationsSearchQuery({
    classification: "AH_School",
    phaseOfDay: "dawn",
    minAltitude: -100,
    maxAltitude: 500,
    minDistanceFromCoastline: 0,
    maxDistanceFromCoastline: 200_000,
    size: 20,
    page: 0
  })
  
  if (isLoading) {
    return <div>Loading</div>
  }
  
  if (!annotations) {
    return <div>No Results Found!</div>
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
    <>
      {annotations !== null ? (
        <CardGroup>
          {listItems}
        </CardGroup>
      ) : (
        <></>
      )}
    </>
  )
}

export default GraphList;

GraphList.propTypes = {};
