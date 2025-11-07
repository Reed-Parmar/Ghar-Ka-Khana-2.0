import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Chef from '@/lib/models/Chef';

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

    await connectDB();
    
    // Update the Chef document
    const chef = await Chef.findByIdAndUpdate(
      params.chefId,
      { 
        approved: isApproved,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!chef) {
      return NextResponse.json(
        { error: 'Chef not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Chef ${isApproved ? 'approved' : 'rejected'} successfully`,
      chef: {
        id: chef._id.toString(),
        approved: chef.approved
      }
    });

  } catch (error) {
    console.error('Error updating chef approval:', error);
    return NextResponse.json(
      { error: 'Failed to update chef approval' },
      { status: 500 }
    );
  }
}