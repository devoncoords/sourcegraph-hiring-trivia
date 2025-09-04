import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateGameCode } from '@/lib/gameUtils';

// Create a new game
export async function POST(request: NextRequest) {
  try {
    const { hostName, teams } = await request.json();

    if (!hostName || !teams || teams.length < 2) {
      return NextResponse.json(
        { error: 'Host name and at least 2 teams are required' },
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

    // Create game with teams
    const game = await prisma.game.create({
      data: {
        code: gameCode,
        hostName,
        teams: {
          create: teams.map((team: { name: string }, index: number) => ({
            name: team.name,
            color: `hsl(${(index * 60) % 360}, 70%, 50%)`
          }))
        }
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
