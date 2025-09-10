'use client';

import { useState, useEffect, useCallback } from 'react';

interface JoinGameProps {
  onGameJoined: (gameId: string, gameCode: string, isHost: boolean) => void;
  onBackToMain: () => void;
  initialGameCode?: string | null;
}

export default function JoinGame({ onGameJoined, onBackToMain, initialGameCode }: JoinGameProps) {
  const [gameCode, setGameCode] = useState(initialGameCode || '');
  const [teamName, setTeamName] = useState('');
  const [gameData, setGameData] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [step, setStep] = useState<'enter-code' | 'create-team'>('enter-code');

  const findGame = useCallback(async () => {
    if (!gameCode.trim()) {
      alert('Please enter a game code!');
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode: gameCode.trim().toUpperCase()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find game');
      }

      setGameData(data.game);
      setStep('create-team');
    } catch (error) {
      console.error('Error finding game:', error);
      alert('Game not found. Please check the code and try again.');
    } finally {
      setIsJoining(false);
    }
  }, [gameCode]);

  const createTeam = async () => {
    if (!teamName.trim()) {
      alert('Please enter a team name!');
      return;
    }

    setIsCreatingTeam(true);

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: gameData.id,
          teamName: teamName.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team');
      }

      onGameJoined(data.game.id, data.game.code, false);
    } catch (error) {
      console.error('Error creating team:', error);
      alert((error as Error).message || 'Failed to create team. Please try a different name.');
    } finally {
      setIsCreatingTeam(false);
    }
  };

  // Auto-join if we have an initial game code from QR scan
  useEffect(() => {
    if (initialGameCode) {
      findGame();
    }
  }, [initialGameCode, findGame]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'enter-code') {
        findGame();
      } else {
        createTeam();
      }
    }
  };

  if (step === 'create-team' && gameData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-vermilion-500">
              🏆 Create Your Team
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Game: <span className="font-mono text-vermilion-500">{gameData.code}</span>
            </p>
            <p className="text-gray-400">
              Choose a unique team name
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Name
              </label>
              <input
                type="text"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-vermilion-500 focus:ring-1 focus:ring-vermilion-500 text-center text-lg"
                maxLength={30}
              />
              <p className="text-xs text-gray-400 mt-1">
                This will be your team&apos;s display name during the game
              </p>
            </div>

            {gameData.teams && gameData.teams.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Teams Already Joined:</h3>
                <div className="space-y-1">
                  {gameData.teams.map((team: any) => (
                    <div key={team.id} className="text-sm text-gray-400 flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: team.color }}
                      ></div>
                      {team.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={createTeam}
                disabled={isCreatingTeam || !teamName.trim()}
                className="w-full px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingTeam ? 'Creating Team...' : 'Join Game as ' + (teamName.trim() || '[Team Name]') + ' →'}
              </button>

              <button
                onClick={() => setStep('enter-code')}
                className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Change Game Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-vermilion-500">
            🎯 Join Trivia Game
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Enter the game code to join
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
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
            <p className="text-xs text-gray-400 mt-1">
              Ask the host for the 6-digit game code
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={findGame}
              disabled={isJoining || !gameCode.trim()}
              className="w-full px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Finding Game...' : 'Find Game →'}
            </button>

            <button
              onClick={onBackToMain}
              className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Main Menu
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Next: Choose your team name</p>
        </div>
      </div>
    </div>
  );
}
