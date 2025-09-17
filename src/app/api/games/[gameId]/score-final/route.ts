import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Manual winner selection for final round
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const { winnerId } = await request.json();

    if (!winnerId) {
      return NextResponse.json(
        { error: 'Winner team ID is required' },
        { status: 400 }
      );
    }

    // Verify the winner team exists in this game
    const team = await prisma.team.findFirst({
      where: { 
        id: winnerId,
        gameId: gameId
      }
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Winner team not found in this game' },
        { status: 404 }
      );
    }

    const pointsToAward = 20; // Fixed 20 points for final round winner

    // Award points to the selected winner
    await prisma.team.update({
      where: { id: winnerId },
      data: {
        score: {
          increment: pointsToAward
        }
      }
    });

    // Update the answer record for the winner
    await prisma.answer.updateMany({
      where: {
        gameId: gameId,
        teamId: winnerId,
        roundId: 3, // Final round (0-indexed)
        questionId: 22 // Final question
      },
      data: {
        isCorrect: true,
        pointsAwarded: pointsToAward
      }
    });

    return NextResponse.json({
      success: true,
      winnerTeam: team,
      pointsAwarded: pointsToAward
    });

  } catch (error) {
    console.error('Error calculating final round score:', error);
    return NextResponse.json(
      { error: 'Failed to calculate final round score' },
      { status: 500 }
    );
  }
}
