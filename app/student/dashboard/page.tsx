'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Clock, CheckCircle, XCircle, User, Mail, CalendarDays } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  meal: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    availableTime: string;
  };
  chef: {
    id: string;
    name: string;
    email: string;
  };
  quantity: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user?.role !== 'student') {
      toast({
        title: 'Access Denied',
        description: 'This dashboard is only for students.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      // Get current user profile with ID
      const userResponse = await fetch('/api/user/profile');
      
      if (!userResponse.ok) {
        console.log('Failed to fetch user profile');
        setLoading(false);
        return;
      }

      const userData = await userResponse.json();
      const userId = userData.user.id;

      const response = await fetch(`/api/orders/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
      case 'preparing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'ready':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'student') {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>
          <p className="text-muted-foreground">Manage your orders and discover new meals</p>
        </div>
        <Button asChild>
          <Link href="/meals">Browse Meals</Link>
        </Button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{orders.reduce((total, order) => total + order.totalPrice, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Track your meal orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by browsing our delicious homemade meals!
                  </p>
                  <Button asChild>
                    <Link href="/meals">Browse Meals</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{order.meal.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Chef: {order.chef.name} • {order.meal.availableTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {order.quantity} • ₹{order.meal.price} each
                          </p>
                          {order.deliveryNotes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Note: {order.deliveryNotes}
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-lg font-bold">₹{order.totalPrice}</div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                              <span className="capitalize">{order.paymentStatus}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{session.user.email}</p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="capitalize">
                  {session.user.role} Account
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}