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

  const listItems = pokemon.map(pok => <p key={pok.name}>{pok.name}</p>);

  return (
    <div>
      {pokemon !== null ? (
        <>{listItems}</>
      ) : (
        <></>
      )}
    </div>
  )
}

export default GraphPokemon;

GraphPokemon.propTypes = {};
