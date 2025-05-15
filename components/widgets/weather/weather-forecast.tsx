"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetForecastQuery } from '@/lib/store/services/weatherApi';
import { useAppSelector } from '@/hooks/use-redux';
import { kelvinToCelsius, kelvinToFahrenheit, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';

const getWeatherIcon = (iconCode: string) => {
  const code = iconCode?.substring(0, 2);
  switch (code) {
    case '01': return <Sun className="h-6 w-6 text-yellow-500" />;
    case '02':
    case '03':
    case '04': return <Cloud className="h-6 w-6 text-blue-400" />;
    case '09':
    case '10': return <CloudRain className="h-6 w-6 text-blue-500" />;
    default: return <Cloud className="h-6 w-6 text-gray-400" />;
  }
};

export function WeatherForecast() {
  const { selectedLocation, temperatureUnit } = useAppSelector(state => state.dashboard);
  const { data, isLoading, error } = useGetForecastQuery(selectedLocation);

  const getDailyForecast = () => {
    if (!data) return [];
    
    // Group by day
    const days: {[key: string]: any} = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!days[date]) {
        days[date] = {
          items: [],
          date,
          displayDate: formatDate(new Date(date), 'E, MMM d')
        };
      }
      days[date].items.push(item);
    });

    // Get mid-day forecast for each day (or average)
    return Object.values(days).map((day: any) => {
      const midDayItem = day.items.find((item: any) => 
        item.dt_txt.includes('12:00:00')
      ) || day.items[Math.floor(day.items.length / 2)];
      
      return {
        ...midDayItem,
        displayDate: day.displayDate,
        temp: temperatureUnit === 'celsius' 
          ? kelvinToCelsius(midDayItem.main.temp)
          : kelvinToFahrenheit(midDayItem.main.temp),
        humidity: midDayItem.main.humidity,
        windSpeed: midDayItem.wind.speed,
      };
    });
  };

  const getChartData = () => {
    if (!data) return [];
    
    return data.list.map(item => ({
      time: formatDate(new Date(item.dt * 1000), 'MM/dd HH:mm'),
      temp: temperatureUnit === 'celsius' 
        ? kelvinToCelsius(item.main.temp)
        : kelvinToFahrenheit(item.main.temp),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading forecast data. Please try a different location.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          {data?.city ? `${data.city.name}, ${data.city.country} Forecast` : 'Weather Forecast'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : data ? (
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily">Daily Forecast</TabsTrigger>
              <TabsTrigger value="chart">Temperature Chart</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {getDailyForecast().slice(0, 5).map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-3 rounded-lg border bg-card text-card-foreground"
                  >
                    <div className="text-sm font-medium">{day.displayDate}</div>
                    <div className="flex items-center justify-between my-2">
                      {getWeatherIcon(day.weather[0].icon)}
                      <div className="text-2xl font-bold">
                        {day.temp}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {day.weather[0].description}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center">
                        <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                        {day.humidity}%
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-3 w-3 mr-1 text-blue-500" />
                        {day.windSpeed} m/s
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chart">
              <div className="h-64 w-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                      data={getChartData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="time" 
                        tickFormatter={(value) => value.split(' ')[1]}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="temp" 
                        name={`Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`}
                        stroke="hsl(var(--chart-1))" 
                        fillOpacity={1} 
                        fill="url(#tempGradient)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="humidity" 
                        name="Humidity (%)"
                        stroke="hsl(var(--chart-2))" 
                        fillOpacity={1} 
                        fill="url(#humidityGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
      </CardContent>
    </Card>
  );
}