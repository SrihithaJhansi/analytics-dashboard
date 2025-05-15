"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetTopHeadlinesQuery } from '@/lib/store/services/newsApi';
import { formatDate, truncateText } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const CATEGORIES = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports',
];

export function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  
  const { data, isLoading, error } = useGetTopHeadlinesQuery({
    category: selectedCategory,
    page: currentPage,
    pageSize: 5,
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (data && currentPage < Math.ceil(data.totalResults / 5)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-destructive mb-4">Unable to load news data. Please try again later.</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="whitespace-nowrap pb-2 mb-4">
          <div className="flex space-x-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 pb-4 border-b last:border-0">
                <Skeleton className="h-24 w-full sm:w-40 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.articles && data.articles.length > 0 ? (
          <>
            <div className="space-y-4">
              {data.articles.map((article, idx) => (
                <motion.div
                  key={`${article.title}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex flex-col sm:flex-row gap-4 pb-4 border-b last:border-0 cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.urlToImage ? (
                    <div className="sm:w-40 h-24 overflow-hidden rounded-md">
                      <img 
                        src={article.urlToImage} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=News';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="sm:w-40 h-24 bg-muted flex items-center justify-center rounded-md">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {article.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {article.source.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(article.publishedAt, 'PP')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {Math.ceil(data.totalResults / 5)}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage}
                disabled={currentPage >= Math.ceil(data.totalResults / 5)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No articles found for this category.
          </div>
        )}

        {/* Article Detail Dialog */}
        <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedArticle?.title}</DialogTitle>
            </DialogHeader>
            
            {selectedArticle?.urlToImage && (
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img
                  src={selectedArticle.urlToImage}
                  alt={selectedArticle.title}
                  className="rounded-md object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=News';
                  }}
                />
              </AspectRatio>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge>{selectedArticle?.source.name}</Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedArticle && formatDate(selectedArticle.publishedAt, 'PPP')}
                </span>
              </div>
              
              {selectedArticle?.author && (
                <p className="text-sm text-muted-foreground">
                  By: {selectedArticle.author}
                </p>
              )}
              
              <p>{selectedArticle?.content || selectedArticle?.description}</p>
              
              <div className="pt-4">
                <Button variant="outline" className="gap-2" asChild>
                  <a href={selectedArticle?.url} target="_blank" rel="noopener noreferrer">
                    Read full article <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}