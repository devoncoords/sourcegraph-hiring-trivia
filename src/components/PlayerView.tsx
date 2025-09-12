'use client';

import { useState, useEffect } from 'react';
import { formatQuestionText } from '@/utils/formatText';
import { gameSounds, enableAudio } from '@/utils/sounds';

interface PlayerViewProps {
  game: any;
  currentRound: any;
  currentQuestion: any;
  selectedTeamId: string | null;
  gameId: string;
  onLeaveGame: () => void;
}

export default function PlayerView({
  game,
  currentRound,
  currentQuestion,
  selectedTeamId,
  gameId,
  onLeaveGame
}: PlayerViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastSoundTime, setLastSoundTime] = useState<number | null>(null);

  const selectedTeam = game.teams?.find((t: any) => t.id === selectedTeamId);

  // Calculate time left
  useEffect(() => {
    if (!game.timerEndsAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(game.timerEndsAt).getTime();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [game.timerEndsAt]);

  // Play countdown sounds
  useEffect(() => {
    if (!soundEnabled || !timeLeft || timeLeft === lastSoundTime) return;

    // Play countdown sounds for final round
    if (currentRound?.id === 4) {
      gameSounds.playFinalRoundCountdown(timeLeft);
    } else {
      // Regular countdown sounds
      gameSounds.playCountdownWarning(timeLeft);
    }

    setLastSoundTime(timeLeft);

    // Play time's up sound
    if (timeLeft === 0) {
      setTimeout(() => gameSounds.playTimeUp(), 500);
    }
  }, [timeLeft, soundEnabled, lastSoundTime, currentRound]);

  // Check if team has already answered this question
  useEffect(() => {
    if (!selectedTeamId) return;
    
    const existingAnswer = game.answers?.find((a: any) => 
      a.teamId === selectedTeamId && 
      a.roundId === game.currentRound && 
      a.questionId === game.currentQuestion
    );
    
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.answerIndex);
      setHasSubmitted(true);
    } else {
      setSelectedAnswer(null);
      setHasSubmitted(false);
    }
  }, [game.answers, selectedTeamId, game.currentRound, game.currentQuestion]);

  const enableSounds = async () => {
    await enableAudio();
    setSoundEnabled(true);
  };

  const submitAnswer = async (answerIndex: number) => {
    if (!selectedTeamId || hasSubmitted || timeLeft === 0) return;

    // Enable audio on first interaction
    if (!soundEnabled) {
      await enableSounds();
    }

    setSelectedAnswer(answerIndex);

    try {
      const response = await fetch(`/api/games/${gameId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          roundId: game.currentRound,
          questionId: game.currentQuestion,
          answerIndex
        })
      });

      if (response.ok) {
        setHasSubmitted(true);
        if (soundEnabled) {
          gameSounds.playCorrectAnswer();
        }
      } else {
        const error = await response.json();
        console.error('Failed to submit answer:', error);
        if (soundEnabled) {
          gameSounds.playWrongAnswer();
        }
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setSelectedAnswer(null);
    }
  };

  const submitOpenEndedAnswer = async (textAnswer: string) => {
    if (!selectedTeamId || hasSubmitted || timeLeft === 0) return;

    try {
      const response = await fetch(`/api/games/${gameId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          roundId: game.currentRound,
          questionId: game.currentQuestion,
          textAnswer: textAnswer.trim()
        })
      });

      if (response.ok) {
        setHasSubmitted(true);
      } else {
        const error = await response.json();
        console.error('Failed to submit answer:', error);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  // Between rounds - show current scores
  if (game.gamePhase === 'BETWEEN_ROUNDS') {
    const sortedTeams = [...game.teams].sort((a, b) => b.score - a.score);
    const teamRank = sortedTeams.findIndex(t => t.id === selectedTeamId) + 1;
    
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-vermilion-500 mb-4">
              Round {game.currentRound} Complete!
            </h2>
            
            {selectedTeam && (
              <div className="bg-gray-900 rounded-lg p-6 mb-6 border-2 border-vermilion-500">
                <h3 className="text-xl font-semibold mb-2">Your Team: {selectedTeam.name}</h3>
                <div className="text-3xl font-bold text-vermilion-500 mb-2">
                  {selectedTeam.score} points
                </div>
                <div className="text-lg">
                  {teamRank === 1 ? '🥇 In the Lead!' : 
                   teamRank === 2 ? '🥈 2nd Place' :
                   teamRank === 3 ? '🥉 3rd Place' :
                   `#${teamRank} Position`}
                </div>
              </div>
            )}
            
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Current Standings</h3>
              <div className="space-y-2">
                {sortedTeams.slice(0, 5).map((team, index) => (
                  <div key={team.id} className={`flex justify-between items-center p-3 rounded ${
                    team.id === selectedTeamId ? 'bg-vermilion-900 border border-vermilion-500' : 'bg-gray-800'
                  }`}>
                    <span className="flex items-center">
                      <span className="text-vermilion-500 font-bold mr-3">#{index + 1}</span>
                      {team.name}
                    </span>
                    <span className="font-bold text-vermilion-500">{team.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {currentRound && (
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-2">
                  Coming Up: {currentRound.emoji} {currentRound.title}
                </h3>
                <p className="text-gray-300 mb-4">{currentRound.theme}</p>
                {currentRound.pointsPerQuestion > 10 && (
                  <p className="text-vermilion-400 font-semibold">
                    ⭐ Worth {currentRound.pointsPerQuestion} points per question!
                  </p>
                )}
              </div>
            )}

            <p className="text-gray-400">Waiting for host to start next round...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-300">Waiting for next question...</p>
          {selectedTeam && (
            <p className="text-gray-400 mt-2">
              Playing as: <span className="text-vermilion-500 font-semibold">{selectedTeam.name}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-xl font-bold text-vermilion-500">
                {currentRound?.emoji} Round {game.currentRound + 1}
              </h1>
              <p className="text-gray-400">
                Question {game.currentQuestion + 1} of {currentRound?.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                timeLeft <= 5 && timeLeft > 0 ? 'text-red-500' : 'text-vermilion-500'
              }`}>
                {timeLeft > 0 ? `${timeLeft}s` : game.timerEndsAt ? "Time&apos;s Up!" : 'Waiting...'}
              </div>
              <div className="text-sm text-gray-400">
                {currentRound?.pointsPerQuestion} points
              </div>
            </div>
          </div>
          
          {selectedTeam && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedTeam.color || '#ff5544' }}
                ></div>
                <span className="font-semibold">{selectedTeam.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={soundEnabled ? () => setSoundEnabled(false) : enableSounds}
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
                <span className="text-vermilion-500 font-bold">{selectedTeam.score} pts</span>
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-6 text-center">{formatQuestionText(currentQuestion.text)}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => submitAnswer(index)}
                disabled={hasSubmitted || timeLeft === 0 || !game.timerEndsAt}
                className={`w-full p-4 rounded-lg border text-left transition-colors ${
                  selectedAnswer === index
                    ? game.showResults
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-900 border-green-500 text-green-100'
                        : 'bg-red-900 border-red-500 text-red-100'
                      : 'bg-vermilion-500 border-vermilion-400 text-white'
                    : game.showResults && index === currentQuestion.correctAnswer
                      ? 'bg-green-900 border-green-500 text-green-100'
                      : hasSubmitted || timeLeft === 0 || !game.timerEndsAt
                        ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 border-gray-700 hover:border-vermilion-500 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-vermilion-500 font-bold mr-4 text-lg">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span className="text-lg">{option}</span>
                  </span>
                  {game.showResults && index === currentQuestion.correctAnswer && (
                    <span className="text-green-400 text-xl">✓</span>
                  )}
                  {selectedAnswer === index && !game.showResults && (
                    <span className="text-white text-xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        <div className="text-center mb-6">
          {!game.timerEndsAt && (
            <p className="text-gray-400">Waiting for host to start the timer...</p>
          )}
          {hasSubmitted && !game.showResults && (
            <div className="bg-green-900 border border-green-500 rounded-lg p-4">
              <p className="text-green-200 font-semibold">
                ✓ Answer submitted! Waiting for results...
              </p>
            </div>
          )}
          {timeLeft === 0 && !hasSubmitted && game.timerEndsAt && (
            <div className="bg-red-900 border border-red-500 rounded-lg p-4">
              <p className="text-red-200 font-semibold">
                ⏰ Time&apos;s up! No answer recorded.
              </p>
            </div>
          )}
        </div>

        {/* Explanation */}
        {game.showResults && currentQuestion.explanation && (
          <div className="bg-blue-900 border border-blue-500 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-200 mb-2">Explanation:</h4>
            <p className="text-blue-100">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Leave Game */}
        <div className="text-center">
          <button
            onClick={onLeaveGame}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Leave Game
          </button>
        </div>
      </div>
    </div>
  );
}
