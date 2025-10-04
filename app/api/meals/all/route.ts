import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Meal from '@/lib/models/Meal';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');

    // Build filter query
    const filter: any = { isActive: true };
    
    if (search) {
      filter.$or = [
        { mealName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (minPrice > 0 || maxPrice < 999999) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get meals with chef information
    const meals = await Meal.find(filter)
      .populate('chef', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalMeals = await Meal.countDocuments(filter);
    const totalPages = Math.ceil(totalMeals / limit);

    // Format the response
    const formattedMeals = meals.map(meal => ({
      id: meal._id,
      mealName: meal.mealName,
      description: meal.description,
      price: meal.price,
      imageUrl: meal.imageUrl,
      availableTime: meal.availableTime,
      chef: {
        id: meal.chef._id,
        name: meal.chef.name,
        email: meal.chef.email,
      },
      createdAt: meal.createdAt,
    }));

    return NextResponse.json({
      message: 'Meals retrieved successfully',
      meals: formattedMeals,
      pagination: {
        currentPage: page,
        totalPages,
        totalMeals,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}