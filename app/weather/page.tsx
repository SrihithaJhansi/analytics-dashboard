import DashboardLayout from '@/components/dashboard-layout';
import { CurrentWeather } from '@/components/widgets/weather/current-weather';
import { WeatherForecast } from '@/components/widgets/weather/weather-forecast';

export default function WeatherPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Weather Dashboard</h1>
        <p className="text-muted-foreground">
          Current weather conditions and forecasts from around the world.
        </p>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 h-full">
            <CurrentWeather />
          </div>
          <div className="md:col-span-2 h-full">
            <WeatherForecast />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}