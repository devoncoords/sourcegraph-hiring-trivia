'use client';

import { useEffect, useState } from 'react';

interface GameUpdateData {
  type: string;
  game: any;
}

export function useGameUpdates(gameId: string) {
  const [gameData, setGameData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    const eventSource = new EventSource(`/api/games/${gameId}/events`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: GameUpdateData = JSON.parse(event.data);
        if (data.type === 'gameUpdate') {
          setGameData(data.game);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [gameId]);

  return { gameData, isConnected };
}
