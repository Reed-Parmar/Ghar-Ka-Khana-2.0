import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Get session to verify authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find the user in database
    const user = await User.findOne({ email: session.user.email }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}