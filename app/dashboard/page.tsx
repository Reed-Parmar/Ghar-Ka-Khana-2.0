import { requireAuth } from '@/lib/session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Heart, Package, Star, TrendingUp, Users } from 'lucide-react';

export default async function DashboardPage() {
  const session = await requireAuth();

  // Sample data - in a real app, this would come from your database
  const dashboardData = {
    totalOrders: 12,
    favoriteChefs: 3,
    totalSpent: 2850,
    recentOrders: [
      {
        id: '1',
        chef: 'Priya Sharma',
        meal: 'Homemade Biryani',
        status: 'delivered',
        date: '2024-10-03',
        price: 250,
      },
      {
        id: '2',
        chef: 'Amit Kumar',
        meal: 'Dal Tadka with Rice',
        status: 'preparing',
        date: '2024-10-04',
        price: 120,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your orders and discover new homemade meals from local chefs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Chefs</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.favoriteChefs}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.totalSpent}</div>
            <p className="text-xs text-muted-foreground">
              +370 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285</div>
            <p className="text-xs text-muted-foreground">
              Earn more by ordering!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>
              Your latest meal orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{order.meal}</h4>
                  <p className="text-sm text-gray-600">by {order.chef}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={order.status === 'delivered' ? 'default' : 'secondary'}
                  >
                    {order.status}
                  </Badge>
                  <span className="font-medium">₹{order.price}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Recommended Chefs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Recommended Chefs
            </CardTitle>
            <CardDescription>
              Discover new chefs based on your preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">Meera Patel</h4>
                <p className="text-sm text-gray-600">Gujarati Specialties</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.9 (67 reviews)</span>
                </div>
              </div>
              <Button size="sm">Follow</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">Rajesh Singh</h4>
                <p className="text-sm text-gray-600">Punjabi Cuisine</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.8 (89 reviews)</span>
                </div>
              </div>
              <Button size="sm">Follow</Button>
            </div>

            <Button variant="outline" className="w-full">
              Explore All Chefs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-24 flex flex-col items-center justify-center space-y-2">
          <Package className="h-6 w-6" />
          <span>Browse Meals</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
          <Users className="h-6 w-6" />
          <span>Find Chefs</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
          <Heart className="h-6 w-6" />
          <span>Your Favorites</span>
        </Button>
      </div>
    </div>
  );
}