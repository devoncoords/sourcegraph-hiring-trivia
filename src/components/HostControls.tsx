'use client';

import { useState, useEffect } from 'react';

interface HostControlsProps {
  game: any;
  currentRound: any;
  currentQuestion: any;
  gameId: string;
  onGameEnd: () => void;
}

export default function HostControls({ 
  game, 
  currentRound, 
  currentQuestion, 
  gameId, 
  onGameEnd 
}: HostControlsProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Calculate time left from timerEndsAt
  useEffect(() => {
    if (!game.timerEndsAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(game.timerEndsAt).getTime();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && !showResults) {
        setShowResults(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [game.timerEndsAt, showResults]);

  const startTimer = async () => {
    const timerDuration = currentRound?.id === 5 ? 60 : 30; // Final round gets 60 seconds
    await fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timerEndsAt: new Date(Date.now() + timerDuration * 1000).toISOString(),
        showResults: false
      })
    });
    setShowResults(false);
  };

  const revealAnswers = async () => {
    await fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showResults: true
      })
    });
    setShowResults(true);
  };

  const nextQuestion = async () => {
    const isLastQuestion = game.currentQuestion + 1 >= currentRound.questions.length;
    const isLastRound = game.currentRound + 1 >= 5; // 5 rounds total

    if (isLastQuestion && isLastRound) {
      // Game finished
      await fetch(`/api/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gamePhase: 'FINISHED'
        })
      });
    } else if (isLastQuestion) {
      // Next round
      await fetch(`/api/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRound: game.currentRound + 1,
          currentQuestion: 0,
          gamePhase: 'BETWEEN_ROUNDS',
          showResults: false,
          timerEndsAt: null
        })
      });
    } else {
      // Next question
      await fetch(`/api/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestion: game.currentQuestion + 1,
          showResults: false,
          timerEndsAt: null
        })
      });
    }
    setShowResults(false);
  };

  const startNextRound = async () => {
    await fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gamePhase: 'PLAYING'
      })
    });
  };

  // Between rounds view
  if (game.gamePhase === 'BETWEEN_ROUNDS') {
    const sortedTeams = [...game.teams].sort((a, b) => b.score - a.score);
    
    return (
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-vermilion-500 mb-4">
              Round {game.currentRound} Complete! 🎉
            </h2>
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Current Scores</h3>
              <div className="grid gap-3">
                {sortedTeams.map((team, index) => (
                  <div key={team.id} className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
                    <span className="flex items-center">
                      <span className="text-vermilion-500 font-bold mr-3">#{index + 1}</span>
                      {team.name}
                    </span>
                    <span className="text-xl font-bold text-vermilion-500">{team.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
            
            {currentRound && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {currentRound.emoji} {currentRound.title}
                </h3>
                <p className="text-gray-300">
                  {currentRound.theme}
                </p>
                {currentRound.pointsPerQuestion > 10 && (
                  <p className="text-vermilion-400 font-semibold mt-2">
                    ⭐ {currentRound.pointsPerQuestion} points per question!
                  </p>
                )}
              </div>
            )}
            
            <button
              onClick={startNextRound}
              className="px-8 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors text-lg"
            >
              Start Round {game.currentRound + 1} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Host Header */}
        <div className="bg-vermilion-500 rounded-lg p-4 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                HOST VIEW - {currentRound?.emoji} Round {game.currentRound + 1}
              </h1>
              <p>Question {game.currentQuestion + 1} of {currentRound?.questions.length}</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${timeLeft <= 5 && timeLeft > 0 ? 'text-red-200' : ''}`}>
                {timeLeft > 0 ? `${timeLeft}s` : game.timerEndsAt ? 'Time\'s Up!' : 'Ready'}
              </div>
              <div className="text-sm opacity-90">
                {currentRound?.pointsPerQuestion} points
              </div>
            </div>
          </div>
        </div>

        {/* Question Display */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6 text-center">{currentQuestion.text}</h2>
          <div className="grid gap-4">
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border text-lg ${
                  showResults || game.showResults
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-green-900 border-green-500 text-green-100'
                      : 'bg-gray-800 border-gray-700'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    <span className="text-vermilion-500 font-bold mr-4 text-xl">
                      {String.fromCharCode(65 + index)})
                    </span>
                    {option}
                  </span>
                  {(showResults || game.showResults) && index === currentQuestion.correctAnswer && (
                    <span className="text-green-400 text-xl">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Answers Summary */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Team Responses</h3>
          <div className="grid gap-3">
            {game.teams.map((team: any) => {
              const teamAnswer = game.answers?.find(
                (a: any) => a.teamId === team.id && 
                       a.roundId === game.currentRound && 
                       a.questionId === game.currentQuestion
              );
              
              return (
                <div key={team.id} className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.color || '#ff5544' }}
                    ></div>
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-vermilion-500 font-bold">{team.score} pts</span>
                    <div className="min-w-20 text-center">
                      {teamAnswer ? (
                        <span className={`px-2 py-1 rounded text-sm ${
                          showResults || game.showResults
                            ? teamAnswer.isCorrect
                              ? 'bg-green-900 text-green-200'
                              : 'bg-red-900 text-red-200'
                            : 'bg-blue-900 text-blue-200'
                        }`}>
                          {showResults || game.showResults
                            ? teamAnswer.isCorrect ? '✓ Correct' : '✗ Wrong'
                            : 'Answered'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Waiting...</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Host Controls */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-center space-x-4 mb-4">
            {!game.timerEndsAt && (
              <button
                onClick={startTimer}
                className="px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors"
              >
                Start Timer ({currentRound?.id === 5 ? '60' : '30'}s)
              </button>
            )}
            
            {timeLeft > 0 && (
              <button
                onClick={revealAnswers}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reveal Answers Early
              </button>
            )}

            {(timeLeft === 0 || showResults || game.showResults) && (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                {game.currentQuestion + 1 < currentRound.questions.length
                  ? 'Next Question →'
                  : game.currentRound + 1 < 5
                  ? 'Next Round →'
                  : 'Finish Game 🏆'}
              </button>
            )}
          </div>

          {(showResults || game.showResults) && currentQuestion.explanation && (
            <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
              <h4 className="font-semibold text-blue-200 mb-2">Explanation:</h4>
              <p className="text-blue-100">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Exit Button */}
        <div className="text-center mt-6">
          <button
            onClick={onGameEnd}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            End Game & Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
