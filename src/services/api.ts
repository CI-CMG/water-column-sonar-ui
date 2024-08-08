import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// type DPMFStatus = {
//   codec: number,
//   message: string,
// }

// interface DPMFResponse {
//   data: JSON[],
//   status: DPMFStatus,
// }

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    // https://gis.ngdc.noaa.gov/arcgis/rest/services/DEM_mosaics/DEM_global_mosaic/ImageServer/identify?geometry=-39.85499%2C13.21980&geometryType=esriGeometryPoint&returnGeometry=false&returnCatalogItems=false&f=json
    baseUrl: "https://gis.ngdc.noaa.gov/arcgis/rest/services/DEM_mosaics/DEM_global_mosaic/ImageServer/"
  }),

  endpoints: (builder) => ({

    /* --- Cruises --- */
    getCruises: builder.query({
      query: () => 'cruises',
    }),

    /* --- Satellites --- */
    // getSatellites: builder.query<DPMFResponse, { mission: string }>({
    //   query: (arg) => {
    //     const { mission } = arg;
    //     return {
    //       url: 'satellites',
    //       params: { mission },
    //     };
    //   },
    // }),
    getSatellites: builder.query({
      query: () => {
        const geometry="-39.85499,13.21980"
        const geometryType="esriGeometryPoint"
        const returnGeometry = false
        const returnCatalogItems = false
        const f = "json"
        
        return {
          url: 'identify',
          params: { geometry, geometryType, returnGeometry, returnCatalogItems, f }
        }
      },
    }),

  }),
});

export const {
  useGetCruisesQuery,
  useGetSatellitesQuery,
  useLazyGetSatellitesQuery, // Note: "Lazy"
} = api;
