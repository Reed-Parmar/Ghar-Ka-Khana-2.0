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
    
    // Fetch all orders with user and chef details using aggregation
    const orders = await db.collection('orders').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'chef',
          foreignField: '_id',
          as: 'chefDetails'
        }
      },
      {
        $lookup: {
          from: 'meals',
          localField: 'meal',
          foreignField: '_id',
          as: 'mealDetails'
        }
      },
      {
        $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: '$chefDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $unwind: { path: '$mealDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 50
      }
    ]).toArray();

    // Transform orders data
    const transformedOrders = orders.map(order => ({
      id: order._id.toString(),
      user: {
        id: order.user?.toString() || '',
        name: order.userDetails?.name || 'Unknown User',
        email: order.userDetails?.email || ''
      },
      chef: {
        id: order.chef?.toString() || '',
        name: order.chefDetails?.name || 'Unknown Chef',
        email: order.chefDetails?.email || ''
      },
      meal: {
        id: order.meal?.toString() || '',
        name: order.mealDetails?.mealName || order.mealName || 'Unknown Meal',
        price: order.mealDetails?.price || order.price || 0
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