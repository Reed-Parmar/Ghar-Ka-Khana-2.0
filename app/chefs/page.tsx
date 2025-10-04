'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ChefHat, 
  Star, 
  MapPin, 
  Search,
  Filter,
  Users,
  Clock,
  Heart,
  Eye,
  Utensils,
  Award,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Chef {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  specialties: string[];
  rating: number;
  totalRatings: number;
  totalMeals: number;
  totalOrders: number;
  profileImage?: string;
  joinedDate: string;
  isActive: boolean;
  isApproved: boolean;
  availableNow?: boolean;
}

interface ChefMeal {
  id: string;
  mealName: string;
  price: number;
  imageUrl?: string;
  rating: number;
}

export default function ChefsPage() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'orders' | 'newest'>('rating');

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chefs');
      if (response.ok) {
        const data = await response.json();
        setChefs(data.chefs || []);
      }
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChefs = chefs.filter(chef => {
    const matchesSearch = chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chef.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesSpecialty = !selectedSpecialty || 
                            chef.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty && chef.isApproved && chef.isActive;
  });

  const sortedChefs = [...filteredChefs].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'orders':
        return b.totalOrders - a.totalOrders;
      case 'newest':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return 0;
    }
  });

  const allSpecialties = Array.from(
    new Set(chefs.flatMap(chef => chef.specialties))
  ).sort();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <ChefHat className="h-10 w-10 text-primary" />
          Our Amazing Chefs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover talented home chefs in your area, each bringing their unique culinary expertise 
          and passion for creating delicious, authentic meals.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <ChefHat className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{chefs.filter(c => c.isApproved && c.isActive).length}</p>
              <p className="text-sm text-muted-foreground">Active Chefs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Utensils className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {chefs.reduce((sum, chef) => sum + chef.totalMeals, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Meals</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {chefs.reduce((sum, chef) => sum + chef.totalOrders, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Orders Served</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Star className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {(chefs.reduce((sum, chef) => sum + chef.rating, 0) / chefs.length || 0).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search chefs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search chefs by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Specialty Filter */}
            <div className="md:w-48">
              <Label htmlFor="specialty" className="sr-only">Filter by specialty</Label>
              <select
                id="specialty"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
              >
                <option value="">All Specialties</option>
                {allSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="md:w-40">
              <Label htmlFor="sortBy" className="sr-only">Sort by</Label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'orders' | 'newest')}
                className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
              >
                <option value="rating">Top Rated</option>
                <option value="orders">Most Orders</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {sortedChefs.length} chef{sortedChefs.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedSpecialty && ` specializing in ${selectedSpecialty}`}
        </p>
      </div>

      {/* Chef Grid */}
      {sortedChefs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No chefs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more chefs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedChefs.map((chef) => (
            <Card key={chef.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {/* Chef Image */}
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                  {chef.profileImage ? (
                    <Image
                      src={chef.profileImage}
                      alt={chef.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ChefHat className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {chef.availableNow && (
                    <Badge className="absolute top-3 right-3 bg-green-500">
                      Available Now
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Chef Name and Rating */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{chef.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(chef.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {chef.rating.toFixed(1)} ({chef.totalRatings} reviews)
                    </span>
                  </div>
                </div>

                {/* Location */}
                {chef.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {chef.location}
                  </div>
                )}

                {/* Bio */}
                {chef.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {chef.bio}
                  </p>
                )}

                {/* Specialties */}
                <div className="flex flex-wrap gap-1">
                  {chef.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {chef.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{chef.specialties.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Utensils className="h-4 w-4" />
                    {chef.totalMeals} meals
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {chef.totalOrders} orders
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(chef.joinedDate).getFullYear()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1">
                    <Link href={`/chefs/${chef.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/chefs/${chef.id}/meals`}>
                      <Utensils className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action for Chefs */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="text-center p-8">
          <ChefHat className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Are you a chef?</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Join our community of talented home chefs and start sharing your culinary creations with food lovers in your area.
          </p>
          <Button asChild size="lg">
            <Link href="/register/chef-register">
              <Award className="h-5 w-5 mr-2" />
              Become a Chef
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}