import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { chefId: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { isApproved } = await request.json();
    
    if (typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'isApproved must be a boolean' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('ghar-ka-khana');
    
    const result = await db.collection('users').updateOne(
      { 
        _id: new ObjectId(params.chefId),
        role: 'chef'
      },
      { 
        $set: { 
          isApproved,
          approvedAt: isApproved ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Chef not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Chef ${isApproved ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Error updating chef approval:', error);
    return NextResponse.json(
      { error: 'Failed to update chef approval' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}