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
    // baseUrl: "https://gis.ngdc.noaa.gov/arcgis/rest/services/DEM_mosaics/DEM_global_mosaic/ImageServer/"
    baseUrl: "`https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${shipName}/${cruiseName}/${sensorName}/${cruiseName}.zarr`"
  }),

  endpoints: (builder) => ({

    /* --- Cruises --- */
    getCruises: builder.query({
      query: () => 'cruises',
    }),

    /* --- Satellites --- */
    getSatellites: builder.query({
      query: (args) => {
        
        return {
          url: 'identify',
          params: args,
        }
      },
    }),

    getZarr: builder.query({
      query: (args) => {
        return {
          url: 'identify',
          params: args,
        }
      },
    })

  }),
});

export const {
  useGetCruisesQuery,
  useGetSatellitesQuery,
  useLazyGetSatellitesQuery, // Note: "Lazy"
} = api;
