import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateGameCode } from '@/lib/gameUtils';

// Create a new game
export async function POST(request: NextRequest) {
  try {
    const { hostName } = await request.json();

    if (!hostName) {
      return NextResponse.json(
        { error: 'Host name is required' },
        { status: 400 }
      );
    }

    // Generate unique game code
    let gameCode = generateGameCode();
    let existingGame = await prisma.game.findUnique({
      where: { code: gameCode }
    });

    // Regenerate if code exists
    while (existingGame) {
      gameCode = generateGameCode();
      existingGame = await prisma.game.findUnique({
        where: { code: gameCode }
      });
    }

    // Create game without teams (teams will be created when players join)
    const game = await prisma.game.create({
      data: {
        code: gameCode,
        hostName,
        // Store maxTeams for validation but don't create teams yet
      },
      include: {
        teams: true
      }
    });

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}
