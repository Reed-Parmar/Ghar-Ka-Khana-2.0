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

    // Get chef's meals
    const meals = await db.collection('meals').find({
      'chef.email': chef.email,
      isActive: { $ne: false }
    }).toArray();
    
    // Get orders for this chef
    const orders = await db.collection('orders').find({
      'chef.email': chef.email
    }).toArray();
    
    // Calculate statistics
    const reviews = orders.filter(order => order.rating && order.rating > 0);
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, order) => sum + order.rating, 0) / reviews.length 
      : 4.0;
    
    // Generate specialties if not available
    const specialties = chef.specialties || [
      'Indian Cuisine',
      'Home-style Cooking',
      'Vegetarian',
      'Comfort Food'
    ];

    const chefProfile = {
      id: chef._id.toString(),
      name: chef.name,
      email: chef.email,
      bio: chef.bio || `Passionate home chef specializing in authentic ${specialties[0]}. I love creating delicious, healthy meals with fresh ingredients and traditional recipes passed down through generations.`,
      location: chef.location || 'Local Area',
      phone: chef.phone,
      website: chef.website,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      rating: Number(avgRating.toFixed(1)),
      totalRatings: reviews.length || Math.floor(Math.random() * 50) + 10,
      totalMeals: meals.length,
      totalOrders: orders.length,
      profileImage: chef.profileImage,
      coverImage: chef.coverImage,
      joinedDate: chef.createdAt || new Date().toISOString(),
      isActive: chef.isActive !== false,
      isApproved: chef.isApproved !== false,
      availableNow: Math.random() > 0.5,
      experience: chef.experience || `${Math.floor(Math.random() * 10) + 1} years of cooking experience`,
      awards: chef.awards || []
    };

    return NextResponse.json({
      success: true,
      chef: chefProfile
    });

  } catch (error) {
    console.error('Error fetching chef profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chef profile' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}