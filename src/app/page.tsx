'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainMenu from '@/components/MainMenu';
import HostSetup from '@/components/HostSetup';
import JoinGame from '@/components/JoinGame';
import MultiplayerGameBoard from '@/components/MultiplayerGameBoard';

type AppState = 'menu' | 'host-setup' | 'join-game' | 'playing';

function HomeContent() {
  const searchParams = useSearchParams();
  const [appState, setAppState] = useState<AppState>('menu');
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState<string | null>(null);

  // Check for QR code join parameter on mount
  useEffect(() => {
    const joinParam = searchParams.get('join');
    if (joinParam) {
      setInitialJoinCode(joinParam);
      setAppState('join-game');
    }
  }, [searchParams]);

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
    setInitialJoinCode(null);
    // Clear URL parameter
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (appState === 'menu') {
    return <MainMenu onHostGame={handleHostGame} onJoinGame={handleJoinGame} />;
  }

  if (appState === 'host-setup') {
    return <HostSetup onGameCreated={handleGameCreatedOrJoined} />;
  }

  if (appState === 'join-game') {
    return (
      <JoinGame 
        onGameJoined={handleGameCreatedOrJoined} 
        onBackToMain={handleBackToMain}
        initialGameCode={initialJoinCode}
      />
    );
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vermilion-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
