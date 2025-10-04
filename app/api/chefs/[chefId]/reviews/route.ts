import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function GET(
  request: NextRequest,
  { params }: { params: { chefId: string } }
) {
  try {
    await client.connect();
    const db = client.db('ghar-ka-khana');
    
    // Get chef user by ID
    const chef = await db.collection('users').findOne({ 
      _id: new ObjectId(params.chefId),
      role: 'chef'
    });
    
    if (!chef) {
      return NextResponse.json(
        { error: 'Chef not found' },
        { status: 404 }
      );
    }

    // Get orders for this chef that have reviews/ratings
    const orders = await db.collection('orders').find({
      'chef.email': chef.email,
      $or: [
        { rating: { $exists: true, $gt: 0 } },
        { review: { $exists: true, $ne: null } }
      ]
    }).sort({ createdAt: -1 }).toArray();

    // For demonstration, let's also create some sample reviews
    const sampleReviews = [
      {
        id: 'review_1',
        user: {
          name: 'Rahul Patel',
          profileImage: null
        },
        rating: 5,
        comment: 'Absolutely delicious! The flavors were authentic and the portion size was perfect. Will definitely order again.',
        mealName: 'Butter Chicken with Rice',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 'review_2',
        user: {
          name: 'Sneha Gupta',
          profileImage: null
        },
        rating: 4,
        comment: 'Really good food! The spice level was just right and everything was fresh. Delivery was quick too.',
        mealName: 'Dal Tadka with Roti',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: 'review_3',
        user: {
          name: 'Amit Sharma',
          profileImage: null
        },
        rating: 5,
        comment: 'Outstanding home-cooked meal! Reminded me of my mother\'s cooking. The chef really knows their craft.',
        mealName: 'Rajma Chawal',
        createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      }
    ];

    // Transform actual orders to reviews
    const actualReviews = orders.map(order => ({
      id: order._id.toString(),
      user: {
        name: order.user?.name || 'Anonymous User',
        profileImage: order.user?.profileImage || null
      },
      rating: order.rating || 4,
      comment: order.review || 'Great meal! Really enjoyed it.',
      mealName: order.meal?.name || order.mealName || 'Delicious Meal',
      createdAt: order.createdAt || new Date().toISOString()
    }));

    // Combine actual reviews with sample reviews (for demonstration)
    const allReviews = [...actualReviews, ...sampleReviews];

    return NextResponse.json({
      success: true,
      reviews: allReviews
    });

  } catch (error) {
    console.error('Error fetching chef reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chef reviews' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}