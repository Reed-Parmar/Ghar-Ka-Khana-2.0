import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Star, MapPin, Clock, Heart } from 'lucide-react';

export default function HomePage() {
  const featuredMeals = [
    {
      id: '1',
      name: 'Homemade Biryani',
      description: 'Authentic Hyderabadi biryani with tender mutton and aromatic basmati rice',
      price: 250,
      chef: 'Priya Sharma',
      rating: 4.8,
      reviews: 42,
      cookTime: '45 mins',
      location: 'Delhi',
      image: '/homemade-biryani.jpg',
      tags: ['Spicy', 'Non-Veg'],
    },
    {
      id: '2',
      name: 'Rajma Chawal',
      description: 'Traditional kidney bean curry with steamed rice and pickle',
      price: 120,
      chef: 'Amit Kumar',
      rating: 4.5,
      reviews: 38,
      cookTime: '30 mins',
      location: 'Bangalore',
      image: '/homemade-rajma-chawal.jpg',
      tags: ['Comfort Food', 'Veg'],
    },
    {
      id: '3',
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese with bell peppers and onions in tandoor spices',
      price: 180,
      chef: 'Meera Patel',
      rating: 4.7,
      reviews: 29,
      cookTime: '25 mins',
      location: 'Mumbai',
      image: '/homemade-paneer-tikka.jpg',
      tags: ['Grilled', 'Veg'],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ghar Ka Khana
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover authentic homemade meals from passionate local chefs in your neighborhood
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/meals">Browse Meals</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-red-600" asChild>
              <Link href="/register">Join as Chef</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Ghar Ka Khana?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the joy of authentic homemade food, prepared with love by local chefs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <ChefHat className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Local Chefs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Connect with passionate home cooks in your area who prepare meals with authentic recipes and fresh ingredients.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Made with Love</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Every meal is prepared with care and attention to detail, just like your grandmother used to make.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Fresh & Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Meals are prepared fresh to order and delivered quickly to ensure you get the best taste and quality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Meals Today
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most popular homemade dishes from our top-rated chefs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMeals.map((meal) => (
              <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute top-4 left-4 flex gap-2">
                    {meal.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{meal.name}</CardTitle>
                      <p className="text-sm text-gray-600">by {meal.chef}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">₹{meal.price}</span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {meal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{meal.rating}</span>
                      <span>({meal.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{meal.cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{meal.location}</span>
                    </div>
                  </div>
                  <Button className="w-full">Order Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/meals">View All Meals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to taste authentic homemade food?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of food lovers who have discovered the joy of Ghar Ka Khana
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}