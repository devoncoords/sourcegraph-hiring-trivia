'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Team } from '@/types';
import { triviaRounds } from '@/data/questions';

interface GameBoardProps {
  teams: Team[];
  onGameComplete: (finalTeams: Team[]) => void;
}

export default function GameBoard({ teams: initialTeams, onGameComplete }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    currentQuestion: 0,
    showResults: false,
    gamePhase: 'playing',
    teams: initialTeams,
    rounds: triviaRounds
  });

  const [selectedAnswers, setSelectedAnswers] = useState<{[teamId: string]: number}>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const currentRound = triviaRounds[gameState.currentRound];
  const currentQuestion = currentRound?.questions[gameState.currentQuestion];

  const showCorrectAnswer = useCallback(() => {
    setIsTimerActive(false);
    
    // Calculate scores
    const updatedTeams = gameState.teams.map(team => {
      const teamAnswer = selectedAnswers[team.id];
      const isCorrect = teamAnswer === currentQuestion.correctAnswer;
      
      const newScore = isCorrect ? team.score + currentRound.pointsPerQuestion : team.score;
      
      // Store the answer
      const newAnswers = { ...team.answers };
      if (!newAnswers[currentRound.id]) newAnswers[currentRound.id] = {};
      newAnswers[currentRound.id][currentQuestion.id] = teamAnswer ?? -1;

      return {
        ...team,
        score: newScore,
        answers: newAnswers
      };
    });

    setGameState(prev => ({
      ...prev,
      teams: updatedTeams,
      showResults: true
    }));
  }, [gameState.teams, selectedAnswers, currentQuestion, currentRound]);

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    showCorrectAnswer();
  }, [showCorrectAnswer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, handleTimeUp]);

  const startTimer = () => {
    setTimeLeft(30);
    setIsTimerActive(true);
  };

  const handleTeamAnswer = (teamId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [teamId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (gameState.currentQuestion + 1 < currentRound.questions.length) {
      // Next question in same round
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showResults: false
      }));
      setSelectedAnswers({});
      startTimer();
    } else if (gameState.currentRound + 1 < triviaRounds.length) {
      // Next round
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        currentQuestion: 0,
        showResults: false,
        gamePhase: 'between-rounds'
      }));
      setSelectedAnswers({});
    } else {
      // Game complete
      setGameState(prev => ({
        ...prev,
        gamePhase: 'final-scores'
      }));
      onGameComplete(gameState.teams);
    }
  };

  const startNextRound = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing'
    }));
    startTimer();
  };

  if (gameState.gamePhase === 'between-rounds') {
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-vermilion-500 mb-4">
              Round {gameState.currentRound} Complete! 🎉
            </h2>
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Current Scores</h3>
              <div className="grid gap-3">
                {gameState.teams
                  .sort((a, b) => b.score - a.score)
                  .map((team, index) => (
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
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {triviaRounds[gameState.currentRound].emoji} {triviaRounds[gameState.currentRound].title}
              </h3>
              <p className="text-gray-300">
                {triviaRounds[gameState.currentRound].theme}
              </p>
              {triviaRounds[gameState.currentRound].pointsPerQuestion > 10 && (
                <p className="text-vermilion-400 font-semibold mt-2">
                  ⭐ {triviaRounds[gameState.currentRound].pointsPerQuestion} points per question!
                </p>
              )}
            </div>
            <button
              onClick={startNextRound}
              className="px-8 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors text-lg"
            >
              Start Round {gameState.currentRound + 1} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-vermilion-500">
              {currentRound.emoji} Round {gameState.currentRound + 1}: {currentRound.title}
            </h1>
            <p className="text-gray-400">
              Question {gameState.currentQuestion + 1} of {currentRound.questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-vermilion-500'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-gray-400">
              {currentRound.pointsPerQuestion} points
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  gameState.showResults
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-green-900 border-green-500 text-green-100'
                      : 'bg-gray-800 border-gray-700'
                    : 'bg-gray-800 border-gray-700 hover:border-vermilion-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">
                    <span className="text-vermilion-500 font-bold mr-3">
                      {String.fromCharCode(65 + index)})
                    </span>
                    {option}
                  </span>
                  {gameState.showResults && index === currentQuestion.correctAnswer && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${gameState.teams.length}, 1fr)` }}>
          {gameState.teams.map((team) => (
            <div key={team.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="text-center mb-3">
                <h3 className="font-semibold text-lg">{team.name}</h3>
                <p className="text-vermilion-500 font-bold">{team.score} pts</p>
              </div>
              
              {!gameState.showResults && (
                <div className="space-y-2">
                  {currentQuestion.options.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleTeamAnswer(team.id, index)}
                      disabled={isTimerActive === false}
                      className={`w-full p-2 rounded text-sm font-medium transition-colors ${
                        selectedAnswers[team.id] === index
                          ? 'bg-vermilion-500 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </button>
                  ))}
                </div>
              )}

              {gameState.showResults && (
                <div className="text-center">
                  {selectedAnswers[team.id] === currentQuestion.correctAnswer ? (
                    <div className="text-green-400 font-semibold">
                      ✓ Correct! +{currentRound.pointsPerQuestion} pts
                    </div>
                  ) : selectedAnswers[team.id] !== undefined ? (
                    <div className="text-red-400">
                      ✗ Incorrect
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      No answer
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="text-center">
          {!isTimerActive && !gameState.showResults && (
            <button
              onClick={startTimer}
              className="px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors"
            >
              Start Question Timer
            </button>
          )}
          
          {gameState.showResults && (
            <div>
              {currentQuestion.explanation && (
                <div className="bg-blue-900 rounded-lg p-4 mb-4 border border-blue-700">
                  <p className="text-blue-100">{currentQuestion.explanation}</p>
                </div>
              )}
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors"
              >
                {gameState.currentQuestion + 1 < currentRound.questions.length
                  ? 'Next Question →'
                  : gameState.currentRound + 1 < triviaRounds.length
                  ? 'Next Round →'
                  : 'View Final Results →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
