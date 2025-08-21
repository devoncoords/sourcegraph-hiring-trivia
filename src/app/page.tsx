'use client';

import { useState } from 'react';
import { Team } from '@/types';
import TeamSetup from '@/components/TeamSetup';
import GameBoard from '@/components/GameBoard';
import FinalResults from '@/components/FinalResults';

export default function Home() {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [teams, setTeams] = useState<Team[]>([]);

  const handleTeamsCreated = (newTeams: Team[]) => {
    setTeams(newTeams);
    setGameState('playing');
  };

  const handleGameComplete = (finalTeams: Team[]) => {
    setTeams(finalTeams);
    setGameState('results');
  };

  const handlePlayAgain = () => {
    setGameState('setup');
    setTeams([]);
  };

  if (gameState === 'setup') {
    return <TeamSetup onTeamsCreated={handleTeamsCreated} />;
  }

  if (gameState === 'playing') {
    return <GameBoard teams={teams} onGameComplete={handleGameComplete} />;
  }

  if (gameState === 'results') {
    return <FinalResults teams={teams} onPlayAgain={handlePlayAgain} />;
  }

  return null;
}
