'use client';

import { useState } from 'react';
import Link from 'next/link';
import { triviaRounds } from '@/data/questions';

export default function QuestionPreview() {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswerRevealed, setCorrectAnswerRevealed] = useState(false);

  const currentRound = triviaRounds[currentRoundIndex];
  const currentQuestion = currentRound?.questions[currentQuestionIndex];

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < currentRound.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentRoundIndex + 1 < triviaRounds.length) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setCurrentQuestionIndex(0);
    }
    setShowExplanation(false);
    setCorrectAnswerRevealed(false);
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
      setCurrentQuestionIndex(triviaRounds[currentRoundIndex - 1].questions.length - 1);
    }
    setShowExplanation(false);
    setCorrectAnswerRevealed(false);
  };

  const goToRound = (roundIndex: number) => {
    setCurrentRoundIndex(roundIndex);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setCorrectAnswerRevealed(false);
  };

  const revealAnswer = () => {
    setCorrectAnswerRevealed(true);
    setShowExplanation(true);
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vermilion-500 font-display mb-2">
            📝 Question Preview Tool
          </h1>
          <p className="text-gray-400">
            Preview and test all trivia questions without starting a game
          </p>
        </div>

        {/* Round Navigation */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Jump to Round:</h2>
          <div className="flex flex-wrap gap-2">
            {triviaRounds.map((round, index) => (
              <button
                key={round.id}
                onClick={() => goToRound(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentRoundIndex === index
                    ? 'bg-vermilion-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {round.emoji} Round {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Display */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-vermilion-500 font-display">
                {currentRound.emoji} {currentRound.title}
              </h2>
              <p className="text-gray-400 mt-1">{currentRound.theme}</p>
              <p className="text-sm text-vermilion-400 mt-1">
                {currentRound.pointsPerQuestion} points per question
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-300">
                Question {currentQuestionIndex + 1} of {currentRound.questions.length}
              </div>
              <div className="text-sm text-gray-400">
                Round {currentRoundIndex + 1} of {triviaRounds.length}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 font-ui">{currentQuestion.text}</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    correctAnswerRevealed && index === currentQuestion.correctAnswer
                      ? 'bg-green-900 border-green-500 text-green-100'
                      : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">
                      <span className="text-vermilion-500 font-bold mr-3">
                        {String.fromCharCode(65 + index)})
                      </span>
                      {option}
                    </span>
                    {correctAnswerRevealed && index === currentQuestion.correctAnswer && (
                      <span className="text-green-400 text-xl">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showExplanation && currentQuestion.explanation && (
            <div className="bg-blue-900 rounded-lg p-4 border border-blue-700 mb-4">
              <h4 className="font-semibold text-blue-200 mb-2">Explanation:</h4>
              <div className="text-blue-100 font-body">
                {currentQuestion.explanation.includes('https://') ? (
                  <div>
                    <p className="mb-2">
                      {currentQuestion.explanation.split('See handbook:')[0].trim()}
                    </p>
                    {currentQuestion.explanation.includes('See handbook:') && (
                      <a 
                        href={currentQuestion.explanation.split('See handbook: ')[1]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 underline break-all"
                      >
                        📖 View in Sourcegraph Handbook
                      </a>
                    )}
                  </div>
                ) : (
                  currentQuestion.explanation
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentRoundIndex === 0 && currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex space-x-3">
              <button
                onClick={revealAnswer}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reveal Answer
              </button>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {showExplanation ? 'Hide' : 'Show'} Explanation
              </button>
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentRoundIndex === triviaRounds.length - 1 && 
                       currentQuestionIndex === currentRound.questions.length - 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Question Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {triviaRounds.map((round, roundIndex) => (
            <div key={round.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold text-vermilion-500 mb-2">
                {round.emoji} Round {roundIndex + 1}
              </h3>
              <p className="text-sm text-gray-400 mb-2">{round.title}</p>
              <p className="text-xs text-gray-500">{round.questions.length} questions</p>
              <p className="text-xs text-vermilion-400">{round.pointsPerQuestion} pts each</p>
            </div>
          ))}
        </div>

        {/* Back to Main */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors inline-block"
          >
            ← Back to Trivia Game
          </Link>
        </div>
      </div>
    </div>
  );
}
