import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Chef from '@/lib/models/Chef';
import User from '@/lib/models/User';
import Meal from '@/lib/models/Meal';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Get all chefs with their associated user data
    const chefs = await Chef.find()
      .populate('userId', 'name email createdAt')
      .lean();

    // Get meal counts for each chef
    const chefsWithStats = await Promise.all(
      chefs.map(async (chef: any) => {
        const mealCount = await Meal.countDocuments({ chef: chef.userId._id });
        
        return {
          id: chef._id.toString(),
          userId: chef.userId._id.toString(),
          name: chef.name,
          email: chef.userId.email,
          bio: chef.bio,
          approved: chef.approved,
          isApproved: chef.approved, // For backward compatibility
          totalMeals: mealCount,
          totalOrders: 0, // Will be calculated when orders are implemented
          revenue: 0,
          rating: 0,
          createdAt: chef.createdAt || chef.userId.createdAt,
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
  }
}