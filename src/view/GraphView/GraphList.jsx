import {
  useGetAllAnnotationsSearchQuery,
} from '../../services/annotation';

function GraphList() {
  
  // http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
  const { data: pokemon, isLoading } = useGetAllAnnotationsSearchQuery({
    classification: "AH_School",
    phaseOfDay: "dawn",
    minAltitude: -100,
    maxAltitude: 500,
    minDistanceFromCoastline: 0,
    maxDistanceFromCoastline: 200_000,
    size: 10,
    page: 0
  })
  
  if (isLoading) {
    return <div>Loading</div>
  }
  
  if (!pokemon) {
    return <div>No Results</div>
  }

  const listItems = pokemon.map((pok, i) => <p key={i}>{pok.depthMax}</p>);

  return (
    <div>
      {pokemon !== null ? (
        <div>{listItems}</div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default GraphList;

GraphList.propTypes = {};
