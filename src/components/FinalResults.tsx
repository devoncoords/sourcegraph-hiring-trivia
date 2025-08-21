'use client';

import { Team } from '@/types';

interface FinalResultsProps {
  teams: Team[];
  onPlayAgain: () => void;
}

export default function FinalResults({ teams, onPlayAgain }: FinalResultsProps) {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-vermilion-500">
            🏆 Final Results
          </h1>
          <div className="bg-gradient-to-r from-vermilion-600 to-vermilion-500 rounded-lg p-6 mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎉 Congratulations {winner.name}! 🎉
            </h2>
            <p className="text-white text-xl">
              Champions with {winner.score} points!
            </p>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
          <h3 className="text-2xl font-semibold mb-6 text-center">Final Leaderboard</h3>
          <div className="space-y-4">
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
                    <p className="text-gray-300 text-sm">
                      {index === 0 ? 'Champion!' : index === 1 ? 'Runner-up' : index === 2 ? 'Third Place' : 'Great effort!'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-vermilion-500">{team.score}</div>
                  <div className="text-sm text-gray-400">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-vermilion-500">
            🚀 Key Takeaways from Today&apos;s Trivia
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>
              • <strong>Better referrals:</strong> Employee referrals remain the highest quality source of candidates
            </p>
            <p>
              • <strong>Great candidate experience:</strong> First impressions matter - candidates decide quickly if they&apos;re interested
            </p>
            <p>
              • <strong>Faster processes:</strong> Long applications and slow decisions hurt our hiring success
            </p>
            <p>
              • <strong>Data-driven decisions:</strong> Understanding metrics helps us optimize our hiring funnel
            </p>
            <p>
              • <strong>Fair & inclusive practices:</strong> Knowing what questions are legal helps us hire the best talent
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-vermilion-500">{teams.length}</div>
            <div className="text-sm text-gray-400">Teams Played</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-vermilion-500">17</div>
            <div className="text-sm text-gray-400">Questions Asked</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-vermilion-500">5</div>
            <div className="text-sm text-gray-400">Rounds Completed</div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <button
            onClick={onPlayAgain}
            className="px-8 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors text-lg mr-4"
          >
            Play Again 🎮
          </button>
          
          <div className="mt-6 text-center text-gray-400">
            <p className="mb-2">Thanks for playing Sourcegraph Hiring Trivia!</p>
            <p className="text-sm">
              Powered by <span className="text-vermilion-500 font-semibold">Amp</span> & 
              <span className="text-blue-400 font-semibold"> Sourcegraph</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
