import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API key would typically come from env variables
const API_KEY = '0ea27c8c6e4d414d8526131516f8127a';
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface NewsQueryParams {
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('X-Api-Key', API_KEY);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<NewsResponse, NewsQueryParams>({
      query: (params) => {
        const { category = 'general', page = 1, pageSize = 10 } = params;
        return `top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}`;
      },
    }),
    searchNews: builder.query<NewsResponse, NewsQueryParams>({
      query: (params) => {
        const { q = '', page = 1, pageSize = 10 } = params;
        return `everything?q=${q}&page=${page}&pageSize=${pageSize}`;
      },
    }),
  }),
});

export const { useGetTopHeadlinesQuery, useSearchNewsQuery } = newsApi;