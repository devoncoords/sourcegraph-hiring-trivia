'use client';

import { useState } from 'react';

interface OpenEndedInputProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
  hasSubmitted: boolean;
  submittedAnswer?: string;
  placeholder?: string;
}

export default function OpenEndedInput({ 
  onSubmit, 
  disabled, 
  hasSubmitted, 
  submittedAnswer,
  placeholder = "Enter your answer"
}: OpenEndedInputProps) {
  const [inputValue, setInputValue] = useState(submittedAnswer || '');

  const handleSubmit = () => {
    if (!inputValue.trim() || hasSubmitted || disabled) return;
    onSubmit(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled || hasSubmitted}
          placeholder={placeholder}
          className={`w-full px-6 py-4 text-xl text-center bg-gray-800 border rounded-lg transition-colors ${
            hasSubmitted
              ? 'border-green-500 text-green-200 bg-green-900'
              : disabled
                ? 'border-gray-600 text-gray-400 cursor-not-allowed'
                : 'border-gray-700 text-white hover:border-vermilion-500 focus:border-vermilion-500 focus:outline-none focus:ring-1 focus:ring-vermilion-500'
          }`}
          maxLength={50}
        />
        {hasSubmitted && (
          <div className="absolute right-4 top-1/2 transform -y-1/2 text-green-400 text-xl">
            ✓
          </div>
        )}
      </div>

      {!hasSubmitted && !disabled && (
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className="w-full px-6 py-3 bg-vermilion-500 text-white font-semibold rounded-lg hover:bg-vermilion-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer →
        </button>
      )}

      {hasSubmitted && (
        <div className="text-center text-green-400 font-semibold">
          ✓ Answer submitted: &quot;{submittedAnswer || inputValue}&quot;
        </div>
      )}
    </div>
  );
}
