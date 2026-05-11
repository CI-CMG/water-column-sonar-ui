// import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export interface Annotation {
  geometryHash: string,
  altitude: number,
  classification: string,
  cruise: string,
  depthMax: number,
  depthMin: number,
  distanceFromCoastline: number,
  filename: string,
  instrument: string,
  latitude: number,
  localTime: string,
  longitude: number,
  month: number,
  phaseOfDay: string,
  pointCount: number,
  regionId: number,
  ship: string,
  solarAltitude: number,
  timeEnd: string,
  timeStart: string,
  version: number
}

export interface sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface pageable {
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  sort: sort
}

// type AnnotationResponse = Annotation[]

export interface ListResponse<T> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number  // <-- current page number
  numberOfElements: number
  pageable: pageable
  size: number
  sort: sort
  totalElements: number,
  totalPages: number  // <-- total pages
}

// http://localhost:8080/api/v1/annotation/all?size=10&page=0
// http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
//  classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size
export const annotationApi = api.injectEndpoints({
  endpoints: (build) => ({

    /* Returns all the annotations in the database */
    // getAllAnnotations: build.query<AnnotationResponse, { size: number, page: number }>({
    //   query: (arg) => {
    //     const { size, page } = arg;
    //     return {
    //       url: 'annotations/all',
    //       params: { size, page }
    //     };
    //   },
      
    //   transformResponse: (response: { content: AnnotationResponse }, meta, arg) => response.content,
      
    //   providesTags: (result = []) => [
    //     ...result.map(({ geometryHash }) => ({ type: 'Annotation', geometryHash }) as const),
    //     { type: 'Annotation' as const, geometryHash: 'LIST' },
    //   ],
    // }),

    /* For the UI demo, returns searched results */
    // classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size
    // TODO: add 
    getAnnotationsSearch: build.query<ListResponse<Annotation>, { classification: string, phaseOfDay: string, minAltitude: number, maxAltitude: number, minDistanceFromCoastline: number, maxDistanceFromCoastline: number, size: number, page: number, sort: string }>({
      query: (arg) => {
        const { classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size, sort } = arg;
        return {
          url: 'annotations/search',
          params: { classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size, sort }
        };
      },
      
      // transformResponse: (response: { content: AnnotationResponse }, meta, arg) => response.content,
      
      // providesTags: (result = []) => [
      //   ...result.map(({ geometryHash }) => ({ type: 'Annotation', geometryHash }) as const),
      //   { type: 'Annotation' as const, geometryHash: 'LIST' },
      // ],
    }),
  }),
})

export const {
  // useGetAllAnnotationsQuery,
  useGetAnnotationsSearchQuery, // for the graph demo
} = annotationApi

export const {
  endpoints: {
    // getAllAnnotations,
    getAnnotationsSearch,
  },
} = annotationApi

// {
//   "content": [
//     {
//       "geometryHash": "e78ee8839c5bd4931b0a790dabe334d5f9200e80b9e4057e5e1a62f60a14e5cf",
//       "altitude": -2.88,
//       "classification": "Unclassified regions",
//       "cruise": "HB1906",
//       "depthMax": 14.0,
//       "depthMin": 8.0,
//       "distanceFromCoastline": 250,
//       "filename": "d20190925_t135327-t233118_Zsc-DWBA-Schools_All-RegionDefs.evr",
//       "instrument": "EK60",
//       "latitude": 41.5304,
//       "localTime": "2019-09-25T10:02:06.601000-04:00",
//       "longitude": -71.3186,
//       "month": 9,
//       "phaseOfDay": "day",
//       "pointCount": 15,
//       "regionId": 2,
//       "ship": "Henry_B._Bigelow",
//       "solarAltitude": 35.02,
//       "timeEnd": "2019-09-25T14:02:57.165800",
//       "timeStart": "2019-09-25T14:02:06.601000",
//       "version": 1
//     },

// Example with pagination:
// {
//   "content": [
//     {
//       "id": "8e107f16-0340-4e07-91d0-1c819e30f999",
//       "version": 1,
//       "geometryHash": "147f3add26a359b8a1933a39894709937e49cba1f7c54824cfb8f4975284c2ff",
//       "altitude": 2.17,
//       "classification": "AH_School",
//       "cruise": "HB1906",
//       "depthMax": 34,
//       "depthMin": 30,
//       "distanceFromCoastline": 3002,
//       "filename": "d20191101_t001355-t115511_Zsc-DWBA-Schools_All-RegionDefs.evr",
//       "instrument": "EK60",
//       "latitude": 42.71754,
//       "localTime": "2019-11-01T07:18:13.813000-04:00",
//       "longitude": -70.65144,
//       "month": 11,
//       "phaseOfDay": "dawn",
//       "pointCount": 33,
//       "regionId": 65,
//       "ship": "Henry_B._Bigelow",
//       "solarAltitude": -0.5,
//       "timeEnd": "2019-11-01 11:18:19.819500",
//       "timeStart": "2019-11-01 11:18:13.813000"
//     }
//   ],
//   "empty": false,
//   "first": false,
//   "last": false,
//   "number": 3,
//   "numberOfElements": 1,
//   "pageable": {
//     "offset": 3,
//     "pageNumber": 3,
//     "pageSize": 1,
//     "paged": true,
//     "sort": {
//       "empty": false,
//       "sorted": true,
//       "unsorted": false
//     },
//     "unpaged": false
//   },
//   "size": 1,
//   "sort": {
//     "empty": false,
//     "sorted": true,
//     "unsorted": false
//   },
//   "totalElements": 93,
//   "totalPages": 93
// }