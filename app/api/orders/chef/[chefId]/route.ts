import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { chefId: string } }
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

    const { chefId } = params;

    // Verify the authenticated user is either the chef or an admin
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (currentUser._id.toString() !== chefId && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. You can only view your own orders.' },
        { status: 403 }
      );
    }

    // Verify the chef exists
    const chef = await User.findById(chefId);
    if (!chef || chef.role !== 'chef') {
      return NextResponse.json(
        { error: 'Chef not found' },
        { status: 404 }
      );
    }

    // Get all orders for this chef's meals
    const orders = await Order.find({ chef: chefId })
      .populate('user', 'name email')
      .populate('meal', 'mealName price imageUrl')
      .sort({ createdAt: -1 });

    // Format the response
    const formattedOrders = orders.map(order => ({
      id: order._id,
      user: {
        id: order.user._id,
        name: order.user.name,
        email: order.user.email,
      },
      meal: {
        id: order.meal._id,
        name: order.meal.mealName,
        price: order.meal.price,
        imageUrl: order.meal.imageUrl,
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
    console.error('Error fetching chef orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}