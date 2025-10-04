import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params;

    // Verify the authenticated user is either the user or an admin
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (currentUser._id.toString() !== userId && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. You can only view your own orders.' },
        { status: 403 }
      );
    }

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    // Build filter query
    const filter: any = { user: userId };
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Get all orders for this user
    const orders = await Order.find(filter)
      .populate('meal', 'mealName price imageUrl availableTime')
      .populate('chef', 'name email')
      .sort({ createdAt: -1 });

    // Format the response
    const formattedOrders = orders.map(order => ({
      id: order._id,
      meal: {
        id: order.meal._id,
        name: order.meal.mealName,
        price: order.meal.price,
        imageUrl: order.meal.imageUrl,
        availableTime: order.meal.availableTime,
      },
      chef: {
        id: order.chef._id,
        name: order.chef.name,
        email: order.chef.email,
      },
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryNotes: order.deliveryNotes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json({
      message: 'Orders retrieved successfully',
      orders: formattedOrders,
      totalOrders: formattedOrders.length,
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}