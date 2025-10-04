'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ChefHat, 
  Plus, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Eye, 
  Edit,
  Trash2,
  User,
  Mail,
  Upload,
  CheckCircle,
  XCircle,
  ImagePlus,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Meal {
  id: string;
  mealName: string;
  description: string;
  price: number;
  imageUrl?: string;
  availableTime: string;
  isActive: boolean;
  createdAt: string;
  chef: {
    id: string;
    name: string;
    email: string;
  };
}

interface Order {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  meal: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChefDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Meal form state
  const [mealForm, setMealForm] = useState({
    mealName: '',
    description: '',
    price: 0,
    imageUrl: '',
    availableTime: '',
  });
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user?.role !== 'chef') {
      toast({
        title: 'Access Denied',
        description: 'This dashboard is only for chefs.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    fetchUserData();
  }, [session, status, router]);

  const fetchUserData = async () => {
    try {
      // Get current user profile
      const userResponse = await fetch('/api/user/profile');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserId(userData.user.id);
        
        // Fetch orders for this chef
        fetchOrders(userData.user.id);
      }
      
      // Note: We'll fetch meals differently since we need to get chef's meals
      // For now, we'll fetch all meals and filter, but ideally we'd have a chef-specific endpoint
      fetchMeals();
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async () => {
    try {
      // For now, we'll fetch all meals and filter by chef email
      // In a real app, you'd have a chef-specific endpoint
      const response = await fetch('/api/meals/all?limit=100');
      if (response.ok) {
        const data = await response.json();
        // Filter meals by current chef
        const chefMeals = data.meals.filter((meal: any) => 
          meal.chef.email === session?.user?.email
        );
        setMeals(chefMeals);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchOrders = async (chefId: string) => {
    try {
      const response = await fetch(`/api/orders/chef/${chefId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedImage(file);

      // Convert to base64 and create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        setMealForm(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setMealForm(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleUploadMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/meals/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealForm),
      });

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Meal uploaded successfully',
        });
        setMealForm({
          mealName: '',
          description: '',
          price: 0,
          imageUrl: '',
          availableTime: '',
        });
        clearImage(); // Clear image state
        fetchMeals(); // Refresh meals list
      } else {
        const error = await response.json();
        toast({
          title: 'Upload Failed',
          description: error.error || 'Failed to upload meal',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error uploading meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload meal',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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

  if (!session || session.user?.role !== 'chef') {
    return null;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            Chef Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>
        <Button asChild>
          <Link href="/meals">View All Meals</Link>
        </Button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meals.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="meals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meals">My Meals</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="upload">Upload Meal</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Meals</CardTitle>
              <CardDescription>
                Manage your uploaded meals and their availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              {meals.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No meals uploaded yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by uploading your first delicious meal!
                  </p>
                  <Button asChild>
                    <Link href="#upload">Upload Your First Meal</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meals.map((meal) => (
                    <Card key={meal.id} className="overflow-hidden">
                      <div className="relative h-32 bg-muted">
                        {meal.imageUrl ? (
                          <Image
                            src={meal.imageUrl}
                            alt={meal.mealName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ChefHat className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h4 className="font-semibold">{meal.mealName}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {meal.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">₹{meal.price}</span>
                          <Badge variant={meal.isActive ? "default" : "secondary"}>
                            {meal.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Available: {meal.availableTime}
                        </p>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Manage orders for your meals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Orders for your meals will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{order.meal.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.user.name} ({order.user.email})
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
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Meal
              </CardTitle>
              <CardDescription>
                Add a new delicious meal to your menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadMeal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mealName">Meal Name</Label>
                    <Input
                      id="mealName"
                      value={mealForm.mealName}
                      onChange={(e) => setMealForm(prev => ({ ...prev, mealName: e.target.value }))}
                      placeholder="e.g., Homemade Biryani"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={mealForm.price}
                      onChange={(e) => setMealForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="250"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={mealForm.description}
                    onChange={(e) => setMealForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your delicious meal..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableTime">Available Time</Label>
                    <Input
                      id="availableTime"
                      value={mealForm.availableTime}
                      onChange={(e) => setMealForm(prev => ({ ...prev, availableTime: e.target.value }))}
                      placeholder="12:00 PM - 8:00 PM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Meal Image</Label>
                    <div className="space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="space-y-2">
                    <Label>Image Preview</Label>
                    <div className="relative inline-block">
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={imagePreview}
                          alt="Meal preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={clearImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Uploading...' : 'Upload Meal'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chef Profile</CardTitle>
              <CardDescription>
                Your account information
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
                  <ChefHat className="h-4 w-4 mr-1" />
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