
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { AppMode } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ImageEditor from './components/ImageEditor';
import LiteInterface from './components/LiteInterface';
import CompetitionInterface from './components/CompetitionInterface';
import Welcome from './components/Welcome';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.CHAT);
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleModeChange = (mode: AppMode) => {
    setActiveMode(mode);
    if (mode !== AppMode.CHAT) {
      setSelectedChatId(null);
    }
  };

  const handleSelectChat = (chatId: string | null) => {
    setSelectedChatId(chatId);
    setActiveMode(AppMode.CHAT);
  };

  const renderContent = () => {
    switch (activeMode) {
      case AppMode.CHAT:
        return <ChatInterface chatId={selectedChatId} onChatCreated={setSelectedChatId} />;
      case AppMode.IMAGE:
        return <ImageEditor />;
      case AppMode.LITE:
        return <LiteInterface />;
      case AppMode.COMPETITION:
        return <CompetitionInterface />;
      default:
        return <ChatInterface chatId={selectedChatId} onChatCreated={setSelectedChatId} />;
    }
  };

  if (showWelcome) {
    return <Welcome onEnter={() => setShowWelcome(false)} />;
  }

  if (authLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-transparent text-slate-200">
      {/* Sidebar - Visible on LG screens */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar 
          activeMode={activeMode} 
          onSelectMode={handleModeChange} 
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
        />
      </div>
      
      {/* Global Scrollable Main Content */}
      <main className="flex-1 relative bg-slate-950/40 backdrop-blur-sm lg:border-l border-white/5">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
