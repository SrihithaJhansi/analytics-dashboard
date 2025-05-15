import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API key would typically come from env variables
const API_KEY = process.env.NEXT_PUBLIC_FINANCE_API_KEY || '';

const BASE_URL = 'https://www.alphavantage.co';

export interface StockQuote {
  symbol: string;
  open: string;
  high: string;
  low: string;
  price: string;
  volume: string;
  latestTradingDay: string;
  previousClose: string;
  change: string;
  changePercent: string;
}

export interface StockTimeSeriesData {
  [date: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
}

export interface StockTimeSeriesResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Interval'?: string;
    '5. Output Size': string;
    '6. Time Zone': string;
  };
  'Time Series (Daily)': StockTimeSeriesData;
  'Time Series (60min)'?: StockTimeSeriesData;
  'Time Series (5min)'?: StockTimeSeriesData;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

export interface StockSearchResponse {
  bestMatches: StockSearchResult[];
}

export const financeApi = createApi({
  reducerPath: 'financeApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getStockQuote: builder.query<StockQuote, string>({
      query: (symbol) => `query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
      transformResponse: (response: any) => {
        const data = response['Global Quote'];
        return {
          symbol: data['01. symbol'],
          open: data['02. open'],
          high: data['03. high'],
          low: data['04. low'],
          price: data['05. price'],
          volume: data['06. volume'],
          latestTradingDay: data['07. latest trading day'],
          previousClose: data['08. previous close'],
          change: data['09. change'],
          changePercent: data['10. change percent'],
        };
      },
    }),
    getStockTimeSeries: builder.query<StockTimeSeriesResponse, { symbol: string; interval?: string }>({
      query: ({ symbol, interval = 'daily' }) => {
        const functionName = 
          interval === 'daily' 
            ? 'TIME_SERIES_DAILY' 
            : interval === 'hourly' 
              ? 'TIME_SERIES_INTRADAY&interval=60min' 
              : 'TIME_SERIES_INTRADAY&interval=5min';
        
        return `query?function=${functionName}&symbol=${symbol}&apikey=${API_KEY}`;
      },
    }),
    searchStocks: builder.query<StockSearchResponse, string>({
      query: (keywords) => `query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`,
    }),
  }),
});

export const { 
  useGetStockQuoteQuery, 
  useGetStockTimeSeriesQuery,
  useSearchStocksQuery,
} = financeApi;