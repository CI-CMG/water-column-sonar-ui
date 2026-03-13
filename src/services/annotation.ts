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

type AnnotationResponse = Annotation[]

// http://localhost:8080/api/v1/annotation/all?size=10&page=0
// http://localhost:8080/api/v1/annotation/search?classification=AH_School&phaseOfDay=dawn&minAltitude=-100.0&maxAltitude=500.0&minDistanceFromCoastline=0&maxDistanceFromCoastline=200000&page=0&size=10
//  classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size
export const annotationApi = api.injectEndpoints({
  endpoints: (build) => ({

    /* Returns all the annotations in the database */
    getAllAnnotations: build.query<AnnotationResponse, { size: number, page: number }>({
      query: (arg) => {
        const { size, page } = arg;
        return {
          url: 'annotation/all',
          params: { size, page }
        };
      },
      
      transformResponse: (response: { content: AnnotationResponse }, meta, arg) => response.content,
      
      providesTags: (result = []) => [
        ...result.map(({ geometryHash }) => ({ type: 'Annotation', geometryHash }) as const),
        { type: 'Annotation' as const, geometryHash: 'LIST' },
      ],
    }),

    /* For the UI demo, returns searched results */
    // classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size
    // TODO: add 
    getAllAnnotationsSearch: build.query<AnnotationResponse, { classification: string, phaseOfDay: string, minAltitude: number, maxAltitude: number, minDistanceFromCoastline: number, maxDistanceFromCoastline: number, size: number, page: number }>({
      query: (arg) => {
        const { classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size } = arg;
        return {
          url: 'annotation/all',
          params: { classification, phaseOfDay, minAltitude, maxAltitude, minDistanceFromCoastline, maxDistanceFromCoastline, page, size }
        };
      },
      
      transformResponse: (response: { content: AnnotationResponse }, meta, arg) => response.content,
      
      providesTags: (result = []) => [
        ...result.map(({ geometryHash }) => ({ type: 'Annotation', geometryHash }) as const),
        { type: 'Annotation' as const, geometryHash: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetAllAnnotationsQuery,
  useGetAllAnnotationsSearchQuery, // for the graph demo
} = annotationApi

export const {
  endpoints: {
    getAllAnnotations,
    getAllAnnotationsSearch,
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