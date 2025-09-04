'use client';

import { useState } from 'react';

interface HostSetupProps {
  onGameCreated: (gameId: string, gameCode: string, isHost: boolean) => void;
}

export default function HostSetup({ onGameCreated }: HostSetupProps) {
  const [hostName, setHostName] = useState('');
  const [teamNames, setTeamNames] = useState<string[]>(['', '', '']);
  const [numTeams, setNumTeams] = useState(3);
  const [isCreating, setIsCreating] = useState(false);

  const updateTeamName = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const addTeam = () => {
    if (numTeams < 6) {
      setNumTeams(numTeams + 1);
      setTeamNames([...teamNames, '']);
    }
  };

  const removeTeam = () => {
    if (numTeams > 2) {
      setNumTeams(numTeams - 1);
      setTeamNames(teamNames.slice(0, -1));
    }
  };

  const createGame = async () => {
    const validTeamNames = teamNames.slice(0, numTeams).filter(name => name.trim() !== '');
    
    if (!hostName.trim()) {
      alert('Please enter your name as the host!');
      return;
    }

    if (validTeamNames.length < 2) {
      alert('Please enter at least 2 team names to create the game!');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostName: hostName.trim(),
          teams: validTeamNames.map(name => ({ name: name.trim() }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create game');
      }

      onGameCreated(data.game.id, data.game.code, true);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-vermilion-500">
            🎯 Host Trivia Game
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Create a multiplayer Sourcegraph Hiring Trivia game!
          </p>
          <p className="text-lg text-vermilion-400">
            Teams will join using their devices
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name (Host)
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-vermilion-500 focus:ring-1 focus:ring-vermilion-500"
              maxLength={50}
            />
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center">Setup Team Names</h2>
          
          <div className="space-y-4 mb-6">
            {Array.from({ length: numTeams }, (_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-vermilion-500 font-semibold w-16">
                  Team {index + 1}:
                </span>
                <input
                  type="text"
                  placeholder="Enter team name"
                  value={teamNames[index] || ''}
                  onChange={(e) => updateTeamName(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-vermilion-500 focus:ring-1 focus:ring-vermilion-500"
                  maxLength={30}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={removeTeam}
              disabled={numTeams <= 2}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              - Remove Team
            </button>
            <button
              onClick={addTeam}
              disabled={numTeams >= 6}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Team
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={createGame}
              disabled={isCreating}
              className="px-8 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating Game...' : 'Create Game & Get Join Code →'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>5 rounds • Multiple choice questions • Real-time multiplayer</p>
        </div>
      </div>
    </div>
  );
}
