import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { triviaRounds } from '@/data/questions';
import { calculateScore } from '@/lib/gameUtils';

// Submit an answer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const { teamId, roundId, questionId, answerIndex, textAnswer } = await request.json();

    if (!teamId || roundId === undefined || questionId === undefined || (answerIndex === undefined && textAnswer === undefined)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the game and verify it exists
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

    // Verify team belongs to this game
    const team = game.teams.find((t: any) => t.id === teamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found in this game' },
        { status: 404 }
      );
    }

    // Get the question to check correctness
    const round = triviaRounds[roundId];
    const question = round?.questions[questionId];
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Handle open-ended vs multiple choice scoring
    let isCorrect = false;
    let finalAnswerIndex = answerIndex;

    if (question.type === 'open-ended' && textAnswer !== undefined) {
      // For open-ended questions, store the text answer but don't auto-award points
      // Scoring will be done manually via Price is Right scoring system
      isCorrect = false; // No automatic points for open-ended questions
      finalAnswerIndex = -1; // Use -1 to indicate text answer
    } else if (answerIndex !== undefined) {
      // Regular multiple choice scoring
      isCorrect = answerIndex === question.correctAnswer;
    }

    const pointsAwarded = calculateScore(isCorrect, round.pointsPerQuestion);

    // Check if answer already exists (prevent duplicate submissions)
    const existingAnswer = await prisma.answer.findUnique({
      where: {
        gameId_teamId_roundId_questionId: {
          gameId,
          teamId,
          roundId,
          questionId
        }
      }
    });

    if (existingAnswer) {
      return NextResponse.json(
        { error: 'Answer already submitted for this question' },
        { status: 409 }
      );
    }

    // Create the answer record
    const answer = await prisma.answer.create({
      data: {
        gameId,
        teamId,
        roundId,
        questionId,
        answerIndex: finalAnswerIndex,
        textAnswer: textAnswer || null,
        isCorrect,
        pointsAwarded
      }
    });

    // Update team score
    await prisma.team.update({
      where: { id: teamId },
      data: {
        score: {
          increment: pointsAwarded
        }
      }
    });

    return NextResponse.json({ 
      answer,
      isCorrect,
      pointsAwarded
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
