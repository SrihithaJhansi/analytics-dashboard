"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCurrentWeatherQuery } from '@/lib/store/services/weatherApi';
import { useAppSelector, useAppDispatch } from '@/hooks/use-redux';
import { setSelectedLocation, toggleTemperatureUnit } from '@/lib/store/features/dashboardSlice';
import { kelvinToCelsius, kelvinToFahrenheit } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

const getWeatherIcon = (iconCode: string) => {
  const code = iconCode?.substring(0, 2);
  switch (code) {
    case '01': return <Sun className="h-10 w-10 text-yellow-500" />;
    case '02':
    case '03':
    case '04': return <Cloud className="h-10 w-10 text-blue-400" />;
    case '09':
    case '10': return <CloudRain className="h-10 w-10 text-blue-500" />;
    default: return <Cloud className="h-10 w-10 text-gray-400" />;
  }
};

export function CurrentWeather() {
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useAppDispatch();
  const { selectedLocation, temperatureUnit } = useAppSelector(state => state.dashboard);
  
  const { data, isLoading, error } = useGetCurrentWeatherQuery(selectedLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSelectedLocation(searchInput));
      setSearchInput('');
    }
  };

  const handleToggleUnit = () => {
    dispatch(toggleTemperatureUnit());
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading weather data. Please try a different location.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Current Weather</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleToggleUnit}
          >
            °{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit" size="sm">Search</Button>
        </form>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-16 w-1/3" />
              <Skeleton className="h-16 w-1/3" />
              <Skeleton className="h-16 w-1/3" />
            </div>
          </div>
        ) : data ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="text-2xl font-bold">{data.name}, {data.sys.country}</div>
            
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                {getWeatherIcon(data.weather[0].icon)}
                <div className="ml-3">
                  <div className="text-sm text-muted-foreground capitalize">{data.weather[0].description}</div>
                </div>
              </motion.div>
              <div className="text-4xl font-bold">
                {temperatureUnit === 'celsius' 
                  ? `${kelvinToCelsius(data.main.temp)}°C` 
                  : `${kelvinToFahrenheit(data.main.temp)}°F`}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
                <Wind className="h-5 w-5 text-blue-500 mb-1" />
                <div className="text-sm text-muted-foreground">Wind</div>
                <div className="font-medium">{data.wind.speed} m/s</div>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
                <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                <div className="text-sm text-muted-foreground">Humidity</div>
                <div className="font-medium">{data.main.humidity}%</div>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
                <Sun className="h-5 w-5 text-yellow-500 mb-1" />
                <div className="text-sm text-muted-foreground">Feels Like</div>
                <div className="font-medium">
                  {temperatureUnit === 'celsius' 
                    ? `${kelvinToCelsius(data.main.feels_like)}°C` 
                    : `${kelvinToFahrenheit(data.main.feels_like)}°F`}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </CardContent>
    </Card>
  );
}