import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { isActive } = await request.json();
    
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('ghar-ka-khana');
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(params.userId) },
      { 
        $set: { 
          isActive,
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}