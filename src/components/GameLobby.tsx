'use client';

import QRCodeGenerator from './QRCodeGenerator';

interface GameLobbyProps {
  game: any;
  gameCode: string | null;
  isHost: boolean;
  onStartGame: () => void;
  onLeaveGame: () => void;
}

export default function GameLobby({ game, gameCode, isHost, onStartGame, onLeaveGame }: GameLobbyProps) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-vermilion-500">
            🎯 Game Lobby
          </h1>
          {gameCode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-vermilion-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Join Code:</h2>
                <p className="text-4xl font-mono text-white font-bold tracking-widest">
                  {gameCode}
                </p>
                <p className="text-white mt-2">
                  Share this code with teams to join the game
                </p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  📱 Scan to Join
                </h3>
                <div className="flex justify-center">
                  <QRCodeGenerator gameCode={gameCode} size={180} />
                </div>
                <p className="text-gray-300 text-sm mt-3 text-center">
                  Scan with phone camera to join instantly
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h3 className="text-2xl font-semibold mb-4 text-center">Teams Ready to Play</h3>
          {game.teams && game.teams.length > 0 ? (
            <div className="grid gap-4">
              {game.teams.map((team: any, index: number) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: team.color || '#ff5544' }}
                    ></div>
                    <span className="text-xl font-semibold">{team.name}</span>
                  </div>
                  <div className="text-vermilion-500 font-bold">
                    Team {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-lg mb-4">No teams have joined yet</p>
              <p className="text-sm">Teams can join using the code above</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-vermilion-500">
            🎮 Game Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="mb-2">• <strong>5 rounds</strong> of hiring trivia</p>
              <p className="mb-2">• <strong>30-second timers</strong> per question</p>
              <p className="mb-2">• <strong>Real-time scoring</strong> and leaderboards</p>
            </div>
            <div>
              <p className="mb-2">• <strong>Multi-device</strong> team participation</p>
              <p className="mb-2">• <strong>Answer explanations</strong> after each question</p>
              <p className="mb-2">• <strong>Sourcegraph bonus round</strong> with double points!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {isHost && (
            <button
              onClick={onStartGame}
              disabled={!game.teams || game.teams.length < 1}
              className="px-8 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {game.teams && game.teams.length >= 1 ? 'Start Game 🚀' : 'Waiting for Teams...'}
            </button>
          )}
          
          <button
            onClick={onLeaveGame}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            {isHost ? 'Cancel Game' : 'Leave Game'}
          </button>
        </div>

        {isHost && (
          <div className="text-center mt-4 text-sm text-gray-400">
            <p>Game will start once you click &quot;Start Game&quot; - teams can join anytime during the lobby</p>
          </div>
        )}
      </div>
    </div>
  );
}
