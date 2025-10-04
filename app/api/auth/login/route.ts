import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { z } from 'zod';

// Force Node.js runtime
export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email: validatedData.email }).select('+password');
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'Login successful', 
        user: userWithoutPassword 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}