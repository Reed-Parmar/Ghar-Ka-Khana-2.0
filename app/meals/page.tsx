'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, Clock, Star, ShoppingCart, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Meal {
  id: string;
  mealName: string;
  description: string;
  price: number;
  imageUrl?: string;
  availableTime: string;
  chef: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMeals: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function MealsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalMeals: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  // Filters
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMeals();
  }, [currentPage, search, minPrice, maxPrice]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });
      
      if (search) params.append('search', search);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await fetch(`/api/meals/all?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setMeals(data.meals || []);
        setPagination(data.pagination);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch meals',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch meals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderMeal = async (mealId: string, mealName: string) => {
    if (!session) {
      toast({
        title: 'Login Required',
        description: 'Please login to place an order',
        variant: 'destructive',
      });
      return;
    }

    if (session.user?.role === 'chef') {
      toast({
        title: 'Access Denied',
        description: 'Chefs cannot place orders. Switch to student account to order meals.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealId,
          quantity: 1,
          paymentStatus: 'paid',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Order Placed!',
          description: `Successfully ordered ${mealName}`,
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Order Failed',
          description: error.error || 'Failed to place order',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMeals();
  };

  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Browse Homemade Meals</h1>
        <p className="text-muted-foreground">
          Discover delicious homemade food from local chefs in your area
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search meals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPrice">Min Price (₹)</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price (₹)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {pagination.totalMeals} meals
        </p>
        {session?.user?.role === 'student' && (
          <Button asChild variant="outline">
            <Link href="/student/dashboard">My Dashboard</Link>
          </Button>
        )}
      </div>

      {/* Meals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : meals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No meals found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters or check back later for new meals.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                {meal.imageUrl ? (
                  <Image
                    src={meal.imageUrl}
                    alt={meal.mealName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ChefHat className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{meal.mealName}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meal.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{meal.chef.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{meal.availableTime}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xl font-bold text-primary">₹{meal.price}</div>
                  {session ? (
                    session.user?.role !== 'chef' ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleOrderMeal(meal.id, meal.mealName)}
                        className="flex items-center gap-1"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Order
                      </Button>
                    ) : (
                      <Badge variant="secondary">Chef Account</Badge>
                    )
                  ) : (
                    <Button size="sm" asChild>
                      <Link href="/login">Login to Order</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination.hasPrev}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasNext}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}