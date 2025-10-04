import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await client.connect();
    const db = client.db('ghar-ka-khana');
    
    // Get current date for "today" calculations
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
    
    // Parallel database queries for better performance
    const [
      totalUsers,
      totalChefs,
      activeChefs,
      totalOrders,
      orders,
      newUsersToday,
      ordersToday
    ] = await Promise.all([
      // Total users count
      db.collection('users').countDocuments({}),
      
      // Total chefs count
      db.collection('users').countDocuments({ role: 'chef' }),
      
      // Active (approved) chefs count
      db.collection('users').countDocuments({ 
        role: 'chef', 
        isApproved: { $ne: false } 
      }),
      
      // Total orders count
      db.collection('orders').countDocuments({}),
      
      // All orders for revenue calculation
      db.collection('orders').find({}).toArray(),
      
      // New users today
      db.collection('users').countDocuments({
        createdAt: {
          $gte: startOfToday.toISOString(),
          $lt: endOfToday.toISOString()
        }
      }),
      
      // Orders today
      db.collection('orders').countDocuments({
        createdAt: {
          $gte: startOfToday.toISOString(),
          $lt: endOfToday.toISOString()
        }
      })
    ]);
    
    // Calculate revenue and pending orders
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    
    const stats = {
      totalUsers,
      totalChefs,
      totalOrders,
      totalRevenue,
      pendingOrders,
      activeChefs,
      newUsersToday,
      ordersToday
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}