import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

// Force Node.js runtime
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db('ghar-ka-khana');
    
    // Get all chef users
    const chefUsers = await db.collection('users').find({ 
      role: 'chef',
      isActive: { $ne: false },
      isApproved: { $ne: false }
    }).toArray();
    
    // Get chef statistics and create enhanced chef profiles
    const chefsWithStats = await Promise.all(
      chefUsers.map(async (chef) => {
        // Count meals by chef
        const meals = await db.collection('meals').find({
          'chef.email': chef.email,
          isActive: { $ne: false }
        }).toArray();
        
        // Get orders for this chef's meals and calculate stats
        const orders = await db.collection('orders').find({
          'chef.email': chef.email
        }).toArray();
        
        // Calculate average rating from orders/reviews
        const reviews = orders.filter(order => order.rating && order.rating > 0);
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, order) => sum + order.rating, 0) / reviews.length 
          : 4.0; // Default rating for new chefs
        
        // Generate some sample specialties based on meals or default ones
        const specialties = chef.specialties || [
          'Indian Cuisine',
          'Home-style Cooking',
          'Vegetarian',
          'Comfort Food'
        ];
        
        return {
          id: chef._id.toString(),
          name: chef.name,
          email: chef.email,
          bio: chef.bio || `Passionate home chef specializing in authentic ${specialties[0]}. I love creating delicious, healthy meals with fresh ingredients and traditional recipes passed down through generations.`,
          location: chef.location || 'Local Area',
          specialties: Array.isArray(specialties) ? specialties : [specialties],
          rating: Number(avgRating.toFixed(1)),
          totalRatings: reviews.length || Math.floor(Math.random() * 50) + 10, // Fallback for demo
          totalMeals: meals.length,
          totalOrders: orders.length,
          profileImage: chef.profileImage,
          joinedDate: chef.createdAt || new Date().toISOString(),
          isActive: chef.isActive !== false,
          isApproved: chef.isApproved !== false,
          availableNow: Math.random() > 0.5, // Random for demo purposes
          experience: chef.experience,
          awards: chef.awards || []
        };
      })
    );

    // Sort by rating by default
    const sortedChefs = chefsWithStats.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      success: true,
      chefs: sortedChefs
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