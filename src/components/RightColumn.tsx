import React from 'react';
import { Scene } from '../types';
import {
  APPROVED_ASSETS,
  PRODUCTION_DECISIONS,
  CONTINUITY_NOTES,
} from '../data/mockProductionData';
import {
  CheckCircle2,
  Camera,
  Shirt,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Film,
  SunMedium,
  BookOpen,
  Layers,
} from 'lucide-react';

interface RightColumnProps {
  selectedScene: Scene;
}

export const RightColumn: React.FC<RightColumnProps> = ({ selectedScene }) => {
  const assets = APPROVED_ASSETS[selectedScene.number] || APPROVED_ASSETS[23];
  const decisions = PRODUCTION_DECISIONS[selectedScene.number] || PRODUCTION_DECISIONS[23];
  const continuity = CONTINUITY_NOTES[selectedScene.number] || CONTINUITY_NOTES[23];

  const primaryAsset = assets[0];
  const primaryDecision = decisions[0];
  const primaryContinuity = continuity[0];

  return (
    <aside
      id="right-column-production-memory"
      className="w-full lg:w-80 xl:w-92 shrink-0 flex flex-col gap-4 p-4 lg:p-5 border-l border-white/[0.07] bg-[#0c0e17]/70 backdrop-blur-xl h-full overflow-y-auto"
    >
      {/* Column Header */}
      <div className="pb-3 border-b border-white/[0.07] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-wider uppercase font-mono text-white flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Production Memory
          </h2>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Active Records • Sc. {selectedScene.number}
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Verified
        </span>
      </div>

      {/* THREE STACKED PANELS */}

      {/* PANEL 1: APPROVED ASSETS */}
      <div
        id="panel-approved-assets"
        className="rounded-xl p-4 bg-[#121524]/85 border border-emerald-500/20 hover:border-emerald-500/35 transition-all duration-200 shadow-md relative group"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Approved Assets
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
            {primaryAsset.status}
          </span>
        </div>

        {/* Asset Title */}
        <div className="text-sm font-semibold text-white tracking-wide mb-3 group-hover:text-emerald-200 transition-colors">
          {primaryAsset.name}
        </div>

        {/* Key Metadata Table */}
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between py-1 px-2.5 rounded bg-[#0b0d18] border border-white/[0.04]">
            <span className="text-slate-400 text-[11px]">Version</span>
            <span className="text-emerald-300 font-bold px-1.5 py-0.2 rounded bg-emerald-950/50 border border-emerald-500/20">
              {primaryAsset.version}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 px-2.5 rounded bg-[#0b0d18] border border-white/[0.04]">
            <span className="text-slate-400 text-[11px]">Type</span>
            <span className="text-slate-200 flex items-center gap-1">
              <Film className="w-3 h-3 text-cyan-400" />
              {primaryAsset.type}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 px-2.5 rounded bg-[#0b0d18] border border-white/[0.04]">
            <span className="text-slate-400 text-[11px]">Status</span>
            <span className="text-emerald-400 font-semibold">{primaryAsset.status}</span>
          </div>

          {primaryAsset.format && (
            <div className="flex items-center justify-between py-1 px-2.5 rounded bg-[#0b0d18] border border-white/[0.04]">
              <span className="text-slate-400 text-[11px]">Encoding</span>
              <span className="text-slate-300 text-[10px] truncate max-w-[140px]" title={primaryAsset.format}>
                {primaryAsset.format}
              </span>
            </div>
          )}
        </div>

        {primaryAsset.uri && (
          <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="truncate max-w-[200px]" title={primaryAsset.uri}>
              {primaryAsset.uri}
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400 shrink-0" />
          </div>
        )}
      </div>

      {/* PANEL 2: DECISIONS */}
      <div
        id="panel-decisions"
        className="rounded-xl p-4 bg-[#121524]/85 border border-indigo-500/20 hover:border-indigo-500/35 transition-all duration-200 shadow-md relative group"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5">
            {primaryDecision.category === 'Lighting' ? (
              <SunMedium className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
            )}
            Decisions
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-medium">
            {primaryDecision.category}
          </span>
        </div>

        {/* Primary Decision Text */}
        <div className="text-sm font-semibold text-slate-100 leading-snug mb-3">
          {primaryDecision.decision}
        </div>

        {/* Reason Block */}
        <div className="p-2.5 rounded-lg bg-[#0b0d18] border border-indigo-500/10 mb-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 block mb-1">
            Reason:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {primaryDecision.reason}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
          <span>Decided by: <strong className="text-slate-300 font-semibold">{primaryDecision.decidedBy}</strong></span>
          <span>{primaryDecision.decidedAt.split(' ')[0]}</span>
        </div>
      </div>

      {/* PANEL 3: CONTINUITY */}
      <div
        id="panel-continuity"
        className="rounded-xl p-4 bg-[#121524]/85 border border-violet-500/20 hover:border-violet-500/35 transition-all duration-200 shadow-md relative group"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-violet-400 flex items-center gap-1.5">
            {primaryContinuity.category === 'Story' ? (
              <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            ) : (
              <Shirt className="w-3.5 h-3.5 text-violet-400" />
            )}
            Continuity
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300 font-medium">
            {primaryContinuity.category}
          </span>
        </div>

        {/* Continuity Detail */}
        <p className="text-xs text-slate-200 leading-relaxed mb-3">
          {primaryContinuity.note}
        </p>

        {/* Metadata Details */}
        <div className="p-2 rounded-lg bg-[#0b0d18] border border-white/[0.04] space-y-1 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Department</span>
            <span className="text-slate-200 font-medium">{primaryContinuity.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Source</span>
            <span className="text-violet-300 font-medium">{primaryContinuity.source}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Priority</span>
            <span className="text-amber-400 font-semibold">{primaryContinuity.priority || 'Critical'}</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Reference for active scene */}
      <div className="mt-auto p-3 rounded-xl bg-gradient-to-r from-indigo-950/30 via-violet-950/20 to-cyan-950/30 border border-white/[0.05] text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2 text-indigo-300 mb-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>ClickHouse ADK Memory Live</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          All decisions, notes, and asset approvals are indexed and queryable in natural language.
        </p>
      </div>
    </aside>
  );
};
