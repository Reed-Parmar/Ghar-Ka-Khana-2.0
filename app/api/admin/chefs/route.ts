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
    
    // Get all chef users with their stats using aggregation
    const chefsWithStats = await db.collection('users').aggregate([
      {
        $match: { role: 'chef' }
      },
      {
        $lookup: {
          from: 'meals',
          localField: '_id',
          foreignField: 'chef',
          as: 'meals'
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'chef',
          as: 'orders'
        }
      },
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          email: 1,
          isApproved: { $ifNull: ['$isApproved', true] },
          totalMeals: { $size: '$meals' },
          totalOrders: { $size: '$orders' },
          revenue: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: { $ifNull: ['$$order.totalPrice', 0] }
              }
            }
          },
          rating: { $ifNull: ['$rating', 0] },
          createdAt: { $ifNull: ['$createdAt', new Date()] }
        }
      }
    ]).toArray();

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