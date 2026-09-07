import React from 'react';
import { Scene } from '../types';
import { SCENES, PRODUCTION_INFO } from '../data/mockProductionData';
import { Clapperboard, MapPin, Film, Sliders, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

interface LeftColumnProps {
  selectedScene: Scene;
  onSelectScene: (scene: Scene) => void;
}

export const LeftColumn: React.FC<LeftColumnProps> = ({
  selectedScene,
  onSelectScene,
}) => {
  return (
    <aside
      id="left-column-production-context"
      className="w-full lg:w-80 xl:w-84 shrink-0 flex flex-col gap-4 p-4 lg:p-5 border-r border-white/[0.07] bg-[#0c0e17]/70 backdrop-blur-xl h-full overflow-y-auto"
    >
      {/* Header: MISE / Production Memory */}
      <div className="pb-3 border-b border-white/[0.07]">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              MISE
            </span>
          </h1>
          <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400/90 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
            Studio Engine
          </span>
        </div>
        <p className="text-xs text-indigo-200/60 font-medium tracking-wide">
          Production Memory
        </p>
      </div>

      {/* Production Selector */}
      <div
        id="production-selector-card"
        className="p-3.5 rounded-xl bg-gradient-to-b from-[#141824] to-[#10131d] border border-indigo-500/20 shadow-lg shadow-indigo-950/30 group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clapperboard className="w-3 h-3 text-indigo-400" />
            Active Slate
          </span>
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/20">
            Live
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-sm font-semibold text-white tracking-wide">
            Production: <span className="text-indigo-300 font-bold">{PRODUCTION_INFO.title}</span>
          </div>
        </div>

        {/* Studio Specs */}
        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Format</span>
            <span className="text-slate-300 font-medium">{PRODUCTION_INFO.aspectRatio}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Camera</span>
            <span className="text-slate-300 font-medium truncate block" title={PRODUCTION_INFO.captureFormat}>
              Alexa 35
            </span>
          </div>
        </div>
      </div>

      {/* Selected Scene Context */}
      <div
        id="selected-scene-context-card"
        className="p-4 rounded-xl bg-[#121522]/90 border border-white/[0.08] shadow-md relative overflow-hidden"
      >
        {/* Subtle radial ambient highlight */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 via-violet-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/80">
            Selected Scene
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
            Scene {selectedScene.number}
          </span>
        </div>

        {/* Scene Title */}
        <h2 className="text-base font-semibold text-white tracking-tight leading-snug mb-3">
          {selectedScene.title}
        </h2>

        {/* Key Display Fields: Location, Status, Scene ID */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#0d0f1a]/80 border border-white/[0.05]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400/80" />
              Location
            </span>
            <span className="font-medium text-slate-200 text-right">
              {selectedScene.location}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#0d0f1a]/80 border border-white/[0.05]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" />
              Status
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              {selectedScene.status}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#0d0f1a]/80 border border-white/[0.05]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-indigo-400/80" />
              Scene ID
            </span>
            <span className="font-mono text-[11px] text-indigo-300">
              {selectedScene.sceneIdCode}
            </span>
          </div>
        </div>

        {/* Synopsis / Atmosphere snippet */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] text-slate-400 leading-relaxed">
          <span className="text-slate-400 block text-[9px] uppercase font-mono mb-1">
            Setting Note
          </span>
          {selectedScene.summary}
        </div>
      </div>

      {/* Small Scene List */}
      <div id="scene-list-container" className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase font-mono text-[10px]">
            Scene Roster
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {SCENES.length} Scenes Indexed
          </span>
        </div>

        <div className="space-y-1.5">
          {SCENES.map((scene) => {
            const isSelected = scene.number === selectedScene.number;
            return (
              <button
                key={scene.id}
                id={`scene-btn-${scene.number}`}
                onClick={() => onSelectScene(scene)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-950/70 to-violet-950/50 border border-indigo-500/40 shadow-lg shadow-indigo-950/20 text-white'
                    : 'bg-[#10131d]/60 hover:bg-[#151928]/80 border border-white/[0.05] hover:border-white/[0.12] text-slate-300'
                }`}
              >
                <div className="flex flex-col gap-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
                          : 'bg-white/5 text-slate-400 border border-white/5'
                      }`}
                    >
                      Sc. {scene.number}
                    </span>
                    <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                      {scene.number === 23
                        ? 'Scene 23 — Lauren enters the house'
                        : 'Scene 41 — Pool exterior / night'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1 pl-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      {scene.timeOfDay}
                    </span>
                    <span>•</span>
                    <span>{scene.intExt}</span>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected
                      ? 'text-indigo-400 translate-x-0.5'
                      : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Memory Index Info */}
      <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between px-1">
        <span className="flex items-center gap-1 text-slate-400">
          <Sliders className="w-3 h-3 text-indigo-400" />
          ClickHouse Memory
        </span>
        <span className="text-indigo-400/80">synced</span>
      </div>
    </aside>
  );
};
