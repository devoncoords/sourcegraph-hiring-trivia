'use client';

import { useState, useEffect } from 'react';
import { useGameUpdates } from '@/hooks/useGameUpdates';
import { triviaRounds } from '@/data/questions';
import TeamSelector from '@/components/TeamSelector';
import HostControls from '@/components/HostControls';
import PlayerView from '@/components/PlayerView';
import GameLobby from '@/components/GameLobby';

interface MultiplayerGameBoardProps {
  gameId: string;
  gameCode: string | null;
  isHost: boolean;
  onGameEnd: () => void;
}

export default function MultiplayerGameBoard({ 
  gameId, 
  gameCode, 
  isHost, 
  onGameEnd 
}: MultiplayerGameBoardProps) {
  const { gameData, isConnected } = useGameUpdates(gameId);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [hasSelectedTeam, setHasSelectedTeam] = useState(false);

  // Auto-select team for single-player testing or if only one team
  useEffect(() => {
    if (gameData?.teams && gameData.teams.length === 1 && !hasSelectedTeam) {
      setSelectedTeamId(gameData.teams[0].id);
      setHasSelectedTeam(true);
    }
  }, [gameData?.teams, hasSelectedTeam]);

  const handleTeamSelected = (teamId: string) => {
    setSelectedTeamId(teamId);
    setHasSelectedTeam(true);
  };

  // Loading state
  if (!gameData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vermilion-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">
            {isConnected ? 'Loading game...' : 'Connecting to game...'}
          </p>
          {gameCode && (
            <p className="text-sm text-gray-400 mt-2">
              Game Code: <span className="font-mono text-vermilion-500">{gameCode}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // Lobby - waiting for game to start
  if (gameData.gamePhase === 'LOBBY') {
    return (
      <GameLobby
        game={gameData}
        gameCode={gameCode}
        isHost={isHost}
        onStartGame={() => {
          if (isHost) {
            // Start the first round without automatic timer
            fetch(`/api/games/${gameId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                gamePhase: 'PLAYING',
                currentRound: 0,
                currentQuestion: 0
                // No timerEndsAt - host must manually start timer
              })
            });
          }
        }}
        onLeaveGame={onGameEnd}
      />
    );
  }

  // Team selection for players (not hosts)
  if (!isHost && !hasSelectedTeam) {
    return (
      <TeamSelector
        teams={gameData.teams}
        onTeamSelected={handleTeamSelected}
        onLeaveGame={onGameEnd}
        gameCode={gameCode}
      />
    );
  }

  const currentRound = triviaRounds[gameData.currentRound];
  const currentQuestion = currentRound?.questions[gameData.currentQuestion];

  // Game finished
  if (gameData.gamePhase === 'FINISHED') {
    const sortedTeams = [...gameData.teams].sort((a, b) => b.score - a.score);
    
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-vermilion-500">
              🏆 Game Complete!
            </h1>
            <div className="bg-gradient-to-r from-vermilion-600 to-vermilion-500 rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                🎉 {sortedTeams[0]?.name} Wins! 🎉
              </h2>
              <p className="text-white text-xl">
                Final Score: {sortedTeams[0]?.score} points
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">Final Leaderboard</h3>
            <div className="space-y-3">
              {sortedTeams.map((team, index) => (
                <div
                  key={team.id}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-600'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-500'
                      : index === 2
                      ? 'bg-gradient-to-r from-amber-900 to-amber-800 border border-amber-600'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">{team.name}</h4>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-vermilion-500">{team.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onGameEnd}
              className="px-8 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors"
            >
              Return to Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game view
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-red-900 text-red-100 p-2 text-center text-sm">
          ⚠️ Connection lost - trying to reconnect...
        </div>
      )}

      {isHost ? (
        <HostControls
          game={gameData}
          currentRound={currentRound}
          currentQuestion={currentQuestion}
          gameId={gameId}
          onGameEnd={onGameEnd}
        />
      ) : (
        <PlayerView
          game={gameData}
          currentRound={currentRound}
          currentQuestion={currentQuestion}
          selectedTeamId={selectedTeamId}
          gameId={gameId}
          onLeaveGame={onGameEnd}
        />
      )}
    </div>
  );
}
