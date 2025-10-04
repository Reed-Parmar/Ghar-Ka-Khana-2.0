'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function APITestPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { toast } = useToast();

  // Meal upload form data
  const [mealData, setMealData] = useState({
    mealName: '',
    description: '',
    price: 0,
    imageUrl: '',
    availableTime: '',
  });

  // Order placement form data
  const [orderData, setOrderData] = useState({
    mealId: '',
    quantity: 1,
    paymentStatus: 'paid' as 'pending' | 'paid',
    deliveryNotes: '',
  });

  const testAPI = async (endpoint: string, method: string, data?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(endpoint, options);
      const result = await res.json();
      
      setResponse({
        status: res.status,
        data: result,
        endpoint,
        method,
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: `${method} ${endpoint} completed successfully`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'API call failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('API test error:', error);
      toast({
        title: 'Error',
        description: 'Failed to call API',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Ghar Ka Khana - API Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Get All Meals */}
        <Card>
          <CardHeader>
            <CardTitle>Get All Meals</CardTitle>
            <CardDescription>Test the /api/meals/all endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => testAPI('/api/meals/all', 'GET')}
              disabled={loading}
              className="w-full"
            >
              Test Get All Meals
            </Button>
          </CardContent>
        </Card>

        {/* Test Upload Meal */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Meal (Chef Only)</CardTitle>
            <CardDescription>Test the /api/meals/upload endpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mealName">Meal Name</Label>
              <Input
                id="mealName"
                value={mealData.mealName}
                onChange={(e) => setMealData(prev => ({ ...prev, mealName: e.target.value }))}
                placeholder="e.g., Homemade Biryani"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={mealData.description}
                onChange={(e) => setMealData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Delicious homemade biryani with aromatic spices..."
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={mealData.price}
                onChange={(e) => setMealData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="250"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={mealData.imageUrl}
                onChange={(e) => setMealData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/biryani.jpg"
              />
            </div>
            <div>
              <Label htmlFor="availableTime">Available Time</Label>
              <Input
                id="availableTime"
                value={mealData.availableTime}
                onChange={(e) => setMealData(prev => ({ ...prev, availableTime: e.target.value }))}
                placeholder="12:00 PM - 8:00 PM"
              />
            </div>
            <Button 
              onClick={() => testAPI('/api/meals/upload', 'POST', mealData)}
              disabled={loading}
              className="w-full"
            >
              Upload Meal
            </Button>
          </CardContent>
        </Card>

        {/* Test Place Order */}
        <Card>
          <CardHeader>
            <CardTitle>Place Order (Student/Admin Only)</CardTitle>
            <CardDescription>Test the /api/orders/place endpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mealId">Meal ID</Label>
              <Input
                id="mealId"
                value={orderData.mealId}
                onChange={(e) => setOrderData(prev => ({ ...prev, mealId: e.target.value }))}
                placeholder="Get meal ID from 'Get All Meals' response"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={orderData.quantity}
                onChange={(e) => setOrderData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select value={orderData.paymentStatus} onValueChange={(value: 'pending' | 'paid') => setOrderData(prev => ({ ...prev, paymentStatus: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deliveryNotes">Delivery Notes (optional)</Label>
              <Textarea
                id="deliveryNotes"
                value={orderData.deliveryNotes}
                onChange={(e) => setOrderData(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                placeholder="Please deliver to hostel room 201"
              />
            </div>
            <Button 
              onClick={() => testAPI('/api/orders/place', 'POST', orderData)}
              disabled={loading}
              className="w-full"
            >
              Place Order
            </Button>
          </CardContent>
        </Card>

        {/* API Response Display */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Response</CardTitle>
            <CardDescription>Latest API response will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-2">
                <div className="font-semibold">
                  {response.method} {response.endpoint} - Status: {response.status}
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">No API calls made yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Note: You need to be logged in with the appropriate role to test role-specific endpoints.
        </p>
        <p className="text-sm text-muted-foreground">
          Chef role: Can upload meals and view orders | Student/Admin role: Can view meals and place orders
        </p>
      </div>
    </div>
  );
}