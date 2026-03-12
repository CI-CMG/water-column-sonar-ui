import {
  // useGetPokemonQuery,
  useGetAnnotationQuery,
} from '../../services/annotation';

function GraphList() {
  
  const { data: pokemon, isLoading } = useGetAnnotationQuery({ size: 10, page: 0 })
  
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
