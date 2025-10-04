'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  ChefHat, 
  Star, 
  MapPin, 
  Calendar,
  Users,
  Utensils,
  Award,
  Clock,
  Heart,
  Share2,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ChefProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  specialties: string[];
  rating: number;
  totalRatings: number;
  totalMeals: number;
  totalOrders: number;
  profileImage?: string;
  coverImage?: string;
  joinedDate: string;
  isActive: boolean;
  isApproved: boolean;
  availableNow?: boolean;
  experience?: string;
  awards?: string[];
}

interface ChefMeal {
  id: string;
  mealName: string;
  description: string;
  price: number;
  imageUrl?: string;
  rating: number;
  totalRatings: number;
  availableTime: string;
  isActive: boolean;
  category?: string;
}

interface ChefReview {
  id: string;
  user: {
    name: string;
    profileImage?: string;
  };
  rating: number;
  comment: string;
  mealName: string;
  createdAt: string;
}

export default function ChefProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const [chef, setChef] = useState<ChefProfile | null>(null);
  const [meals, setMeals] = useState<ChefMeal[]>([]);
  const [reviews, setReviews] = useState<ChefReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('meals');

  useEffect(() => {
    if (params.chefId) {
      fetchChefProfile();
    }
  }, [params.chefId]);

  const fetchChefProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch chef profile
      const chefResponse = await fetch(`/api/chefs/${params.chefId}`);
      if (chefResponse.ok) {
        const chefData = await chefResponse.json();
        setChef(chefData.chef);
      }

      // Fetch chef's meals
      const mealsResponse = await fetch(`/api/chefs/${params.chefId}/meals`);
      if (mealsResponse.ok) {
        const mealsData = await mealsResponse.json();
        setMeals(mealsData.meals || []);
      }

      // Fetch chef's reviews
      const reviewsResponse = await fetch(`/api/chefs/${params.chefId}/reviews`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }

    } catch (error) {
      console.error('Error fetching chef profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chef profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="md:col-span-2 h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chef not found</h3>
            <p className="text-muted-foreground mb-4">
              The chef profile you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/chefs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chefs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button variant="outline" asChild>
        <Link href="/chefs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chefs
        </Link>
      </Button>

      {/* Chef Header */}
      <Card className="overflow-hidden">
        {/* Cover Image */}
        {chef.coverImage && (
          <div className="h-48 relative">
            <Image
              src={chef.coverImage}
              alt={`${chef.name}'s cover`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full bg-muted border-4 border-background overflow-hidden">
                {chef.profileImage ? (
                  <Image
                    src={chef.profileImage}
                    alt={chef.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ChefHat className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Chef Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{chef.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {renderStars(chef.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {chef.rating.toFixed(1)} ({chef.totalRatings} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {chef.availableNow && (
                    <Badge className="bg-green-500">Available Now</Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {chef.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {chef.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(chef.joinedDate).getFullYear()}
                </div>
                {chef.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Contact Chef
                  </div>
                )}
              </div>

              {/* Bio */}
              {chef.bio && (
                <p className="text-muted-foreground">{chef.bio}</p>
              )}

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {chef.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Utensils className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{chef.totalMeals}</p>
              <p className="text-sm text-muted-foreground">Meals</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{chef.totalOrders}</p>
              <p className="text-sm text-muted-foreground">Orders</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Star className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{chef.rating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Award className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{chef.awards?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Awards</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meals">Meals ({meals.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meals" className="space-y-4">
          {meals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No meals available</h3>
                <p className="text-muted-foreground">
                  This chef hasn't uploaded any meals yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal) => (
                <Card key={meal.id} className="overflow-hidden">
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
                        <Utensils className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold">{meal.mealName}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {meal.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">₹{meal.price}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(meal.rating)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({meal.totalRatings})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{meal.availableTime}</span>
                      <Badge variant={meal.isActive ? "default" : "secondary"}>
                        {meal.isActive ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link href={`/meals/${meal.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">
                  Be the first to leave a review for this chef!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {review.user.profileImage ? (
                          <Image
                            src={review.user.profileImage}
                            alt={review.user.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{review.user.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Ordered {review.mealName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About {chef.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {chef.bio && (
                <div>
                  <h4 className="font-medium mb-2">Biography</h4>
                  <p className="text-muted-foreground">{chef.bio}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {chef.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {chef.experience && (
                <div>
                  <h4 className="font-medium mb-2">Experience</h4>
                  <p className="text-muted-foreground">{chef.experience}</p>
                </div>
              )}
              
              {chef.awards && chef.awards.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Awards & Recognition</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {chef.awards.map((award, index) => (
                      <li key={index} className="text-muted-foreground">{award}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>Available through platform messaging</span>
                  </div>
                  {chef.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{chef.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}