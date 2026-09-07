import React, { useState, useRef, useEffect } from 'react';
import { Scene, ChatMessage } from '../types';
import { EXAMPLE_QUESTIONS } from '../data/mockProductionData';
import { SourceCards, getRelevantSources } from './SourceCard';
import { Sparkles, ArrowRight, Copy, Check, CornerDownLeft, Film } from 'lucide-react';
import Markdown from 'react-markdown';

interface AskMiseViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  selectedScene: Scene;
  onSendMessage: (query: string) => void;
  onSelectSceneByNumber: (sceneNumber: number) => void;
  onResetSession: () => void;
}

export const AskMiseView: React.FC<AskMiseViewProps> = ({
  messages,
  isLoading,
  selectedScene,
  onSendMessage,
  onSelectSceneByNumber,
  onResetSession,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation when messages change or loading
  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputQuery.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInputQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipClick = (questionText: string, sceneNum: number) => {
    if (sceneNum !== selectedScene.number) {
      onSelectSceneByNumber(sceneNum);
    }
    onSendMessage(questionText);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      id="ask-mise-main-view"
      className="flex-1 flex flex-col items-center justify-between w-full h-full overflow-y-auto px-4 sm:px-6 relative"
    >
      {/* Background Soft Cinematic Radial Ambient Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-start py-8 sm:py-10">
        {/* HERO HEADER: "Ask MISE" & Subtitle */}
        <div
          id="ask-mise-header"
          className={`text-center transition-all duration-300 ${
            hasMessages ? 'mb-5 sm:mb-6' : 'mb-8 sm:mb-10 pt-2 sm:pt-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-300 font-semibold">
              Production Memory System
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Ask MISE
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-xl mx-auto font-normal leading-relaxed">
            Search scenes, assets, decisions and continuity.
          </p>
        </div>

        {/* PRIMARY CHAT INPUT AREA (Visual Focus) */}
        <div id="primary-chat-input-container" className="w-full mb-6 relative">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center rounded-2xl bg-gradient-to-b from-[#131f3e]/90 to-[#0c152a]/95 border border-indigo-500/30 hover:border-indigo-500/50 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all duration-200 shadow-2xl shadow-black/40 backdrop-blur-xl group"
          >
            <input
              ref={inputRef}
              id="mise-query-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Search or ask MISE about scenes, approved assets, decisions, continuity..."
              className="w-full bg-transparent px-5 sm:px-6 py-4.5 sm:py-5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none disabled:opacity-50 pr-24 sm:pr-28 font-normal"
            />

            <div className="absolute right-3 flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 px-2 py-1 rounded-md border border-white/[0.08] bg-white/[0.03]">
                <CornerDownLeft className="w-3 h-3 text-slate-400" />
                Enter
              </span>

              <button
                id="btn-submit-query"
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-medium text-xs shadow-lg shadow-indigo-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5 shrink-0"
              >
                <span className="font-semibold">Ask</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* ELEGANT QUICK ACTION QUESTION CHIPS */}
          <div id="suggested-question-chips" className="mt-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_QUESTIONS.map((q) => {
                return (
                  <button
                    key={q.id}
                    id={`btn-suggested-${q.id}`}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleChipClick(q.text, q.sceneNumber)}
                    className="text-xs sm:text-sm text-left px-3.5 py-2 rounded-xl bg-[#0f1933]/70 hover:bg-[#152347] border border-white/[0.08] hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all duration-150 disabled:opacity-40 flex items-center gap-2 group shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-cyan-400 transition-colors shrink-0" />
                    <span>{q.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ANSWER STREAM CONTAINER */}
        <div id="answers-container" className="w-full space-y-6 pb-8">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            const sceneNum = message.sceneContext || selectedScene.number;

            if (isUser) {
              return (
                <div
                  key={message.id}
                  id={`msg-user-${message.id}`}
                  className="flex items-center justify-between gap-3 pt-6 pb-2 border-b border-white/[0.06]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                      Question
                    </span>
                    <h3 className="text-base sm:text-lg font-medium text-white">
                      {message.content}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    Scene {sceneNum}
                  </span>
                </div>
              );
            }

            // Assistant Response
            const sources = getRelevantSources(
              // find the preceding user message query if available
              messages.find((m, idx) => messages[idx + 1]?.id === message.id)?.content || '',
              message.content,
              sceneNum
            );

            return (
              <div
                key={message.id}
                id={`msg-assistant-${message.id}`}
                className="p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#111c38]/90 to-[#0c1428]/95 border border-white/[0.12] shadow-2xl shadow-black/40 backdrop-blur-md animate-in fade-in duration-300 relative group"
              >
                {/* Header row with status & copy button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-xs font-mono font-semibold tracking-wider uppercase text-cyan-300">
                      MISE Production Memory
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(message.content, message.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.08]"
                    title="Copy response to clipboard"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Prominent Answer Typography */}
                <div className="text-base sm:text-lg leading-relaxed text-slate-100 font-normal selection:bg-indigo-500/30">
                  <Markdown
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1.5 my-3 text-slate-200">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1.5 my-3 text-slate-200">{children}</ol>
                      ),
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>

                {/* Contextual Source Cards (Shown ONLY after answer appears) */}
                <SourceCards sources={sources} />
              </div>
            );
          })}

          {/* PRESERVED LOADING ANIMATION: Star with three animated dots */}
          {isLoading && (
            <div
              id="loading-state-indicator"
              className="flex gap-3.5 justify-start animate-in fade-in duration-200 pt-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 p-[1px] shrink-0 mt-0.5 shadow-md shadow-indigo-500/25">
                <div className="w-full h-full bg-[#0b1224] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              </div>

              <div className="rounded-2xl px-5 py-3.5 bg-gradient-to-b from-[#131f3e]/95 to-[#0e162d]/95 border border-indigo-500/40 text-slate-200 shadow-xl shadow-indigo-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"></span>
                  </div>
                  <span className="text-xs font-mono text-indigo-300">
                    Querying Production Memory...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* SUBTLE FOOTER: Non-intrusive architecture notice */}
      <footer className="w-full py-4 border-t border-white/[0.05] text-center text-[11px] font-mono text-slate-400/80 shrink-0">
        MISE Production Memory • Scope Creep (2026) • Connected to Google ADK Cloud Run
      </footer>
    </div>
  );
};
