export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Round {
  id: number;
  title: string;
  theme: string;
  emoji: string;
  pointsPerQuestion: number;
  questions: Question[];
}

export interface Team {
  id: string;
  name: string;
  score: number;
  answers: { [roundId: number]: { [questionId: number]: number } };
}

export interface GameState {
  currentRound: number;
  currentQuestion: number;
  showResults: boolean;
  gamePhase: 'setup' | 'playing' | 'between-rounds' | 'final-scores';
  teams: Team[];
  rounds: Round[];
}
