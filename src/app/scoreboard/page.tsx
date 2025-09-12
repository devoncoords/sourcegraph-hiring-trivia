'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameUpdates } from '@/hooks/useGameUpdates';

function ScoreboardContent() {
  const searchParams = useSearchParams();
  const [gameCode, setGameCode] = useState('');
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { gameData, isConnected } = useGameUpdates(gameId || '');

  // Check for game code in URL parameter
  useEffect(() => {
    const codeParam = searchParams.get('game');
    if (codeParam) {
      setGameCode(codeParam);
      findGame(codeParam);
    }
  }, [searchParams]);

  const findGame = async (code: string) => {
    try {
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameCode: code.toUpperCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Game not found');
      }

      setGameId(data.game.id);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setGameId(null);
    }
  };

  const handleGameCodeSubmit = () => {
    if (gameCode.trim()) {
      findGame(gameCode.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGameCodeSubmit();
    }
  };

  // Loading state
  if (gameId && !gameData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vermilion-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">
            {isConnected ? 'Loading game...' : 'Connecting to game...'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Game Code: <span className="font-mono text-vermilion-500">{gameCode}</span>
          </p>
        </div>
      </div>
    );
  }

  // Game code entry
  if (!gameId || error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-vermilion-500 font-display">
              📊 Live Scoreboard
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Display live game scores
            </p>
            <p className="text-gray-400">
              Enter game code to show live scoreboard
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            {error && (
              <div className="bg-red-900 border border-red-500 rounded-lg p-3 mb-4">
                <p className="text-red-200 text-sm">❌ {error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-vermilion-500 focus:ring-1 focus:ring-vermilion-500 text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleGameCodeSubmit}
              disabled={!gameCode.trim()}
              className="w-full px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Show Live Scoreboard →
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>Perfect for displaying scores on a second screen or projector</p>
          </div>
        </div>
      </div>
    );
  }

  // Live scoreboard display
  const sortedTeams = gameData?.teams ? [...gameData.teams].sort((a, b) => b.score - a.score) : [];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-vermilion-500 font-display">
            🏆 Live Scoreboard
          </h1>
          <div className="text-2xl text-gray-300 mb-2">
            Game: <span className="font-mono text-vermilion-500">{gameCode}</span>
          </div>
          <div className="text-lg text-gray-400">
            {gameData?.gamePhase === 'LOBBY' ? 'Waiting for game to start...' :
             gameData?.gamePhase === 'FINISHED' ? 'Game Complete!' :
             gameData?.gamePhase === 'BETWEEN_ROUNDS' ? `Round ${gameData.currentRound} Complete` :
             `Round ${(gameData?.currentRound || 0) + 1} • Question ${(gameData?.currentQuestion || 0) + 1}`}
          </div>
          {!isConnected && (
            <div className="text-red-400 mt-2">⚠️ Connection lost - trying to reconnect...</div>
          )}
        </div>

        {/* Scoreboard */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="bg-vermilion-500 p-4">
            <h2 className="text-2xl font-bold text-white text-center">Current Standings</h2>
          </div>
          
          <div className="p-6">
            {sortedTeams.length > 0 ? (
              <div className="space-y-4">
                {sortedTeams.map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex justify-between items-center p-6 rounded-lg transition-all ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border-2 border-yellow-500 shadow-lg'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-400'
                        : index === 2
                        ? 'bg-gradient-to-r from-amber-900 to-amber-700 border-2 border-amber-500'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-6">
                      <div className="text-4xl font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white">{team.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: team.color || '#ff5544' }}
                          ></div>
                          <p className="text-lg text-gray-300">
                            {index === 0 ? 'Leading!' : index === 1 ? 'Runner-up' : index === 2 ? 'Third Place' : 'In the game'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-vermilion-500">{team.score}</div>
                      <div className="text-lg text-gray-400">points</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-xl">Waiting for teams to join...</p>
              </div>
            )}
          </div>
        </div>

        {/* Game Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-vermilion-500">{sortedTeams.length}</div>
            <div className="text-sm text-gray-400">Teams Playing</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-vermilion-500">
              {gameData?.gamePhase === 'FINISHED' ? 'Complete' : `${(gameData?.currentRound || 0) + 1}/4`}
            </div>
            <div className="text-sm text-gray-400">Rounds</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-vermilion-500">
              {isConnected ? '🟢 Live' : '🔴 Offline'}
            </div>
            <div className="text-sm text-gray-400">Connection</div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>Auto-refreshes with real-time game updates</p>
          <p className="text-xs mt-2">Perfect for projection or second screen display</p>
        </div>
      </div>
    </div>
  );
}

export default function LiveScoreboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScoreboardContent />
    </div>
  );
}
