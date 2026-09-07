import React, { useState, useRef, useEffect } from 'react';
import { Scene } from '../types';
import { SCENES } from '../data/mockProductionData';
import { Film, ChevronDown, Check } from 'lucide-react';

interface SceneSelectorProps {
  selectedScene: Scene;
  onSelectScene: (scene: Scene) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  selectedScene,
  onSelectScene,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button showing "Scene: Scene 23 ▼" */}
      <button
        id="scene-selector-dropdown-trigger"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 border ${
          isOpen
            ? 'bg-[#152347] border-indigo-500/60 text-white shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
            : 'bg-[#0f1a36]/80 hover:bg-[#152347] border-white/[0.1] hover:border-indigo-500/30 text-slate-200'
        }`}
        title="Switch Production Scene"
      >
        <Film className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400">Scene:</span>
          <span className="font-semibold text-white">Scene {selectedScene.number}</span>
          <span className="hidden xl:inline text-slate-400 text-[11px] font-normal truncate max-w-[140px]">
            — {selectedScene.title}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="scene-selector-dropdown-menu"
          className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-72 sm:w-80 rounded-xl bg-[#0d162d] border border-white/[0.14] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.08] mb-1 flex items-center justify-between">
            <span>Scenes in SCOPE CREEP</span>
            <span className="text-slate-400 font-normal">2 scenes</span>
          </div>

          <div className="space-y-1">
            {SCENES.map((scene) => {
              const isSelected = scene.number === selectedScene.number;
              return (
                <button
                  key={scene.id}
                  id={`scene-option-${scene.number}`}
                  type="button"
                  onClick={() => {
                    onSelectScene(scene);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start justify-between gap-2 group ${
                    isSelected
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'hover:bg-white/[0.04] text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-xs text-white">
                        Scene {scene.number}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {scene.intExt} • {scene.timeOfDay}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 truncate font-medium">
                      {scene.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {scene.location}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
