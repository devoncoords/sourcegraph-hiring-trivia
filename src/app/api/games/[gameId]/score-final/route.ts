import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { triviaRounds } from '@/data/questions';
import { calculatePriceIsRightWinner, parseNumberFromText, TeamGuess } from '@/utils/priceIsRight';

// Calculate Price is Right scoring for final round
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;

    // Get the game with all teams and answers
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        teams: true,
        answers: {
          where: {
            roundId: 3, // Final round (0-indexed)
            questionId: 22 // Final question
          }
        }
      }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Get the final question
    const finalRound = triviaRounds[3]; // Round 4 (0-indexed)
    const finalQuestion = finalRound?.questions[0]; // Only one question in final round

    if (!finalQuestion || finalQuestion.type !== 'open-ended') {
      return NextResponse.json(
        { error: 'Final question not found or not open-ended' },
        { status: 400 }
      );
    }

    // Prepare team guesses
    const teamGuesses: TeamGuess[] = game.teams.map((team: any) => {
      const answer = game.answers.find((a: any) => a.teamId === team.id);
      return {
        teamId: team.id,
        teamName: team.name,
        guess: 0, // Will be calculated
        originalText: answer?.textAnswer || '0'
      };
    });

    // Calculate Price is Right winner
    const { winners, results } = calculatePriceIsRightWinner(
      teamGuesses,
      finalQuestion.correctValue || 26196
    );

    // Award points to winners
    const pointsToAward = finalRound.pointsPerQuestion;
    const winnerIds = winners.map(w => w.teamId);

    if (winnerIds.length > 0) {
      // Update winner team scores
      await prisma.team.updateMany({
        where: {
          id: { in: winnerIds },
          gameId: gameId
        },
        data: {
          score: {
            increment: pointsToAward
          }
        }
      });

      // Update answer records to mark winners as correct
      await prisma.answer.updateMany({
        where: {
          gameId: gameId,
          teamId: { in: winnerIds },
          roundId: 3,
          questionId: 22
        },
        data: {
          isCorrect: true,
          pointsAwarded: pointsToAward
        }
      });
    }

    return NextResponse.json({
      success: true,
      correctAnswer: finalQuestion.correctValue,
      winners: winners,
      results: results,
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
