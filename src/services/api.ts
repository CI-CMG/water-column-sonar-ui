/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable camelcase */
// https://redux-toolkit.js.org/tutorials/rtk-query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import * as qs from 'qs'
import { config } from '../config';

// https://codesandbox.io/s/github/reduxjs/redux-toolkit/tree/master/examples/query/react/authentication-with-extrareducers?from-embed=&file=/src/app/services/auth.ts
// type DPMFData = {
//   _mission: string,
//   id: number,
//   instruments: string[],
//   mission_id: number,
//   name: string
// }
type DPMFStatus = {
  codec: number,
  message: string,
}
interface DPMFResponse {
  data: JSON[],
  status: DPMFStatus,
}

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: `${config.DPMF_API_URL}`,
  }),

  tagTypes: ['Instruments', 'Satellites', 'ProductCheck', 'Media'],

  endpoints: (builder) => ({

    /* --- Missions --- */
    getMissions: builder.query({
      query: () => 'missions',
    }),

    /* --- Satellites --- */
    getSatellites: builder.query<DPMFResponse, { mission: string }>({
      query: (arg) => {
        const { mission } = arg;
        return {
          url: 'satellites',
          params: { mission },
        };
      },
      // keepUnusedDataFor: 60, // manual spec for cache life in seconds
      // refetchOnMountOrArgChange: 30,
      providesTags: ['Satellites', 'Instruments'],
    }),

    /* --- Instruments --- */
    getInstruments: builder.query<DPMFResponse, { sat: string }>({
      query: (arg) => {
        const { sat } = arg;
        return {
          url: 'instruments',
          params: { sat },
        };
      },
      providesTags: ['Instruments'],
    }),

    /* --- Products --- */
    getProducts: builder.query<DPMFResponse, { sat: string, inst: string }>({
      query: (arg) => {
        const { sat, inst } = arg;
        return {
          url: 'products',
          params: { sat, inst },
        };
      },
    }),

    /* --- Parameters --- */
    getParameters: builder.query<DPMFResponse, { sat: string, inst: string, prod: string }>({
      query: (arg) => {
        const { sat, inst, prod } = arg;
        return {
          url: 'parameters',
          params: { sat, inst, prod },
        };
      },
    }),

    /* --- Files --- */
    getFiles: builder.query<
      DPMFResponse,
      {
        sat: string,
        inst: string,
        prod: string,
        start_time: string,
        end_time: string,
      }>({
        query: (arg) => {
          const {
            sat, inst, prod, start_time, end_time,
          } = arg;
          return {
            url: 'files',
            params: {
              sat, inst, prod, start_time, end_time,
            },
          };
        },
      }),

    /* --- Values --- */// let url = `${base_url}/values?format=json&map_flag=1`
    getValues: builder.query<
      DPMFResponse,
      {
        start_time: string,
        end_time: string,
        parameters: string,
        criteria: string,
        map_flag: number,
        format: string,
        time_format: string,
      }>({
        query: (arg) => {
          const {
            start_time, end_time, parameters, criteria, map_flag, format, time_format,
          } = arg;
          return {
            url: 'values',
            params: {
              start_time, end_time, parameters, criteria, map_flag, format, time_format,
            },
          };
        },
      }),

    /* --- Product Checks --- */
    getProductCheck: builder.query<
      DPMFResponse,
      {
        start_date: string,
        end_date: string,
        sat: string,
        inst: string,
      }>({
        query: (arg) => {
          const {
            start_date, end_date, sat, inst,
          } = arg;
          return {
            url: 'product_check',
            params: {
              start_date, end_date, sat, inst,
            },
          };
        },
        providesTags: ['ProductCheck'],
      }),

    /* --- Media --- */
    getMedia: builder.query<
      DPMFResponse,
      {
        date: string,
        sat: string,
        inst: string,
        period: string,
        use_layout: string,
      }>({
        query: (arg) => {
          const {
            date, sat, inst, period, use_layout,
          } = arg;
          return {
            url: 'media',
            params: {
              date, sat, inst, period, use_layout,
            },
          };
        },
        providesTags: ['Media'],
      }),
  }),
});

export const {
  useGetMissionsQuery,
  useGetSatellitesQuery,
  useLazyGetSatellitesQuery, // Note: "Lazy"
  useGetInstrumentsQuery,
  useLazyGetInstrumentsQuery, // Note: "Lazy"
  useGetProductsQuery,
  useGetParametersQuery,
  useGetFilesQuery,
  useLazyGetFilesQuery, // Note: Lazy
  useGetValuesQuery,
  useLazyGetValuesQuery, // Note: Lazy
  useGetProductCheckQuery,
  useGetMediaQuery,
} = api;
