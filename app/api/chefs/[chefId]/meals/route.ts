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
    
    // Get chef user by ID to get their email
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
      'chef.email': chef.email
    }).sort({ createdAt: -1 }).toArray();
    
    // Transform meals data and add mock ratings
    const transformedMeals = meals.map(meal => {
      // Generate mock rating data for demonstration
      const rating = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
      const totalRatings = Math.floor(Math.random() * 50) + 5; // 5 to 55 ratings
      
      return {
        id: meal._id.toString(),
        mealName: meal.mealName,
        description: meal.description,
        price: meal.price,
        imageUrl: meal.imageUrl,
        rating: rating,
        totalRatings: totalRatings,
        availableTime: meal.availableTime,
        isActive: meal.isActive !== false,
        category: meal.category || 'Main Course',
        createdAt: meal.createdAt,
        chef: {
          id: chef._id.toString(),
          name: chef.name,
          email: chef.email
        }
      };
    });

    return NextResponse.json({
      success: true,
      meals: transformedMeals
    });

  } catch (error) {
    console.error('Error fetching chef meals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chef meals' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}