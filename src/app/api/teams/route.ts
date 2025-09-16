import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Create a new team for a game
export async function POST(request: NextRequest) {
  try {
    const { gameId, teamName } = await request.json();

    if (!gameId || !teamName?.trim()) {
      return NextResponse.json(
        { error: 'Game ID and team name are required' },
        { status: 400 }
      );
    }

    // Get the game to check if it exists and get current team count
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { teams: true }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Check if game is still in lobby phase
    if (game.gamePhase !== 'LOBBY') {
      return NextResponse.json(
        { error: 'Cannot join game - game has already started' },
        { status: 400 }
      );
    }

    // Check if team name already exists in this game
    const existingTeam = game.teams.find((team: any) => 
      team.name.toLowerCase().trim() === teamName.toLowerCase().trim()
    );

    if (existingTeam) {
      return NextResponse.json(
        { error: 'A team with this name already exists in this game' },
        { status: 409 }
      );
    }

    // No team limit - unlimited teams can join

    // Create the team
    const team = await prisma.team.create({
      data: {
        gameId,
        name: teamName.trim(),
        color: `hsl(${(game.teams.length * 45) % 360}, 70%, 50%)`
      }
    });

    // Get updated game with all teams
    const updatedGame = await prisma.game.findUnique({
      where: { id: gameId },
      include: { teams: true, answers: true }
    });

    return NextResponse.json({ team, game: updatedGame });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
