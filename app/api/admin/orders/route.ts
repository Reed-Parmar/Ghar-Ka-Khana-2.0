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
    
    // Fetch all orders with sorting by creation date (newest first)
    const orders = await db.collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50) // Limit to recent 50 orders
      .toArray();
    
    // Transform orders data
    const transformedOrders = orders.map(order => ({
      id: order._id.toString(),
      user: {
        id: order.user?.id || '',
        name: order.user?.name || 'Unknown User',
        email: order.user?.email || ''
      },
      chef: {
        id: order.chef?.id || '',
        name: order.chef?.name || 'Unknown Chef',
        email: order.chef?.email || ''
      },
      meal: {
        id: order.meal?.id || '',
        name: order.meal?.name || order.mealName || 'Unknown Meal',
        price: order.meal?.price || order.price || 0
      },
      quantity: order.quantity || 1,
      totalPrice: order.totalPrice || 0,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'pending',
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || order.createdAt || new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}