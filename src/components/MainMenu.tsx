'use client';

import Link from 'next/link';

interface MainMenuProps {
  onHostGame: () => void;
  onJoinGame: () => void;
}

export default function MainMenu({ onHostGame, onJoinGame }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-vermilion-500 font-display polysans-test">
            🎯 Sourcegraph Hiring Trivia
          </h1>
          <p className="text-xl text-gray-300 mb-4 font-body">
            Test your hiring knowledge across 4 exciting rounds!
          </p>
          <p className="text-lg text-vermilion-400 font-ui">
            Multiplayer • Real-time • Mobile-friendly
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-center">Host a Game</h2>
            <p className="text-gray-300 mb-6 text-center">
              Create a new trivia game and get a join code for your teams
            </p>
            <button
              onClick={onHostGame}
              className="w-full px-8 py-4 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors text-lg"
            >
              🎮 Host New Game
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-center">Join a Game</h2>
            <p className="text-gray-300 mb-6 text-center">
              Enter a game code to join an existing trivia game
            </p>
            <button
              onClick={onJoinGame}
              className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              📱 Join Game
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-vermilion-500">
            📋 Game Rules
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p>• <strong>Get into teams.</strong> No more than 5 people per team, and you can be a team of 1.</p>
            <p>• <strong>You have 30 seconds to choose your team name</strong> or else you will randomly be assigned a notoriously slow language or IDE.</p>
            <p>• <strong>There are 4 rounds of questions</strong> with 4 questions each.</p>
            <p>• <strong>You&apos;ll have 30 seconds to answer.</strong> Once you select your answer, you can&apos;t change it.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/preview"
            className="inline-block px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors mb-4"
          >
            📝 Preview Questions (Admin)
          </Link>
          <div className="text-sm text-gray-400">
            <p>Powered by <span className="text-vermilion-500 font-semibold">Amp</span> & <span className="text-blue-400 font-semibold">Sourcegraph</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
