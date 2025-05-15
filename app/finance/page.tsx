import DashboardLayout from '@/components/dashboard-layout';
import { StockSummary } from '@/components/widgets/finance/stock-summary';
import { StockChart } from '@/components/widgets/finance/stock-chart';

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Track stock market performance and monitor your watchlist.
        </p>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 h-full">
            <StockSummary />
          </div>
          <div className="md:col-span-2 h-full">
            <StockChart />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}