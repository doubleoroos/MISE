import React, { useState } from 'react';
import { X, Upload, FileText, FolderPlus, Sparkles, CheckCircle2, Cloud } from 'lucide-react';

interface NewProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProductionModal: React.FC<NewProductionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'screenplay' | 'documents' | 'import'>('screenplay');

  if (!isOpen) return null;

  return (
    <div
      id="new-production-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="new-production-modal-content"
        className="w-full max-w-xl rounded-2xl bg-[#0e101a] border border-white/[0.12] shadow-2xl overflow-hidden p-6 sm:p-7 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-new-production-modal"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">
            MISE Production Architecture
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 ml-auto mr-7">
            Demo workflow
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
          Create a production
        </h2>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
          Start a new Production Memory by adding your project materials.
        </p>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-2 mt-5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setActiveTab('screenplay')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'screenplay'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Screenplay</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'documents'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Documents</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'import'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="mt-4 p-5 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.01] text-center">
          {activeTab === 'screenplay' && (
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2.5">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">Upload screenplay</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Drop your screenplay (.pdf, .fdx, .fountain) to auto-extract scenes, sluglines, characters, and initial scene beats.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs text-slate-300 font-mono">
                <span>Demo workflow • Active demo is SCOPE CREEP</span>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-2.5">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">Upload production documents</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Add shot lists, daily call sheets, script supervisor continuity logs, and asset approval sheets.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs text-slate-300 font-mono">
                <span>Demo workflow • Active demo is SCOPE CREEP</span>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 mb-2.5">
                <Cloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">Import existing materials</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Connect your cloud workspace (Google Drive, Frame.io, or studio storage) to ingest approved cuts and notes.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs text-slate-300 font-mono">
                <span>Demo workflow • Active demo is SCOPE CREEP</span>
              </div>
            </div>
          )}
        </div>

        {/* Accepted Example Materials */}
        <div className="mt-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            Accepted project materials:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Screenplay',
              'Shot list',
              'Call sheets',
              'Continuity notes',
              'Asset lists',
              'Production documents',
            ].map((item) => (
              <span
                key={item}
                className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Current live memory is loaded for <strong className="text-white">SCOPE CREEP</strong>.
          </span>
          <button
            id="btn-dismiss-new-production"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium transition-colors"
          >
            Back to SCOPE CREEP
          </button>
        </div>
      </div>
    </div>
  );
};
