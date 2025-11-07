import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Chef from '@/lib/models/Chef';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user by email
    const user: any = await User.findOne({ email: session.user.email }).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user is a chef, get Chef document
    if (user.role === 'chef') {
      const chef: any = await Chef.findOne({ userId: user._id }).lean();
      
      return NextResponse.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          createdAt: user.createdAt,
        },
        chef: chef ? {
          id: chef._id.toString(),
          approved: chef.approved,
          bio: chef.bio,
        } : null
      });
    }

    // For non-chef users, just return user data
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
      },
      chef: null
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
