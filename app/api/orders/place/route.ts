import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Meal from '@/lib/models/Meal';
import User from '@/lib/models/User';
import { auth } from '@/lib/auth';

// Validation schema
const placeOrderSchema = z.object({
  mealId: z.string().min(1, 'Meal ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  paymentStatus: z.enum(['pending', 'paid']).default('paid'),
  deliveryNotes: z.string().max(200, 'Delivery notes too long').optional(),
});

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validatedData = placeOrderSchema.parse(body);

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user can place orders (students and admins can order)
    if (user.role === 'chef') {
      return NextResponse.json(
        { error: 'Chefs cannot place orders. Switch to student account to order meals.' },
        { status: 403 }
      );
    }

    // Find and validate the meal
    const meal = await Meal.findById(validatedData.mealId).populate('chef');
    if (!meal || !meal.isActive) {
      return NextResponse.json(
        { error: 'Meal not found or not available' },
        { status: 404 }
      );
    }

    // Calculate total price
    const totalPrice = meal.price * validatedData.quantity;

    // Prevent users from ordering their own meals (if they switch to chef role later)
    if (meal.chef._id.toString() === user._id.toString()) {
      return NextResponse.json(
        { error: 'You cannot order your own meal' },
        { status: 400 }
      );
    }

    // Create order
    const order = new Order({
      user: user._id,
      meal: meal._id,
      chef: meal.chef._id,
      quantity: validatedData.quantity,
      totalPrice,
      status: 'pending',
      paymentStatus: validatedData.paymentStatus,
      deliveryNotes: validatedData.deliveryNotes,
    });

    await order.save();

    // Populate order with user, meal, and chef information
    await order.populate([
      { path: 'user', select: 'name email' },
      { path: 'meal', select: 'mealName price imageUrl availableTime' },
      { path: 'chef', select: 'name email' },
    ]);

    return NextResponse.json({
      message: 'Order placed successfully',
      order: {
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
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error placing order:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}