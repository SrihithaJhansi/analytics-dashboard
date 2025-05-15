import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrentWeather } from '@/components/widgets/weather/current-weather';
import { WeatherForecast } from '@/components/widgets/weather/weather-forecast';
import { StockSummary } from '@/components/widgets/finance/stock-summary';
import { StockChart } from '@/components/widgets/finance/stock-chart';
import { NewsFeed } from '@/components/widgets/news/news-feed';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Welcome to your Dashboard</CardTitle>
              <CardDescription>
                View your personalized analytics and data all in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This dashboard integrates multiple data sources to provide you with real-time 
                information about weather, financial markets, and current news.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CurrentWeather />
          </div>
          <div className="lg:col-span-2">
            <WeatherForecast />
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <StockSummary />
          </div>
          <div className="lg:col-span-2">
            <StockChart />
          </div>
        </div>
        
        <div className="grid gap-6">
          <NewsFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}