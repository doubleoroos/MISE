import React from 'react';
import { Scene } from '../types';
import { APPROVED_ASSETS, PRODUCTION_DECISIONS, CONTINUITY_NOTES } from '../data/mockProductionData';
import { CheckCircle2, Compass, BookmarkCheck, Film, Sparkles } from 'lucide-react';

interface SceneContextPanelProps {
  selectedScene: Scene;
  onAskAbout: (query: string) => void;
}

export const SceneContextPanel: React.FC<SceneContextPanelProps> = ({
  selectedScene,
  onAskAbout,
}) => {
  const sceneNum = selectedScene.number;
  const primaryAsset = APPROVED_ASSETS[sceneNum]?.[0];
  const primaryDecision = PRODUCTION_DECISIONS[sceneNum]?.[0];
  const primaryContinuity = CONTINUITY_NOTES[sceneNum]?.[0];

  return (
    <aside
      id="scene-context-panel"
      className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] bg-[#0c1427]/80 backdrop-blur-xl p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
            <Film className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Scene Context
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
          Scene {sceneNum}
        </span>
      </div>

      {/* Selected Scene Overview */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-indigo-500/30 transition-colors">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span className="text-cyan-400 font-medium">{selectedScene.intExt} • {selectedScene.timeOfDay}</span>
          <span>{selectedScene.status}</span>
        </div>
        <h4 className="text-sm font-semibold text-white leading-snug">
          {selectedScene.title}
        </h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {selectedScene.location}
        </p>
      </div>

      {/* Compact Essential Live Context */}
      <div className="space-y-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
          Live Memory Snippets
        </div>

        {/* 1. Approved Asset */}
        {primaryAsset && (
          <div
            id={`panel-asset-${primaryAsset.id}`}
            onClick={() => onAskAbout(`Which version of ${primaryAsset.name} is approved?`)}
            className="p-3.5 rounded-xl bg-gradient-to-b from-[#111c38]/90 to-[#0c1428]/90 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/30 transition-all cursor-pointer group"
            title="Click to ask MISE about this asset"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                  Approved Asset
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {primaryAsset.version}
              </span>
            </div>
            <h5 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
              {primaryAsset.name}
            </h5>
            {primaryAsset.format && (
              <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                {primaryAsset.format}
              </p>
            )}
          </div>
        )}

        {/* 2. Decision */}
        {primaryDecision && (
          <div
            id={`panel-decision-${primaryDecision.id}`}
            onClick={() => onAskAbout(`What ${primaryDecision.category.toLowerCase()} decision was made for scene ${sceneNum}?`)}
            className="p-3.5 rounded-xl bg-gradient-to-b from-[#111c38]/90 to-[#0c1428]/90 border border-violet-500/20 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-950/30 transition-all cursor-pointer group"
            title="Click to ask MISE about this decision"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-violet-300 font-semibold">
                  Decision • {primaryDecision.category}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {primaryDecision.decidedBy}
              </span>
            </div>
            <h5 className="text-xs font-semibold text-white leading-snug group-hover:text-cyan-300 transition-colors">
              {primaryDecision.decision}
            </h5>
            {primaryDecision.reason && (
              <p className="text-[11px] text-slate-300 mt-1.5 italic leading-relaxed border-l-2 border-violet-500/30 pl-2">
                “{primaryDecision.reason}”
              </p>
            )}
          </div>
        )}

        {/* 3. Continuity Note */}
        {primaryContinuity && (
          <div
            id={`panel-continuity-${primaryContinuity.id}`}
            onClick={() => onAskAbout(`What continuity note should we remember for scene ${sceneNum}?`)}
            className="p-3.5 rounded-xl bg-gradient-to-b from-[#111c38]/90 to-[#0c1428]/90 border border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/30 transition-all cursor-pointer group"
            title="Click to ask MISE about this continuity note"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                  Continuity • {primaryContinuity.category}
                </span>
              </div>
              {primaryContinuity.priority && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {primaryContinuity.priority}
                </span>
              )}
            </div>
            <h5 className="text-xs font-semibold text-white leading-snug group-hover:text-cyan-300 transition-colors">
              {primaryContinuity.note}
            </h5>
            <p className="text-[10px] font-mono text-slate-400 mt-1">
              Source: {primaryContinuity.source}
            </p>
          </div>
        )}
      </div>

      {/* Quick helper tip */}
      <div className="mt-auto pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span>Click any card to ask MISE for verified details.</span>
      </div>
    </aside>
  );
};
