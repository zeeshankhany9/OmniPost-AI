import React from 'react';
import {
  Sparkles,
  Share2,
  BrainCircuit,
  Download,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import { CampaignData } from '../types';

interface HeaderProps {
  currentCampaign: CampaignData | null;
  onOpenAudit: () => void;
  onExport: () => void;
  onReset: () => void;
  isAuditing: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCampaign,
  onOpenAudit,
  onExport,
  onReset,
  isAuditing,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">OmniPost AI</h1>
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Multi-Channel Studio
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Simultaneous cross-platform copy & studio visuals
            </p>
          </div>
        </div>

        {/* Model Intelligence Badges (desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="font-mono text-indigo-600 dark:text-indigo-300">gemini-3.8-flash</span>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="font-mono text-purple-600 dark:text-purple-300">gemini-3-pro-image</span>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-300">gemini-4-argon</span>
          </div>
        </div>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer shadow-sm active:scale-95"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {currentCampaign && (
            <>
              <button
                onClick={onOpenAudit}
                disabled={isAuditing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                title="Run deep audience resonance audit using gemini-4-argon"
              >
                <BrainCircuit className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Strategic Audit</span>
                <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 rounded font-mono text-emerald-700 dark:text-emerald-200">
                  4-argon
                </span>
              </button>

              <button
                onClick={onExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all"
                title="Export all posts and assets"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={onReset}
                className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Start New Campaign"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
