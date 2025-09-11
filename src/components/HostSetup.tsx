'use client';

import { useState } from 'react';

interface HostSetupProps {
  onGameCreated: (gameId: string, gameCode: string, isHost: boolean) => void;
}

export default function HostSetup({ onGameCreated }: HostSetupProps) {
  const [hostName, setHostName] = useState('');
  const [maxTeams, setMaxTeams] = useState(6);
  const [isCreating, setIsCreating] = useState(false);

  const createGame = async () => {
    if (!hostName.trim()) {
      alert('Please enter your name as the host!');
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
          maxTeams: maxTeams
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
          <h1 className="text-4xl font-bold mb-4 text-vermilion-500 font-display">
            🎯 Host Trivia Game
          </h1>
          <p className="text-xl text-gray-300 mb-2 font-body">
            Create a multiplayer Sourcegraph Hiring Trivia game!
          </p>
          <p className="text-lg text-vermilion-400 font-ui">
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Number of Teams
            </label>
            <select
              value={maxTeams}
              onChange={(e) => setMaxTeams(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-vermilion-500 focus:ring-1 focus:ring-vermilion-500"
            >
              <option value={3}>3 teams</option>
              <option value={4}>4 teams</option>
              <option value={5}>5 teams</option>
              <option value={6}>6 teams</option>
              <option value={8}>8 teams</option>
              <option value={10}>10 teams</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Teams will create their own names when they join
            </p>
          </div>

          <div className="bg-blue-900 rounded-lg p-4 mb-6 border border-blue-700">
            <h3 className="text-blue-200 font-semibold mb-2">📱 How It Works:</h3>
            <div className="text-blue-100 text-sm space-y-1">
              <p>1. You create the game and get a join code</p>
              <p>2. Teams join using the code and choose their team name</p>
              <p>3. Start the game when enough teams have joined</p>
              <p>4. Teams play from their own devices</p>
            </div>
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
          <p>4 rounds • Multiple choice questions • Real-time multiplayer</p>
        </div>
      </div>
    </div>
  );
}
