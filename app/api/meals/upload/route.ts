import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Meal from '@/lib/models/Meal';
import User from '@/lib/models/User';
import { auth } from '@/lib/auth';

// Validation schema
const uploadMealSchema = z.object({
  mealName: z.string().min(1, 'Meal name is required').max(100, 'Meal name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  price: z.number().min(0, 'Price must be positive'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  availableTime: z.string().min(1, 'Available time is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get session to verify authentication and role
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user is a chef
    if (session.user.role !== 'chef') {
      return NextResponse.json(
        { error: 'Only chefs can upload meals' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validatedData = uploadMealSchema.parse(body);

    // Find the chef user
    const chef = await User.findOne({ email: session.user.email });
    if (!chef) {
      return NextResponse.json(
        { error: 'Chef not found' },
        { status: 404 }
      );
    }

    // Create meal
    const meal = new Meal({
      chef: chef._id,
      mealName: validatedData.mealName,
      description: validatedData.description,
      price: validatedData.price,
      imageUrl: validatedData.imageUrl,
      availableTime: validatedData.availableTime,
      isActive: true,
    });

    await meal.save();

    // Populate chef information for response
    await meal.populate('chef', 'name email');

    return NextResponse.json({
      message: 'Meal uploaded successfully',
      meal: {
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
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading meal:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}