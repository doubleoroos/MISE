import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Scene } from '../types';
import { EXAMPLE_QUESTIONS } from '../data/mockProductionData';
import Markdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Film,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  ArrowDownCircle,
  Clapperboard,
} from 'lucide-react';

interface CenterColumnProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => Promise<void>;
  selectedScene: Scene;
  onSelectSceneByNumber: (sceneNumber: number) => void;
  onRetryLastMessage?: () => void;
}

export const CenterColumn: React.FC<CenterColumnProps> = ({
  messages,
  isLoading,
  onSendMessage,
  selectedScene,
  onSelectSceneByNumber,
  onRetryLastMessage,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputVal.trim();
    if (!query || isLoading) return;

    setInputVal('');
    await onSendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipClick = (questionText: string, sceneNum: number) => {
    // If chip belongs to another scene, switch scene view too
    if (sceneNum !== selectedScene.number) {
      onSelectSceneByNumber(sceneNum);
    }
    // Immediately send the question
    onSendMessage(questionText);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main
      id="center-column-ask-mise"
      className="flex-1 flex flex-col h-full min-w-0 bg-[#0a0c14] relative overflow-hidden"
    >
      {/* Background Cinematic Radial Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-violet-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-gradient-to-t from-cyan-600/5 via-electric-blue/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header: Large heading & subtitle */}
      <header className="px-6 pt-6 pb-4 border-b border-white/[0.06] bg-[#0c0e17]/60 backdrop-blur-md shrink-0 relative z-10">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Ask MISE
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30">
                ADK 2.5
              </span>
            </div>
            <p className="text-sm text-slate-400 font-normal">
              Ask anything about your production memory.
            </p>
          </div>

          {/* Active Scene Context Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121524] border border-white/[0.08] shadow-inner text-xs font-mono">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Context:</span>
            <span className="text-indigo-300 font-bold">Scene {selectedScene.number}</span>
          </div>
        </div>
      </header>

      {/* Chat Messages Conversation Stream */}
      <div
        id="chat-messages-container"
        className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6 relative z-10"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            /* Cinematic Welcome Slate when conversation is fresh */
            <div
              id="empty-state-welcome"
              className="py-8 px-6 rounded-2xl bg-gradient-to-b from-[#131625]/80 to-[#0e101a]/90 border border-white/[0.08] shadow-2xl relative overflow-hidden text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-[#0d0f19] rounded-[15px] flex items-center justify-center">
                  <Clapperboard className="w-7 h-7 text-indigo-400" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 font-['Plus_Jakarta_Sans']">
                Production Memory is Online & Indexed
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
                Connected to Google ADK Cloud Run & ClickHouse. Scene decisions, camera notes, approved cuts, and continuity logs for <strong className="text-slate-200">SCOPE CREEP</strong> are ready for retrieval.
              </p>

              <div className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan-400/90 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Select an example question below or type your inquiry
              </div>
            </div>
          ) : null}

          {/* Rendered Messages */}
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                id={`message-${message.id}`}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                {!isUser && (
                  /* MISE Assistant Avatar */
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 p-[1px] shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
                    <div className="w-full h-full bg-[#0d101a] rounded-[7px] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 shadow-lg transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white rounded-tr-sm border border-indigo-400/30'
                      : message.isError
                      ? 'bg-red-950/40 border border-red-500/30 text-red-200 rounded-tl-sm'
                      : 'bg-[#131625]/90 border border-white/[0.08] text-slate-100 rounded-tl-sm backdrop-blur-md'
                  }`}
                >
                  {/* Message Header (for assistant) */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[10px] font-mono text-slate-400">
                      <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                        MISE Memory Retrieval
                        {message.sceneContext && (
                          <span className="text-slate-400">
                            • Scene {message.sceneContext}
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1 rounded hover:bg-white/5"
                        title="Copy to clipboard"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Content */}
                  {message.isError ? (
                    <div className="flex items-start gap-2.5 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{message.content}</p>
                        {onRetryLastMessage && (
                          <button
                            onClick={onRetryLastMessage}
                            className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono text-rose-300 underline hover:text-rose-100"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Retry query
                          </button>
                        )}
                      </div>
                    </div>
                  ) : isUser ? (
                    <p className="text-sm leading-relaxed text-white font-medium">
                      {message.content}
                    </p>
                  ) : (
                    <div className="text-sm leading-relaxed text-slate-200 markdown-body prose-invert">
                      <Markdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({ children }) => (
                            <code className="px-1.5 py-0.5 rounded bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
                              {children}
                            </code>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-white">{children}</strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                          ),
                        }}
                      >
                        {message.content}
                      </Markdown>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`mt-2 text-[9px] font-mono text-right ${
                      isUser ? 'text-indigo-200/70' : 'text-slate-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Animated Loading State */}
          {isLoading && (
            <div className="flex gap-3.5 justify-start animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 p-[1px] shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-[#0d101a] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              </div>

              <div className="max-w-[80%] rounded-2xl px-4 py-3.5 bg-[#131625]/90 border border-indigo-500/30 text-slate-200 rounded-tl-sm shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"></span>
                  </div>
                  <span className="text-xs font-mono text-indigo-300">
                    Querying Production Memory & ClickHouse...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* FOOTER SECTION: Example Question Chips + Input Field */}
      <footer className="p-4 lg:p-6 bg-[#0c0e17]/85 border-t border-white/[0.07] backdrop-blur-xl relative z-20 shrink-0">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Example Question Chips */}
          <div id="example-question-chips-container">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ArrowDownCircle className="w-3 h-3 text-indigo-400" />
                Quick Production Queries
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Click to retrieve
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_QUESTIONS.map((q) => {
                const isCurrentScene = q.sceneNumber === selectedScene.number;
                return (
                  <button
                    key={q.id}
                    id={`chip-${q.id}`}
                    onClick={() => handleChipClick(q.text, q.sceneNumber)}
                    disabled={isLoading}
                    className={`text-left p-2.5 rounded-xl text-xs transition-all duration-150 border flex items-start justify-between gap-2 group ${
                      isCurrentScene
                        ? 'bg-[#151928] hover:bg-[#1a2033] border-indigo-500/30 hover:border-indigo-400/60 text-slate-200'
                        : 'bg-[#111320]/70 hover:bg-[#151928] border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                    }`}
                  >
                    <span className="line-clamp-2 text-slate-200 group-hover:text-white font-medium leading-snug">
                      “{q.text}”
                    </span>
                    <span
                      className={`text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                        isCurrentScene
                          ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-500/30'
                          : 'bg-white/5 text-slate-400 border border-white/5'
                      }`}
                    >
                      Sc. {q.sceneNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Chat Input Form */}
          <form
            id="chat-input-form"
            onSubmit={handleSubmit}
            className="relative rounded-2xl bg-[#121524] border border-white/[0.1] focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-xl"
          >
            <div className="flex items-center px-4 py-2">
              <textarea
                ref={textareaRef}
                id="ask-mise-input"
                rows={1}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about assets, decisions, continuity, scenes..."
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none resize-none py-1.5 max-h-32 disabled:opacity-50"
              />

              {/* Send Button with Gradient Treatment */}
              <button
                type="submit"
                id="btn-send-message"
                disabled={!inputVal.trim() || isLoading}
                className="ml-3 shrink-0 p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 hover:from-indigo-400 hover:via-violet-500 hover:to-cyan-400 text-white font-medium shadow-md shadow-indigo-600/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-cyan-500"
                title="Send query to MISE (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Input bottom status / shortcuts bar */}
            <div className="px-4 pb-2 pt-0.5 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/[0.04]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Target: {selectedScene.title} (Sc. {selectedScene.number})
              </span>
              <span>Press <kbd className="px-1 rounded bg-white/10 text-slate-300">Enter</kbd> to ask</span>
            </div>
          </form>
        </div>
      </footer>
    </main>
  );
};
