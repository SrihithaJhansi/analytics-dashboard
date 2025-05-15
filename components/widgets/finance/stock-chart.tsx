"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/hooks/use-redux';
import { useGetStockTimeSeriesQuery } from '@/lib/store/services/financeApi';
import { formatDate, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function StockChart() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [timeInterval, setTimeInterval] = useState('daily');
  
  const { selectedStocks } = useAppSelector(state => state.dashboard);
  
  const { data, isLoading, error } = useGetStockTimeSeriesQuery({ 
    symbol: selectedStock,
    interval: timeInterval
  });

  const formatChartData = () => {
    if (!data) return [];

    const timeSeriesKey = timeInterval === 'daily' 
      ? 'Time Series (Daily)' 
      : timeInterval === 'hourly'
        ? 'Time Series (60min)'
        : 'Time Series (5min)';
        
    const timeSeriesData = data[timeSeriesKey as keyof typeof data] as any;
    
    if (!timeSeriesData) return [];

    let formattedData = Object.entries(timeSeriesData)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Limit the number of data points based on interval
    if (timeInterval === 'daily') {
      formattedData = formattedData.slice(-30); // Last 30 days
    } else if (timeInterval === 'hourly') {
      formattedData = formattedData.slice(-24); // Last 24 hours
    } else {
      formattedData = formattedData.slice(-60); // Last 60 5-min intervals
    }

    return formattedData;
  };

  const chartData = formatChartData();
  const stockOptions = [...new Set([...selectedStocks, 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'])];

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Stock Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading stock data. Please try a different stock or interval.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>Stock Price Chart</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select 
              value={selectedStock} 
              onValueChange={setSelectedStock}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select stock" />
              </SelectTrigger>
              <SelectContent>
                {stockOptions.map(stock => (
                  <SelectItem key={stock} value={stock}>{stock}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="price" onClick={() => setTimeInterval('daily')}>Daily</TabsTrigger>
            <TabsTrigger value="hourly" onClick={() => setTimeInterval('hourly')}>Hourly</TabsTrigger>
            <TabsTrigger value="minutes" onClick={() => setTimeInterval('minutes')}>5 Min</TabsTrigger>
          </TabsList>

          <TabsContent value="price">
            <StockChartContent 
              data={chartData}
              isLoading={isLoading}
              interval="daily"
              selectedStock={selectedStock}
            />
          </TabsContent>
          
          <TabsContent value="hourly">
            <StockChartContent 
              data={chartData}
              isLoading={isLoading}
              interval="hourly"
              selectedStock={selectedStock}
            />
          </TabsContent>
          
          <TabsContent value="minutes">
            <StockChartContent 
              data={chartData}
              isLoading={isLoading}
              interval="minutes"
              selectedStock={selectedStock}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface StockChartContentProps {
  data: any[];
  isLoading: boolean;
  interval: string;
  selectedStock: string;
}

function StockChartContent({ data, isLoading, interval, selectedStock }: StockChartContentProps) {
  const formatXAxis = (date: string) => {
    if (interval === 'daily') {
      return formatDate(date, 'MMM dd');
    } else if (interval === 'hourly') {
      return date.split(' ')[1];
    } else {
      return date.split(' ')[1];
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available for this time interval.
      </div>
    );
  }

  const latestPrice = data[data.length - 1]?.close;
  const firstPrice = data[0]?.close;
  const priceChange = latestPrice - firstPrice;
  const percentChange = (priceChange / firstPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{selectedStock}</h3>
          <p className="text-muted-foreground text-sm">
            {interval === 'daily' ? 'Last 30 days' : 
             interval === 'hourly' ? 'Last 24 hours' : 
             'Last 60 intervals (5 min)'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{formatCurrency(latestPrice)}</div>
          <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{formatCurrency(priceChange)} ({percentChange.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              className="text-xs"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => '$' + value.toFixed(0)}
              className="text-xs"
            />
            <Tooltip 
              formatter={(value: number) => ['$' + value.toFixed(2), 'Price']}
              labelFormatter={(label) => formatDate(label, 'PPP')}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="close"
              name="Closing Price"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              fillOpacity={1}
              fill="url(#colorClose)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}