'use client';

interface TeamSelectorProps {
  teams: any[];
  onTeamSelected: (teamId: string) => void;
  onLeaveGame: () => void;
  gameCode: string | null;
}

export default function TeamSelector({ teams, onTeamSelected, onLeaveGame, gameCode }: TeamSelectorProps) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-vermilion-500">
            Choose Your Team
          </h1>
          {gameCode && (
            <p className="text-lg text-gray-300 mb-2">
              Game: <span className="font-mono text-vermilion-500">{gameCode}</span>
            </p>
          )}
          <p className="text-gray-400">
            Select which team you&apos;re playing for
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <div className="space-y-4">
            {teams.map((team, index) => (
              <button
                key={team.id}
                onClick={() => onTeamSelected(team.id)}
                className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-vermilion-500 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: team.color || '#ff5544' }}
                    ></div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                      <p className="text-sm text-gray-400">Current Score: {team.score} points</p>
                    </div>
                  </div>
                  <div className="text-vermilion-500 font-bold text-sm">
                    Team {index + 1}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p>No teams available</p>
              <p className="text-sm mt-2">Wait for the host to set up teams</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={onLeaveGame}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Leave Game
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Once you select a team, you&apos;ll be able to submit answers during the game</p>
        </div>
      </div>
    </div>
  );
}
