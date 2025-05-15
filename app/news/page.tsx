import DashboardLayout from '@/components/dashboard-layout';
import { NewsFeed } from '@/components/widgets/news/news-feed';

export default function NewsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">News Dashboard</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest news from around the world.
        </p>
        
        <div className="h-[800px]">
          <NewsFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}