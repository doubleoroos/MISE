import React from 'react';
import { ApprovedAsset, ProductionDecision, ContinuityNote, Scene } from '../types';
import { APPROVED_ASSETS, PRODUCTION_DECISIONS, CONTINUITY_NOTES, SCENES } from '../data/mockProductionData';
import { CheckCircle2, Compass, BookmarkCheck, Film } from 'lucide-react';

export interface MatchedSources {
  scene: Scene;
  assets: ApprovedAsset[];
  decisions: ProductionDecision[];
  continuity: ContinuityNote[];
}

/**
 * Intelligent helper to extract contextual source records relevant to a query and response
 */
export function getRelevantSources(
  query: string,
  answer: string,
  sceneNumber: number
): MatchedSources {
  const combined = `${query} ${answer}`.toLowerCase();
  const scene = SCENES.find((s) => s.number === sceneNumber) || SCENES[0];

  const availableAssets = APPROVED_ASSETS[sceneNumber] || [];
  const availableDecisions = PRODUCTION_DECISIONS[sceneNumber] || [];
  const availableContinuity = CONTINUITY_NOTES[sceneNumber] || [];

  // Match assets
  const matchedAssets = availableAssets.filter((asset) => {
    const nameLower = asset.name.toLowerCase();
    const versionLower = asset.version.toLowerCase();
    return (
      combined.includes(nameLower) ||
      combined.includes(versionLower) ||
      (combined.includes('master') && nameLower.includes('master')) ||
      (combined.includes('v7') && versionLower === 'v7') ||
      (combined.includes('entrance') && nameLower.includes('entrance')) ||
      (combined.includes('plate') && nameLower.includes('plate')) ||
      (combined.includes('lut') && nameLower.includes('lut'))
    );
  });

  // Match decisions
  const matchedDecisions = availableDecisions.filter((dec) => {
    const decLower = dec.decision.toLowerCase();
    const catLower = dec.category.toLowerCase();
    return (
      combined.includes(catLower) ||
      (combined.includes('35mm') && decLower.includes('35mm')) ||
      (combined.includes('lens') && decLower.includes('lens')) ||
      (combined.includes('lighting') && (decLower.includes('lighting') || catLower === 'lighting')) ||
      (combined.includes('moonlight') && decLower.includes('moonlight')) ||
      (combined.includes('tripod') && decLower.includes('tripod')) ||
      (combined.includes('sound') && catLower === 'sound') ||
      (combined.includes('camera') && catLower === 'camera')
    );
  });

  // Match continuity
  const matchedContinuity = availableContinuity.filter((cont) => {
    const noteLower = cont.note.toLowerCase();
    const catLower = cont.category.toLowerCase();
    return (
      combined.includes(catLower) ||
      combined.includes('continuity') ||
      (combined.includes('dress') && noteLower.includes('dress')) ||
      (combined.includes('cobalt') && noteLower.includes('cobalt')) ||
      (combined.includes('preference') && noteLower.includes('preference')) ||
      (combined.includes('bag') && noteLower.includes('bag')) ||
      (combined.includes('towel') && noteLower.includes('towel'))
    );
  });

  // Fallback: If no specific asset/decision/continuity matched directly, but user asked about asset, decision, or continuity
  if (matchedAssets.length === 0 && (combined.includes('asset') || combined.includes('version') || combined.includes('master'))) {
    matchedAssets.push(...availableAssets.slice(0, 1));
  }
  if (matchedDecisions.length === 0 && (combined.includes('decision') || combined.includes('camera') || combined.includes('lighting'))) {
    matchedDecisions.push(...availableDecisions.slice(0, 1));
  }
  if (matchedContinuity.length === 0 && (combined.includes('continuity') || combined.includes('wardrobe') || combined.includes('remember'))) {
    matchedContinuity.push(...availableContinuity.slice(0, 1));
  }

  return {
    scene,
    assets: matchedAssets,
    decisions: matchedDecisions,
    continuity: matchedContinuity,
  };
}

interface SourceCardsProps {
  sources: MatchedSources;
}

export const SourceCards: React.FC<SourceCardsProps> = ({ sources }) => {
  const { scene, assets, decisions, continuity } = sources;
  const hasCards = assets.length > 0 || decisions.length > 0 || continuity.length > 0 || !!scene;

  if (!hasCards) return null;

  return (
    <div className="mt-5 pt-4 border-t border-white/[0.08]">
      <div className="text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        Verified Production Sources
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Scene Source Card */}
        {scene && (
          <div
            id={`source-scene-${scene.number}`}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-colors flex items-start gap-2.5"
          >
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
              <Film className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-medium text-indigo-300 uppercase tracking-wider">
                  Scene Context
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {scene.intExt} • {scene.timeOfDay}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate">
                Scene {scene.number} — {scene.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {scene.location}
              </p>
            </div>
          </div>
        )}

        {/* Approved Asset Source Cards */}
        {assets.map((asset) => (
          <div
            key={asset.id}
            id={`source-asset-${asset.id}`}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-colors flex items-start gap-2.5"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-medium text-emerald-300 uppercase tracking-wider">
                  Approved Asset
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {asset.version} • {asset.status}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate">
                {asset.name}
              </h4>
              {asset.format && (
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  {asset.format}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Production Decision Source Cards */}
        {decisions.map((dec) => (
          <div
            key={dec.id}
            id={`source-decision-${dec.id}`}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-colors flex items-start gap-2.5"
          >
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 shrink-0 mt-0.5">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-medium text-violet-300 uppercase tracking-wider">
                  Decision • {dec.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  By {dec.decidedBy}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                {dec.decision}
              </h4>
              {dec.reason && (
                <p className="text-[11px] text-slate-400 mt-1 italic leading-snug">
                  “{dec.reason}”
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Continuity Note Source Cards */}
        {continuity.map((cont) => (
          <div
            key={cont.id}
            id={`source-continuity-${cont.id}`}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-colors flex items-start gap-2.5"
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
              <BookmarkCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-medium text-cyan-300 uppercase tracking-wider">
                  Continuity • {cont.category}
                </span>
                {cont.priority && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    {cont.priority}
                  </span>
                )}
              </div>
              <h4 className="text-xs font-semibold text-white leading-snug">
                {cont.note}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Source: {cont.source}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
