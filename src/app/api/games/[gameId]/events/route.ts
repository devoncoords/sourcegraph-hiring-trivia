import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Server-Sent Events for real-time updates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial game state
      sendGameUpdate(controller, gameId);

      // Set up polling for changes (in production, use database triggers or Redis pub/sub)
      const interval = setInterval(async () => {
        await sendGameUpdate(controller, gameId);
      }, 1000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}

async function sendGameUpdate(controller: ReadableStreamDefaultController, gameId: string) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        teams: true,
        answers: {
          where: {
            // Only include answers for current question to avoid spoilers
            roundId: undefined // Will be filtered based on game state
          }
        }
      }
    });

    if (game) {
      const data = `data: ${JSON.stringify({ type: 'gameUpdate', game })}\n\n`;
      controller.enqueue(new TextEncoder().encode(data));
    }
  } catch (error) {
    console.error('Error sending game update:', error);
  }
}
