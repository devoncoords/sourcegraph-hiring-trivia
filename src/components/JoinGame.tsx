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
  const [teamNameTimer, setTeamNameTimer] = useState(30);

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
      setTeamNameTimer(30); // Start 30 second timer
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

      // Store the team ID for automatic assignment
      localStorage.setItem('selectedTeamId', data.team.id);
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

  const handleTimeUp = useCallback(async () => {
    if (isCreatingTeam) return;

    // Auto-generate team name from predefined list
    const defaultNames = ['Rust', 'Scala', 'C++', 'JetBrains'];
    const existingNames = gameData?.teams?.map((t: any) => t.name) || [];
    const availableNames = defaultNames.filter(name => !existingNames.includes(name));
    
    const defaultName = availableNames.length > 0 
      ? availableNames[0] 
      : `Team ${(gameData?.teams?.length || 0) + 1}`;
    
    setTeamName(defaultName);
    
    // Auto-submit with default name
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameData.id,
          teamName: defaultName
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the team ID for automatic assignment
        localStorage.setItem('selectedTeamId', data.team.id);
        onGameJoined(data.game.id, data.game.code, false);
      } else {
        // If default name fails, try with timestamp
        const timestampName = `Team ${Date.now().toString().slice(-4)}`;
        const retryResponse = await fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameId: gameData.id,
            teamName: timestampName
          })
        });

        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          localStorage.setItem('selectedTeamId', retryData.team.id);
          onGameJoined(retryData.game.id, retryData.game.code, false);
        } else {
          alert('Time expired. Please try joining again.');
          setStep('enter-code');
        }
      }
    } catch {
      alert('Time expired. Please try joining again.');
      setStep('enter-code');
    }
  }, [isCreatingTeam, gameData, onGameJoined]);

  // Team name timer countdown
  useEffect(() => {
    if (step !== 'create-team' || teamNameTimer <= 0) return;

    const timer = setInterval(() => {
      setTeamNameTimer((prev) => {
        if (prev <= 1) {
          // Time's up - create team with default name or kick back
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, teamNameTimer, handleTimeUp]);

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
            <div className={`text-3xl font-bold mb-2 ${teamNameTimer <= 10 ? 'text-red-500' : 'text-vermilion-500'}`}>
              ⏱️ {teamNameTimer}s
            </div>
            <p className="text-gray-400">
              Choose a unique team name quickly!
            </p>
          </div>

          <div className="bg-orange-900 rounded-lg p-4 mb-6 border border-orange-700">
            <h3 className="text-orange-200 font-semibold mb-2">⚠️ Warning:</h3>
            <p className="text-orange-100 text-sm">
              If you are too slow to come up with a team name, you will automatically get assigned one of these team names: <span className="font-semibold">Rust</span>, <span className="font-semibold">Scala</span>, <span className="font-semibold">C++</span>, or <span className="font-semibold">JetBrains</span>.
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
                disabled={teamNameTimer === 0}
                className={`w-full px-4 py-3 border rounded-lg text-center text-lg transition-colors ${
                  teamNameTimer === 0
                    ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-vermilion-500 focus:ring-1 focus:ring-vermilion-500'
                }`}
                maxLength={30}
              />
              <p className="text-xs text-gray-400 mt-1">
                This will be your team&apos;s display name during the game
              </p>
              {teamNameTimer <= 10 && teamNameTimer > 0 && (
                <div className="mt-2 p-2 bg-red-900 border border-red-500 rounded text-red-200 text-sm text-center">
                  ⚠️ Hurry up! {teamNameTimer} seconds left
                </div>
              )}
              {teamNameTimer === 0 && (
                <div className="mt-2 p-2 bg-gray-800 border border-gray-600 rounded text-gray-300 text-sm text-center">
                  ⏱️ Time expired! Auto-assigning team name...
                </div>
              )}
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
                disabled={isCreatingTeam || !teamName.trim() || teamNameTimer === 0}
                className="w-full px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingTeam ? 'Creating Team...' : 
                 teamNameTimer === 0 ? 'Time Expired' :
                 'Join Game as ' + (teamName.trim() || '[Team Name]') + ' →'}
              </button>

              <button
                onClick={() => {
                  setStep('enter-code');
                  setTeamNameTimer(30);
                }}
                disabled={teamNameTimer === 0}
                className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
