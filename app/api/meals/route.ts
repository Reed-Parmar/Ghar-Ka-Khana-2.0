import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    // This would fetch meals from database
    const sampleMeals = [
      {
        id: '1',
        name: 'Homemade Biryani',
        description: 'Authentic hyderabadi biryani made with basmati rice',
        price: 250,
        chef: 'Priya Sharma',
        rating: 4.8,
        image: '/biryani.jpeg'
      },
      {
        id: '2',
        name: 'Dal Tadka',
        description: 'Traditional yellow lentil curry with spices',
        price: 120,
        chef: 'Amit Kumar',
        rating: 4.5,
        image: '/dal_tad.jpeg'
      }
    ];
    
    return NextResponse.json(sampleMeals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}