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
    
    // Get all chef users
    const chefUsers = await db.collection('users').find({ role: 'chef' }).toArray();
    
    // Get chef statistics (meals and orders)
    const chefsWithStats = await Promise.all(
      chefUsers.map(async (chef) => {
        // Count meals by chef
        const mealCount = await db.collection('meals').countDocuments({
          'chef.email': chef.email
        });
        
        // Get orders for this chef's meals and calculate stats
        const orders = await db.collection('orders').find({
          'chef.email': chef.email
        }).toArray();
        
        const totalOrders = orders.length;
        const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        return {
          id: chef._id.toString(),
          name: chef.name,
          email: chef.email,
          isApproved: chef.isApproved !== false, // Default to true if not set
          totalMeals: mealCount,
          totalOrders,
          revenue,
          rating: chef.rating || 0,
          createdAt: chef.createdAt || new Date().toISOString()
        };
      })
    );

    return NextResponse.json({
      success: true,
      chefs: chefsWithStats
    });

  } catch (error) {
    console.error('Error fetching chefs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chefs' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}