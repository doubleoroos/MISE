import React from 'react';
import { Film, Sparkles, Database, RefreshCw, Cpu } from 'lucide-react';

interface TopBarProps {
  onResetSession: () => void;
  isConnecting?: boolean;
  selectedSceneNumber: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onResetSession,
  isConnecting = false,
  selectedSceneNumber,
}) => {
  return (
    <header
      id="top-navigation-bar"
      className="h-14 border-b border-white/[0.07] bg-[#0c0e17]/90 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40"
    >
      {/* Left: MISE Logo & Wordmark + Subtitle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 group cursor-default">
          {/* Glowing Aperture Icon */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0d0f19] rounded-[7px] flex items-center justify-center">
              <Film className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-lg blur-[6px] opacity-40 group-hover:opacity-75 transition-opacity" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-bold tracking-wider text-lg text-white font-['Plus_Jakarta_Sans']">
              MISE
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-indigo-400/90 uppercase px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/20">
              v1.4 PROD
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

        {/* Center / Left: Production Memory */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="text-slate-200 tracking-wide font-medium">Production Memory</span>
          <span className="text-white/20">•</span>
          <span className="text-indigo-300/80 font-mono text-[11px]">SCOPE CREEP (2026)</span>
          <span className="text-white/20">•</span>
          <span className="text-slate-400 font-mono text-[11px]">Sc. {selectedSceneNumber}</span>
        </div>
      </div>

      {/* Right: Connected + Gemini + ClickHouse badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Connected Indicator */}
        <div
          id="status-indicator-connected"
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-sm shadow-emerald-900/30"
          title="Google ADK Cloud Run & ClickHouse Memory Active"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">Connected</span>
        </div>

        {/* Gemini Engine Badge */}
        <div
          id="badge-gemini"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-950/40 border border-violet-500/25 text-violet-300 text-xs font-mono"
        >
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>Gemini</span>
        </div>

        {/* ClickHouse Memory Badge */}
        <div
          id="badge-clickhouse"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/25 text-cyan-300 text-xs font-mono"
        >
          <Database className="w-3 h-3 text-cyan-400" />
          <span>ClickHouse</span>
        </div>

        {/* ADK Agent Badge */}
        <div
          id="badge-adk"
          className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/60 border border-white/10 text-slate-400 text-[11px] font-mono"
        >
          <Cpu className="w-3 h-3 text-slate-400" />
          <span>ADK Agent</span>
        </div>

        {/* Session Reset Button */}
        <button
          id="btn-reset-session"
          onClick={onResetSession}
          disabled={isConnecting}
          title="Start fresh conversation session"
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all duration-150 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
