import React from 'react';
import {
  X,
  BrainCircuit,
  TrendingUp,
  Award,
  Zap,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { StrategicAuditData } from '../types';

interface StrategicAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: StrategicAuditData | null;
  isLoading: boolean;
  onRunAudit: () => void;
}

export const StrategicAuditModal: React.FC<StrategicAuditModalProps> = ({
  isOpen,
  onClose,
  audit,
  isLoading,
  onRunAudit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                  Campaign Strategic Audit & Resonance Matrix
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  gemini-4-argon
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cognitive psychology, algorithm virality, and cross-channel synergy analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                <BrainCircuit className="w-5 h-5 text-emerald-400 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Analyzing with gemini-4-argon...</h4>
                <p className="text-xs text-zinc-400 max-w-sm">
                  Evaluating narrative hooks, psychological resonance, algorithm distribution patterns, and cross-platform synergy.
                </p>
              </div>
            </div>
          ) : !audit ? (
            <div className="py-16 text-center space-y-3">
              <BrainCircuit className="w-10 h-10 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-semibold text-white">No Strategic Audit Generated Yet</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Run our flagship cognitive marketing analysis model (gemini-4-argon) to benchmark your campaign's virality and cross-channel conversion potential.
              </p>
              <button
                onClick={onRunAudit}
                className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20"
              >
                Run Strategic Audit
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Score Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-950 to-zinc-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Chief Marketing Officer Verdict
                  </span>
                  <h4 className="text-base font-bold text-white">{audit.summaryVerdict}</h4>
                </div>

                <div className="flex items-center gap-3 bg-zinc-900/90 border border-emerald-500/30 px-4 py-2.5 rounded-xl shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-zinc-400">Resonance Index</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      {audit.overallResonanceScore}<span className="text-sm text-zinc-500">/100</span>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-emerald-400 shrink-0" />
                </div>
              </div>

              {/* Psychological Triggers */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Cognitive Drivers & Psychological Triggers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {audit.psychologicalDrivers?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 hover:border-zinc-700 transition-colors"
                    >
                      <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {item.driver}
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Scorecards Grid */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Platform Algorithm Scorecards
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* LinkedIn */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-blue-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="font-bold text-blue-400">LinkedIn Scorecard</span>
                      <span className="font-mono text-xs font-bold text-white bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {audit.linkedinAudit?.authorityScore}/100 Authority
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>Hook Strength:</span>
                        <span className="font-bold text-zinc-200">{audit.linkedinAudit?.hookStrength}%</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Readability Grade:</span>
                        <span className="font-bold text-zinc-200">{audit.linkedinAudit?.readabilityGrade}</span>
                      </div>
                      <div className="text-zinc-400 pt-1">
                        <span className="font-semibold text-zinc-300">Trigger:</span> {audit.linkedinAudit?.primaryTrigger}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-300">
                      💡 <span className="font-semibold">Pro Tip:</span> {audit.linkedinAudit?.proTip}
                    </div>
                  </div>

                  {/* Twitter / X */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-sky-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="font-bold text-sky-400">Twitter / X Scorecard</span>
                      <span className="font-mono text-xs font-bold text-white bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {audit.twitterAudit?.viralityScore}/100 Virality
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>Scroll-Stop Rate:</span>
                        <span className="font-bold text-zinc-200">{audit.twitterAudit?.scrollStopRating}%</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Retweet Propensity:</span>
                        <span className="font-bold text-zinc-200">{audit.twitterAudit?.retweetPropensity}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-sky-500/5 border border-sky-500/10 text-[11px] text-sky-300">
                      💡 <span className="font-semibold">Pro Tip:</span> {audit.twitterAudit?.proTip}
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-pink-500/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="font-bold text-pink-400">Instagram Scorecard</span>
                      <span className="font-mono text-xs font-bold text-white bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                        {audit.instagramAudit?.engagementScore}/100 Engagement
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>Visual-Caption Synergy:</span>
                        <span className="font-bold text-zinc-200">{audit.instagramAudit?.captionSynergy}%</span>
                      </div>
                      <div className="text-zinc-400 pt-1">
                        <span className="font-semibold text-zinc-300">Comment Bait:</span> {audit.instagramAudit?.commentDriver}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-pink-500/5 border border-pink-500/10 text-[11px] text-pink-300">
                      💡 <span className="font-semibold">Pro Tip:</span> {audit.instagramAudit?.proTip}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cross-Platform Rollout Schedule */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> 7-Day Compounding Rollout Funnel
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {audit.crossPlatformRollout?.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
                          {step.day}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                          {step.platform}
                        </span>
                      </div>
                      <div className="font-semibold text-zinc-200 text-xs">{step.action}</div>
                      <p className="text-[11px] text-zinc-400 leading-snug">{step.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Powered by Gemini 4 Argon deep reasoning architecture
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={onRunAudit}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Re-Analyze Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
