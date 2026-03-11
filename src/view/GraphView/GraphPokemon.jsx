import {
  useGetPokemonQuery,
} from '../../services/pokemon';

function GraphPokemon() {
  
  const { data: pokemon, isLoading } = useGetPokemonQuery(5)
  
  if (isLoading) {
    return <div>Loading</div>
  }
  
  if (!pokemon) {
    return <div>No posts</div>
  }

  return (
    <div>
      {pokemon !== null ? (
        <p>{pokemon[0]['name']}</p>
      ) : (
        <></>
      )}
    </div>
  )
}

export default GraphPokemon;

GraphPokemon.propTypes = {};
