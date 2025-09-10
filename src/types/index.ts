export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  type?: 'multiple-choice' | 'open-ended';
  correctValue?: number; // For open-ended questions with numeric answers
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
  answers: { [roundId: number]: { [questionId: number]: number | string } };
}

export interface GameState {
  currentRound: number;
  currentQuestion: number;
  showResults: boolean;
  gamePhase: 'setup' | 'playing' | 'between-rounds' | 'final-scores';
  teams: Team[];
  rounds: Round[];
}
