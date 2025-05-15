import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WidgetPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DashboardState {
  widgets: WidgetPosition[];
  selectedLocation: string;
  selectedStocks: string[];
  selectedNewsCategories: string[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

const initialState: DashboardState = {
  widgets: [
    { id: 'weather-current', x: 0, y: 0, width: 1, height: 1 },
    { id: 'weather-forecast', x: 1, y: 0, width: 2, height: 1 },
    { id: 'finance-summary', x: 0, y: 1, width: 1, height: 1 },
    { id: 'finance-chart', x: 1, y: 1, width: 2, height: 1 },
    { id: 'news-headlines', x: 0, y: 2, width: 3, height: 1 },
  ],
  selectedLocation: 'New York',
  selectedStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
  selectedNewsCategories: ['technology', 'business'],
  temperatureUnit: 'celsius',
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateWidgetPositions: (state, action: PayloadAction<WidgetPosition[]>) => {
      state.widgets = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload;
    },
    setSelectedStocks: (state, action: PayloadAction<string[]>) => {
      state.selectedStocks = action.payload;
    },
    addSelectedStock: (state, action: PayloadAction<string>) => {
      if (!state.selectedStocks.includes(action.payload)) {
        state.selectedStocks.push(action.payload);
      }
    },
    removeSelectedStock: (state, action: PayloadAction<string>) => {
      state.selectedStocks = state.selectedStocks.filter(stock => stock !== action.payload);
    },
    setSelectedNewsCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedNewsCategories = action.payload;
    },
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    },
  },
});

export const {
  updateWidgetPositions,
  setSelectedLocation,
  setSelectedStocks,
  addSelectedStock,
  removeSelectedStock,
  setSelectedNewsCategories,
  toggleTemperatureUnit,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;