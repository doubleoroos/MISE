/**
 * MISE — Production Memory System
 * AI-powered Production Memory system for filmmakers, producers, editors, VFX teams, and studio crews.
 */

import { useState, useCallback, useEffect } from 'react';
import { Scene, ChatMessage } from './types';
import { SCENES } from './data/mockProductionData';
import { TopBar } from './components/TopBar';
import { LeftColumn } from './components/LeftColumn';
import { CenterColumn } from './components/CenterColumn';
import { RightColumn } from './components/RightColumn';
import { sendQuestionToMise, resetSession, ensureSession, getOrCreateUserId, getOrCreateSessionId } from './services/adkService';
import { Film, Sparkles, Layers } from 'lucide-react';

export default function App() {
  // Selected scene defaults to Scene 23 as mandated
  const [selectedScene, setSelectedScene] = useState<Scene>(SCENES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'context' | 'chat' | 'memory'>('chat');

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

    setLastUserPrompt(trimmed);

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

      // Graceful error UI as instructed: “MISE couldn’t reach Production Memory. Please try again.”
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

  const handleRetryLastMessage = () => {
    if (lastUserPrompt) {
      handleSendMessage(lastUserPrompt);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090a0f] text-slate-100">
      {/* Top Bar Navigation */}
      <TopBar
        onResetSession={handleResetSession}
        selectedSceneNumber={selectedScene.number}
      />

      {/* Mobile Tab Switcher (Visible only on screens below lg) */}
      <div className="lg:hidden flex items-center justify-around border-b border-white/[0.08] bg-[#0d0f1a] py-2 px-3 text-xs font-mono shrink-0">
        <button
          onClick={() => setMobileTab('context')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileTab === 'context'
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          Scene Context
        </button>

        <button
          onClick={() => setMobileTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileTab === 'chat'
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Ask MISE
        </button>

        <button
          onClick={() => setMobileTab('memory')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileTab === 'memory'
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Memory Panels
        </button>
      </div>

      {/* Three-Column Desktop Interface */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: Production Context */}
        <div
          className={`h-full ${
            mobileTab === 'context' ? 'flex w-full' : 'hidden'
          } lg:flex lg:w-auto shrink-0`}
        >
          <LeftColumn
            selectedScene={selectedScene}
            onSelectScene={(scene) => {
              handleSelectScene(scene);
              setMobileTab('chat');
            }}
          />
        </div>

        {/* CENTER COLUMN: Ask MISE (Main Feature) */}
        <div
          className={`h-full flex-1 ${
            mobileTab === 'chat' ? 'flex' : 'hidden'
          } lg:flex min-w-0`}
        >
          <CenterColumn
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            selectedScene={selectedScene}
            onSelectSceneByNumber={handleSelectSceneByNumber}
            onRetryLastMessage={handleRetryLastMessage}
          />
        </div>

        {/* RIGHT COLUMN: Production Memory (Approved Assets, Decisions, Continuity) */}
        <div
          className={`h-full ${
            mobileTab === 'memory' ? 'flex w-full' : 'hidden'
          } lg:flex lg:w-auto shrink-0`}
        >
          <RightColumn selectedScene={selectedScene} />
        </div>
      </div>
    </div>
  );
}
