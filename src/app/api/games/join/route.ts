import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Join a game by code
export async function POST(request: NextRequest) {
  try {
    const { gameCode } = await request.json();

    if (!gameCode) {
      return NextResponse.json(
        { error: 'Game code is required' },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { code: gameCode.toUpperCase() },
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
    console.error('Error joining game:', error);
    return NextResponse.json(
      { error: 'Failed to join game' },
      { status: 500 }
    );
  }
}
