"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/hooks/use-redux';
import { 
  addSelectedStock, 
  removeSelectedStock 
} from '@/lib/store/features/dashboardSlice';
import { 
  useGetStockQuoteQuery,
  useSearchStocksQuery
} from '@/lib/store/services/financeApi';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';

export function StockSummary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const dispatch = useAppDispatch();
  const { selectedStocks } = useAppSelector(state => state.dashboard);
  
  // Set up debounced search
  const debouncedSearch = debounce((query: string) => {
    setDebouncedSearchQuery(query);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleAddStock = (symbol: string) => {
    dispatch(addSelectedStock(symbol));
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearchActive(false);
  };

  const handleRemoveStock = (symbol: string) => {
    dispatch(removeSelectedStock(symbol));
  };

  // Only search if there's a query and search is active
  const { data: searchResults, isLoading: isSearchLoading } = useSearchStocksQuery(
    debouncedSearchQuery, 
    { 
      skip: !debouncedSearchQuery || !isSearchActive 
    }
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Stock Watchlist</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSearchActive(!isSearchActive)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {isSearchActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="relative">
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => {
                      setSearchQuery('');
                      setDebouncedSearchQuery('');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {debouncedSearchQuery && (
                <div className="relative mt-1 border rounded-md overflow-hidden">
                  {isSearchLoading ? (
                    <div className="p-2">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ) : searchResults && searchResults.bestMatches?.length > 0 ? (
                    <ScrollArea className="h-48">
                      <div className="p-0">
                        {searchResults.bestMatches.map((result, idx) => (
                          <motion.div 
                            key={`${result.symbol}-${idx}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer"
                            onClick={() => handleAddStock(result.symbol)}
                          >
                            <div>
                              <div className="font-medium">{result.symbol}</div>
                              <div className="text-xs text-muted-foreground">{result.name}</div>
                            </div>
                            <Badge variant="outline">{result.region}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : debouncedSearchQuery ? (
                    <div className="p-3 text-center text-muted-foreground">
                      No results found
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {selectedStocks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Add stocks to your watchlist to monitor them.
            </div>
          ) : (
            selectedStocks.map((symbol) => (
              <StockCard 
                key={symbol} 
                symbol={symbol}
                onRemove={() => handleRemoveStock(symbol)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StockCard({ symbol, onRemove }: { symbol: string; onRemove: () => void }) {
  const { data, isLoading, error } = useGetStockQuoteQuery(symbol);
  
  if (isLoading) {
    return (
      <div className="p-3 border rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="p-3 border rounded-lg bg-muted/20">
        <div className="flex justify-between items-center">
          <div className="font-medium">{symbol}</div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-sm text-destructive">Failed to load data</div>
      </div>
    );
  }

  const isPositiveChange = !data.change.startsWith('-');
  const changePercent = data.changePercent.replace('%', '');
  const formattedPrice = formatCurrency(parseFloat(data.price));
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 border rounded-lg hover:bg-accent/5 transition-colors"
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <div className="font-medium">{symbol}</div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Vol: {parseInt(data.volume).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold">{formattedPrice}</div>
          <div className={`text-sm flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveChange ? (
              <ChevronUp className="h-3 w-3 mr-1" />
            ) : (
              <ChevronDown className="h-3 w-3 mr-1" />
            )}
            {data.change} ({parseFloat(changePercent).toFixed(2)}%)
          </div>
        </div>
      </div>
    </motion.div>
  );
}