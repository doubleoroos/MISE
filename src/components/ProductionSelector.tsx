import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, Clapperboard } from 'lucide-react';

interface ProductionSelectorProps {
  onOpenNewProduction: () => void;
}

export const ProductionSelector: React.FC<ProductionSelectorProps> = ({
  onOpenNewProduction,
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
      {/* Trigger Button showing "Production: SCOPE CREEP ▼" */}
      <button
        id="production-selector-trigger"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 border ${
          isOpen
            ? 'bg-[#152347] border-indigo-500/60 text-white shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
            : 'bg-[#0f1a36]/80 hover:bg-[#152347] border-white/[0.1] hover:border-indigo-500/30 text-slate-200'
        }`}
        title="Select Production"
      >
        <Clapperboard className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400">Production:</span>
          <span className="font-semibold text-white tracking-wide">SCOPE CREEP</span>
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
          id="production-selector-menu"
          className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-[#0d162d] border border-white/[0.14] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.08] mb-1">
            Productions
          </div>

          {/* Active Production: SCOPE CREEP */}
          <button
            id="production-option-scope-creep"
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-3 py-2.5 rounded-lg bg-indigo-600/25 text-white border border-indigo-500/40 flex items-center justify-between gap-2 group transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-white">SCOPE CREEP</span>
              </div>
              <div className="text-[11px] text-indigo-300 font-normal mt-0.5">
                Active demo production
              </div>
            </div>
            <Check className="w-4 h-4 text-indigo-400 shrink-0" />
          </button>

          {/* Divider */}
          <div className="my-1.5 border-t border-white/[0.08]" />

          {/* + New Production */}
          <button
            id="btn-dropdown-new-production"
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenNewProduction();
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium group"
          >
            <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/40 group-hover:text-cyan-300 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>+ New Production</span>
          </button>
        </div>
      )}
    </div>
  );
};
