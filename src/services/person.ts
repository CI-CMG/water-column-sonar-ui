// import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export interface Person {
  username: string,
  email: string,
  role: string,
  version: number
}

type PersonResponse = Person[]

// "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20"
export const personApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPerson: build.query<PersonResponse, number>({
      query: (size) => ({ url: `person?size=${size}` }),
      transformResponse: (response: { content: PersonResponse }, meta, arg) => response.content,
      providesTags: (result = []) => [
        ...result.map(({ username }) => ({ type: 'Person', username }) as const),
        { type: 'Person' as const, username: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetPersonQuery,
} = personApi

export const {
  endpoints: {
    getPerson,
  },
} = personApi


// "content": [
//     {
//       "username": "rudy.klucik",
//       "email": "rudy.klucik@noaa.gov",
//       "role": "Software Engineer",
//       "version": 2
//     },
//     {
//       "username": "alexander.hoelzemann",
//       "email": "alexander.hoelzemann@colorado.edu",
//       "role": "Post Doctoral Researcher",
//       "version": 2
//     }
//   ],