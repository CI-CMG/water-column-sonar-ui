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
  // useEffect(() => {
  //   setCurrentPage(0);

  // }, [initialPage]);

  // const [totalPages, setTotalPages] = useState(0);
  const paginationPrevious = () => {
    // let currentPage = annotations.number;
    // console.log(`${currentPage}`)

    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // dispatch(updateSearchPage(currentPage - 1))
    }
  }
  const paginationNext = () => {
    // let currentPage = annotations.number;
    let totalPages = annotations.totalPages;
    // console.log(`${currentPage}, ${totalPages}`);

    if (currentPage < totalPages - 1) {
      setCurrentPage(annotations.number + 1);
      // dispatch(updateSearchPage(currentPage + 1))
    }
  }

  // http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
  const { data: annotations, isLoading } = useGetAnnotationsSearchQuery({
    classification: classification, //"AH_School",
    phaseOfDay: phaseOfDay, //"dawn",
    minAltitude: minAltitude, // -100,
    maxAltitude: maxAltitude, // 500,
    minDistanceFromCoastline: minDistanceFromCoastline, // 0,
    maxDistanceFromCoastline: maxDistanceFromCoastline, // 200_000,
    size: 20,
    page: currentPage,
    sort: "distanceFromCoastline"
  })
  
  if (isLoading) {
    // console.log(`page: ${page}`)
    return <div style={{ color: "white" }}>Loading</div>
  }
  
  if (annotations.content.length === 0) {
    console.log('no annotations');
    // setCurrentPage(0);
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
        <Pagination.Prev onClick={() => paginationPrevious()} />
        <Pagination.Item active>{annotations.number}</Pagination.Item>
        <Pagination.Next onClick={() => paginationNext()} />
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
  // initialPage: PropTypes.number.isRequired,
};
