import {
  useGetAllAnnotationsSearchQuery,
} from '../../services/annotation';
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';
import PropTypes from "prop-types";
import Pagination from 'react-bootstrap/Pagination';

function GraphList({
  classification,
  phaseOfDay,
  minAltitude,
  maxAltitude,
  minDistanceFromCoastline,
  maxDistanceFromCoastline,
}) {
  // Pagination
  let active = 1;
  let items = [];
  for (let number = 1; number <= 5; number++) {
  items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }
  // end Pagination

  // useEffect(() => {}, []);
  // http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
  const { data: annotations, isLoading } = useGetAllAnnotationsSearchQuery({
    classification: classification, //"AH_School",
    phaseOfDay: phaseOfDay, //"dawn",
    minAltitude: minAltitude, // -100,
    maxAltitude: maxAltitude, // 500,
    minDistanceFromCoastline: minDistanceFromCoastline, // 0,
    maxDistanceFromCoastline: maxDistanceFromCoastline, // 200_000,
    size: 20,
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
        <>
          <CardGroup>
            {listItems}
          </CardGroup>
          <br />
          <p style={{ color: "grey", fontSize: "0.9em" }}>Results are paginated but only the top 20 will be returned.</p>
        </>
      ) : (
        <></>
      )}

      <br />
      {/* <Pagination>{items}</Pagination>
      <br />
      <Pagination>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Item>{4}</Pagination.Item>
        <Pagination.Item active>{5}</Pagination.Item>
        <Pagination.Item>{6}</Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Item>{10}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination> */}
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
