import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await client.connect();
    const db = client.db('ghar-ka-khana');
    
    // Fetch all users
    const users = await db.collection('users').find({}).toArray();
    
    // Transform users data
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'student',
      isActive: user.isActive !== false, // Default to true if not set
      createdAt: user.createdAt || new Date().toISOString(),
      lastLogin: user.lastLogin
    }));

    return NextResponse.json({
      success: true,
      users: transformedUsers
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}