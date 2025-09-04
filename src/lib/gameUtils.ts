export function generateGameCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function calculateScore(isCorrect: boolean, pointsPerQuestion: number): number {
  return isCorrect ? pointsPerQuestion : 0;
}

export function getTimerDuration(roundId: number): number {
  // Different rounds could have different timer durations
  switch (roundId) {
    case 5: // Final round might need more time
      return 60;
    default:
      return 30;
  }
}
