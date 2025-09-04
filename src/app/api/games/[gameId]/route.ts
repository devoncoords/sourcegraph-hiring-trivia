import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get game state
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        teams: true,
        answers: true
      }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

// Update game state
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const updates = await request.json();

    const game = await prisma.game.update({
      where: { id: gameId },
      data: updates,
      include: {
        teams: true,
        answers: true
      }
    });

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}
