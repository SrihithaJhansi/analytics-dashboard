import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API key would typically come from env variables
const API_KEY = '1635890035cbba097fd5c26c8ea672a1';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

export interface GeoLocation {
  lat: number;
  lon: number;
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherResponse, string | GeoLocation>({
      query: (location) => {
        if (typeof location === 'string') {
          return `weather?q=${location}&appid=${API_KEY}`;
        } else {
          return `weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
        }
      },
    }),
    getForecast: builder.query<ForecastResponse, string | GeoLocation>({
      query: (location) => {
        if (typeof location === 'string') {
          return `forecast?q=${location}&appid=${API_KEY}`;
        } else {
          return `forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
        }
      },
    }),
  }),
});

export const { useGetCurrentWeatherQuery, useGetForecastQuery } = weatherApi;