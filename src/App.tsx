/**
 * MISE — Production Memory System
 * AI-powered Production Memory system for filmmakers, producers, editors, VFX teams, and studio crews.
 */

import { useState, useCallback, useEffect } from 'react';
import { Scene, ChatMessage } from './types';
import { SCENES } from './data/mockProductionData';
import { TopBar } from './components/TopBar';
import { AskMiseView } from './components/AskMiseView';
import { SceneContextPanel } from './components/SceneContextPanel';
import { NewProductionModal } from './components/NewProductionModal';
import {
  sendQuestionToMise,
  resetSession,
  ensureSession,
  getOrCreateUserId,
  getOrCreateSessionId,
} from './services/adkService';

export default function App() {
  // Selected scene defaults to Scene 23 as mandated
  const [selectedScene, setSelectedScene] = useState<Scene>(SCENES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNewProductionOpen, setIsNewProductionOpen] = useState<boolean>(false);

  // Pre-initialize session on initial load
  useEffect(() => {
    const userId = getOrCreateUserId();
    const sessionId = getOrCreateSessionId();
    ensureSession(userId, sessionId).catch((err) => {
      console.warn('Initial session check:', err);
    });
  }, []);

  const handleSelectScene = useCallback((scene: Scene) => {
    setSelectedScene(scene);
  }, []);

  const handleSelectSceneByNumber = useCallback((sceneNumber: number) => {
    const target = SCENES.find((s) => s.number === sceneNumber);
    if (target) {
      setSelectedScene(target);
    }
  }, []);

  const handleSendMessage = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
      sceneContext: selectedScene.number,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Send question to Google ADK Cloud Run backend
      const answer = await sendQuestionToMise(trimmed, selectedScene.number);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        sceneContext: selectedScene.number,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Failed to retrieve answer from MISE ADK:', error);

      // Graceful error message as instructed: “MISE couldn’t reach Production Memory. Please try again.”
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'MISE couldn’t reach Production Memory. Please try again.',
        timestamp: new Date(),
        isError: true,
        sceneContext: selectedScene.number,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    resetSession();
    setMessages([]);
    const userId = getOrCreateUserId();
    const sessionId = getOrCreateSessionId();
    ensureSession(userId, sessionId);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090a0f] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Clean Top Bar: MISE | Production: SCOPE CREEP | Scene 23 dropdown | Connected */}
      <TopBar
        selectedScene={selectedScene}
        onSelectScene={handleSelectScene}
        onResetSession={handleResetSession}
        onOpenNewProduction={() => setIsNewProductionOpen(true)}
        isConnecting={isLoading}
      />

      {/* Main Experience: Center Ask MISE view + Right Scene Context Panel */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 w-full relative">
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <AskMiseView
            messages={messages}
            isLoading={isLoading}
            selectedScene={selectedScene}
            onSendMessage={handleSendMessage}
            onSelectSceneByNumber={handleSelectSceneByNumber}
            onResetSession={handleResetSession}
          />
        </div>

        {/* Right Sidebar: Compact Live Context (Approved asset, Decision, Continuity note) */}
        <SceneContextPanel
          selectedScene={selectedScene}
          onAskAbout={handleSendMessage}
        />
      </main>

      {/* New Production Modal */}
      <NewProductionModal
        isOpen={isNewProductionOpen}
        onClose={() => setIsNewProductionOpen(false)}
      />
    </div>
  );
}
