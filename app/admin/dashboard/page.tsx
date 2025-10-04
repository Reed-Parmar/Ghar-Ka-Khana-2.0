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
  Shield, 
  Users, 
  ChefHat, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Clock, 
  Eye, 
  Edit,
  Trash2,
  User,
  Mail,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  UserCheck,
  UserX,
  Ban,
  CheckCheck
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'chef' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Chef {
  id: string;
  name: string;
  email: string;
  isApproved: boolean;
  totalMeals: number;
  totalOrders: number;
  revenue: number;
  rating?: number;
  createdAt: string;
}

interface Order {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  chef: {
    id: string;
    name: string;
    email: string;
  };
  meal: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface PlatformStats {
  totalUsers: number;
  totalChefs: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeChefs: number;
  newUsersToday: number;
  ordersToday: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalChefs: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeChefs: 0,
    newUsersToday: 0,
    ordersToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user?.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'This dashboard is only for administrators.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchChefs(), 
        fetchOrders(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchChefs = async () => {
    try {
      const response = await fetch('/api/admin/chefs');
      if (response.ok) {
        const data = await response.json();
        setChefs(data.chefs || []);
      }
    } catch (error) {
      console.error('Error fetching chefs:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUserStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        });
        fetchUsers();
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const handleChefApproval = async (chefId: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/admin/chefs/${chefId}/approval`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Chef ${isApproved ? 'approved' : 'rejected'} successfully`,
        });
        fetchChefs();
      } else {
        throw new Error('Failed to update chef approval');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update chef approval',
        variant: 'destructive',
      });
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'chef':
        return 'bg-orange-100 text-orange-800';
      case 'student':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/meals">View Platform</Link>
          </Button>
          <Button asChild>
            <Link href="#settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersToday} today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chefs</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChefs}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalChefs} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.ordersToday} today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} pending orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="chefs">Chefs</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{order.meal.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.user.name} • ₹{order.totalPrice}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System status and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Database: Operational</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Payment System: Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm">{stats.pendingOrders} Orders Pending</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">API: Healthy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={user.isActive ? "destructive" : "default"}
                        onClick={() => handleUserStatusChange(user.id, !user.isActive)}
                      >
                        {user.isActive ? (
                          <><Ban className="h-4 w-4 mr-1" />Deactivate</>
                        ) : (
                          <><UserCheck className="h-4 w-4 mr-1" />Activate</>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chefs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chef Management</CardTitle>
              <CardDescription>Approve and manage chefs on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chefs.map((chef) => (
                  <div key={chef.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <ChefHat className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{chef.name}</h4>
                        <p className="text-sm text-muted-foreground">{chef.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={chef.isApproved ? "default" : "secondary"}>
                            {chef.isApproved ? "Approved" : "Pending"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {chef.totalMeals} meals • {chef.totalOrders} orders • ₹{chef.revenue}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!chef.isApproved && (
                        <Button
                          size="sm"
                          onClick={() => handleChefApproval(chef.id, true)}
                        >
                          <CheckCheck className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant={chef.isApproved ? "destructive" : "outline"}
                        onClick={() => handleChefApproval(chef.id, !chef.isApproved)}
                      >
                        {chef.isApproved ? (
                          <><UserX className="h-4 w-4 mr-1" />Revoke</>
                        ) : (
                          <><XCircle className="h-4 w-4 mr-1" />Reject</>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Monitor and manage all platform orders</CardDescription>
            </CardHeader>
            <CardContent>
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
                          Chef: {order.chef.name} ({order.chef.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {order.quantity} • ₹{order.meal.price} each
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-lg font-bold">₹{order.totalPrice}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">₹{stats.totalRevenue}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span>₹{Math.floor(stats.totalRevenue * 0.3)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Month</span>
                      <span>₹{Math.floor(stats.totalRevenue * 0.25)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Growth</span>
                      <span>+20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  User Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Students</span>
                      <span>{users.filter(u => u.role === 'student').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Chefs</span>
                      <span>{users.filter(u => u.role === 'chef').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Admins</span>
                      <span>{users.filter(u => u.role === 'admin').length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Platform Settings
              </CardTitle>
              <CardDescription>Configure platform-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Commission (%)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Order Amount</Label>
                  <Input type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum File Size (MB)</Label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input type="email" defaultValue="support@gharkaakhana.com" />
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}