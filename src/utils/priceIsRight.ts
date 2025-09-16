// Price is Right scoring utilities
export interface TeamGuess {
  teamId: string;
  teamName: string;
  guess: number;
  originalText: string;
}

export function parseNumberFromText(text: string): number | null {
  if (!text || typeof text !== 'string') return null;
  
  // Remove commas, spaces, and other non-digit characters except decimal points
  const cleanText = text.replace(/[^0-9.]/g, '');
  const number = parseFloat(cleanText);
  
  return isNaN(number) ? null : Math.floor(number); // Round down to whole number
}

export function calculatePriceIsRightWinner(
  teamGuesses: TeamGuess[],
  correctAnswer: number
): { winners: TeamGuess[]; results: TeamGuess[]; allWentOver: boolean } {
  
  // Parse and validate all guesses
  const validGuesses = teamGuesses
    .map(team => ({
      ...team,
      guess: parseNumberFromText(team.originalText) || 0
    }))
    .filter(team => team.guess > 0); // Remove invalid guesses

  // Classic Price is Right: Find guesses that don't go over
  const validBids = validGuesses.filter(team => team.guess <= correctAnswer);
  
  if (validBids.length === 0) {
    // No one was under or equal - everyone went over, no winner
    return { 
      winners: [], 
      results: validGuesses.sort((a, b) => Math.abs(a.guess - correctAnswer) - Math.abs(b.guess - correctAnswer)),
      allWentOver: true
    };
  }

  // Find the highest bid that doesn't go over (classic Price is Right)
  const winningGuess = Math.max(...validBids.map(team => team.guess));
  const winners = validBids.filter(team => team.guess === winningGuess);

  // Sort results: valid bids first (sorted by closeness), then over bids
  const sortedResults = validGuesses.sort((a, b) => {
    // Valid bids (under or equal) come first
    if (a.guess <= correctAnswer && b.guess > correctAnswer) return -1;
    if (a.guess > correctAnswer && b.guess <= correctAnswer) return 1;
    
    // Both valid or both over - sort by closeness
    const distanceA = Math.abs(a.guess - correctAnswer);
    const distanceB = Math.abs(b.guess - correctAnswer);
    return distanceA - distanceB;
  });

  return { winners, results: sortedResults, allWentOver: false };
}

export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}

export function getDistanceFromAnswer(guess: number, correctAnswer: number): {
  distance: number;
  isOver: boolean;
  isUnder: boolean;
  isExact: boolean;
} {
  const distance = Math.abs(guess - correctAnswer);
  return {
    distance,
    isOver: guess > correctAnswer,
    isUnder: guess < correctAnswer,
    isExact: guess === correctAnswer
  };
}
