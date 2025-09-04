'use client';

import { useState } from 'react';
import MainMenu from '@/components/MainMenu';
import HostSetup from '@/components/HostSetup';
import JoinGame from '@/components/JoinGame';
import MultiplayerGameBoard from '@/components/MultiplayerGameBoard';

type AppState = 'menu' | 'host-setup' | 'join-game' | 'playing';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('menu');
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  const handleHostGame = () => {
    setAppState('host-setup');
  };

  const handleJoinGame = () => {
    setAppState('join-game');
  };

  const handleGameCreatedOrJoined = (id: string, code: string, host: boolean) => {
    setGameId(id);
    setGameCode(code);
    setIsHost(host);
    setAppState('playing');
  };

  const handleBackToMain = () => {
    setAppState('menu');
    setGameId(null);
    setGameCode(null);
    setIsHost(false);
  };

  if (appState === 'menu') {
    return <MainMenu onHostGame={handleHostGame} onJoinGame={handleJoinGame} />;
  }

  if (appState === 'host-setup') {
    return <HostSetup onGameCreated={handleGameCreatedOrJoined} />;
  }

  if (appState === 'join-game') {
    return <JoinGame onGameJoined={handleGameCreatedOrJoined} onBackToMain={handleBackToMain} />;
  }

  if (appState === 'playing' && gameId) {
    return (
      <MultiplayerGameBoard 
        gameId={gameId} 
        gameCode={gameCode}
        isHost={isHost} 
        onGameEnd={handleBackToMain} 
      />
    );
  }

  return null;
}
