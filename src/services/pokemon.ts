// import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export interface Pokemon {
  name: string
  url: string
}

type PokemonResponse = Pokemon[]

// "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20"
export const pokemonApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPokemon: build.query<PokemonResponse, number>({
      query: (limit) => ({ url: `pokemon/?limit=${limit}` }),
      transformResponse: (response: { results: PokemonResponse }, meta, arg) => response.results,
      providesTags: (result = []) => [
        ...result.map(({ name }) => ({ type: 'Pokemon', name }) as const),
        { type: 'Pokemon' as const, name: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetPokemonQuery,
} = pokemonApi

export const {
  endpoints: {
    getPokemon,
  },
} = pokemonApi
