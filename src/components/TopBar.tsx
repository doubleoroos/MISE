import React from 'react';
import { Film, RotateCcw, Plus } from 'lucide-react';
import { Scene } from '../types';
import { SceneSelector } from './SceneSelector';
import { ProductionSelector } from './ProductionSelector';

interface TopBarProps {
  onResetSession: () => void;
  selectedScene: Scene;
  onSelectScene: (scene: Scene) => void;
  onOpenNewProduction: () => void;
  isConnecting?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onResetSession,
  selectedScene,
  onSelectScene,
  onOpenNewProduction,
  isConnecting = false,
}) => {
  return (
    <header
      id="top-navigation-bar"
      className="border-b border-white/[0.07] bg-[#090a0f]/90 backdrop-blur-xl sticky top-0 z-40"
    >
      {/* Primary Top Bar Row */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: MISE Wordmark + Production & Scene Selectors */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          {/* MISE Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-500 p-[1px] shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-[#090a0f] rounded-[7px] flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold tracking-wider text-base text-white font-['Plus_Jakarta_Sans']">
              MISE
            </span>
          </div>

          <div className="h-5 w-[1px] bg-white/10 shrink-0" />

          {/* Production Selector: SCOPE CREEP */}
          <ProductionSelector onOpenNewProduction={onOpenNewProduction} />

          {/* Scene Selector: Scene 23 */}
          <SceneSelector
            selectedScene={selectedScene}
            onSelectScene={onSelectScene}
          />

          {/* Secondary "+ New Production" Button */}
          <button
            id="btn-new-production"
            type="button"
            onClick={onOpenNewProduction}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.18] transition-all shrink-0"
            title="Create a new production memory"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Production</span>
          </button>
        </div>

        {/* Right: Connected Status + Session Reset */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile + New Production trigger */}
          <button
            id="btn-new-production-mobile"
            type="button"
            onClick={onOpenNewProduction}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.08]"
            title="New Production"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          {/* Simple Connected Status */}
          <div
            id="status-indicator-connected"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20"
            title="Connected to MISE Production Memory"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wide">Connected</span>
          </div>

          {/* Discreet Session Reset */}
          <button
            id="btn-reset-session"
            type="button"
            onClick={onResetSession}
            disabled={isConnecting}
            title="Clear & Start Fresh"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.08]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Brief Flow Helper Line */}
      <div
        id="production-flow-helper-bar"
        className="px-4 sm:px-6 py-1 border-t border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-tight"
      >
        <p className="truncate">
          Create or select a production, add your materials, then ask MISE about scenes, assets, decisions and continuity.
        </p>
        <span className="hidden lg:inline text-[10px] text-indigo-400 font-semibold uppercase tracking-wider shrink-0 pl-3">
          1. Select Production → 2. Add Materials → 3. Ask MISE
        </span>
      </div>
    </header>
  );
};
