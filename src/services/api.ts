import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'

// https://codesandbox.io/p/sandbox/github/reduxjs/redux-toolkit/tree/master/examples/query/react/kitchen-sink?from-embed

// https://api.echo.fish/api/v1/annotations/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-497&maxAltitude=395&minDistanceFromCoastline=42&maxDistanceFromCoastline=157942&page=1&size=2&sort=distanceFromCoastline
// {"content":[{id: 0}, {id: 1}],"empty":false,"first":false,"last":false,"number":1,"numberOfElements":2,"pageable":{"offset":2,"pageNumber":1,"pageSize":2,"paged":true,"sort":{"empty":false,"sorted":true,"unsorted":false},"unpaged":false},"size":2,"sort":{"empty":false,"sorted":true,"unsorted":false},"totalElements":93,"totalPages":47}
// https://redux-toolkit.js.org/rtk-query/usage/pagination

const baseQuery = fetchBaseQuery({
  // TODO: parameterize this...
  // baseUrl: 'https://localhost:8080/api/v1/'
  baseUrl: 'https://api.echo.fish/api/v1/'
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
