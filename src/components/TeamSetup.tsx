'use client';

import { useState } from 'react';
import { Team } from '@/types';

interface TeamSetupProps {
  onTeamsCreated: (teams: Team[]) => void;
}

export default function TeamSetup({ onTeamsCreated }: TeamSetupProps) {
  const [teamNames, setTeamNames] = useState<string[]>(['', '', '']);
  const [numTeams, setNumTeams] = useState(3);

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

  const startGame = () => {
    const validTeamNames = teamNames.slice(0, numTeams).filter(name => name.trim() !== '');
    
    if (validTeamNames.length < 2) {
      alert('Please enter at least 2 team names to start the game!');
      return;
    }

    const teams: Team[] = validTeamNames.map((name, index) => ({
      id: `team-${index + 1}`,
      name: name.trim(),
      score: 0,
      answers: {}
    }));

    onTeamsCreated(teams);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-vermilion-500 font-display">
            🎯 Sourcegraph Hiring Trivia
          </h1>
          <p className="text-xl text-gray-300 mb-2 font-body">
            Test your hiring knowledge across 5 rounds of questions!
          </p>
          <p className="text-lg text-vermilion-400 font-ui">
            Powered by Amp & Sourcegraph
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6 text-center">Setup Teams</h2>
          
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
              onClick={startGame}
              className="px-8 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors text-lg"
            >
              Start Trivia Game →
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>5 rounds • Multiple choice questions • Real-time scoring</p>
        </div>
      </div>
    </div>
  );
}
