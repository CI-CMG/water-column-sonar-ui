import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
// import { RootState } from '../store'

// https://codesandbox.io/p/sandbox/github/reduxjs/redux-toolkit/tree/master/examples/query/react/kitchen-sink?from-embed


// http://localhost:8080/api/v1/person

const baseQuery = fetchBaseQuery({
  // baseUrl: 'https://pokeapi.co/api/v2/',
  // TODO: parameterize this...
  // baseUrl: 'https://localhost:8080/api/v1/'
  // https://ec2-3-93-164-150.compute-1.amazonaws.com:8080/api/v1/annotations
  // baseUrl: 'https://ec2-3-93-164-150.compute-1.amazonaws.com:8080/api/v1/'
  baseUrl: 'https://api.echo.fish:8080/api/v1/'
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 })

export const api = createApi({
  reducerPath: 'splitApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Pokemon', 'Person', 'Annotation'],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({}),
})

export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({
    // getPokemon: () => 'test',
  }),
})
