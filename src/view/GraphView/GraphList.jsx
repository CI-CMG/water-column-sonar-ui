import {
  useEffect,
  useState,
  // useEffect,
} from 'react';
import {
  useGetAnnotationsSearchQuery,
} from '../../services/annotationApi';
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';
import PropTypes from "prop-types";
import Pagination from 'react-bootstrap/Pagination';
// import { useAppDispatch, useAppSelector } from "../../app/hooks";
// import {
//   updateSearchPage,
//   selectSearchPage,
// } from "../../reducers/graph/graphSlice";

function GraphList({
  classification,
  phaseOfDay,
  minAltitude,
  maxAltitude,
  minDistanceFromCoastline,
  maxDistanceFromCoastline,
  // initialPage,
}) {
  // const dispatch = useAppDispatch();
  // const page = useAppSelector(selectSearchPage);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);

  // const [totalPages, setTotalPages] = useState(0);
  const paginationPrevious = () => {
    // setTotalPages(annotations.totalPages);
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }
  const paginationNext = () => {
    let totalPages = annotations.totalPages;
    // setTotalPages(annotations.totalPages);

    if (currentPage < totalPages - 1) {
      setCurrentPage(annotations.number + 1);
    }
  }

  useEffect(() => {
    // console.log(`loading: ${currentPage}, totalPages: ${totalPages}`);
    console.log('request values changed')
    setCurrentPage(0);

  }, [classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline]);

  // http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
  const { data: annotations, error, isLoading } = useGetAnnotationsSearchQuery({
    classification: classification, //"AH_School",
    phaseOfDay: phaseOfDay, //"dawn",
    minAltitude: minAltitude, // -100,
    maxAltitude: maxAltitude, // 500,
    minDistanceFromCoastline: minDistanceFromCoastline, // 0,
    maxDistanceFromCoastline: maxDistanceFromCoastline, // 200_000,
    size: 20,
    page: currentPage,
    sort: "distanceFromCoastline"
  });

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading</div>
  }

  if (error) {
    console.log('error!!!!')
  }
  
  if (annotations.content.length === 0) {
    return <div style={{ color: "white" }}>No Results Found!</div>
  }

  const listItems = annotations.content.map((annotation, i) =>
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

          <p style={{ color: "grey", fontSize: "0.9em" }}>Current page: {annotations.number}, Total pages: {annotations.totalPages - 1}</p>
        </>
      ) : (
        <></>
      )}

      <Pagination>
        {(annotations.number === 0) ? (
          <>
            <Pagination.Prev disabled onClick={() => paginationPrevious()} />
          </>
        ) : (
          <>
            <Pagination.Prev onClick={() => paginationPrevious()} />
          </>
        )}
        <Pagination.Item active>{annotations.number}</Pagination.Item>
        {( annotations.number === annotations.totalPages - 1 ) ? (
          <>
            <Pagination.Next disabled onClick={() => paginationNext()} />
          </>
        ) : (
          <>
            <Pagination.Next onClick={() => paginationNext()} />
          </>
        )}
      </Pagination>
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
