import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Zap,
  Sliders,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share,
  BadgeCheck,
  AlertTriangle,
} from 'lucide-react';
import { PlatformVisualConfig, TwitterPostData } from '../types';

interface TwitterCardProps {
  post: TwitterPostData;
  visual: PlatformVisualConfig;
  onUpdatePost: (updated: Partial<TwitterPostData>) => void;
  onOpenVisualModal: () => void;
  onQuickRefine: (action: 'punchy_hook' | 'shorten' | 'flip_tone' | 'boost_engagement', tone?: string) => void;
  isRefining: boolean;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const TwitterCard: React.FC<TwitterCardProps> = ({
  post,
  visual,
  onUpdatePost,
  onOpenVisualModal,
  onQuickRefine,
  isRefining,
  onToast,
}) => {
  const [viewMode, setViewMode] = useState<'mockup' | 'raw'>('mockup');
  const [copied, setCopied] = useState(false);
  const [copiedThread, setCopiedThread] = useState(false);

  const charCount = post.mainTweet.length;
  const isOverLimit = charCount > 280;

  const handleCopyMain = () => {
    navigator.clipboard.writeText(post.mainTweet);
    setCopied(true);
    onToast('Main tweet copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyFullThread = () => {
    const threadFormatted = [post.mainTweet, ...(post.threadTweets || [])]
      .map((t, idx) => `${idx + 1}/ ${t}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(threadFormatted);
    setCopiedThread(true);
    onToast('Full 3-tweet thread copied to clipboard!', 'success');
    setTimeout(() => setCopiedThread(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md dark:shadow-xl flex flex-col transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/80">
      {/* Platform Header Bar */}
      <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 flex items-center justify-center text-white font-bold text-xs">
            𝕏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Twitter / X</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 font-medium">
                Punchy & Thread
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Optimal Aspect: 16:9 • High-Contrast Visual</p>
          </div>
        </div>

        {/* View Switcher & Copy */}
        <div className="flex items-center gap-1.5">
          <div className="flex bg-zinc-200/70 dark:bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700/60 text-xs">
            <button
              onClick={() => setViewMode('mockup')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === 'mockup' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Mockup
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === 'raw' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Edit
            </button>
          </div>

          <button
            onClick={handleCopyMain}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 flex-1 flex flex-col space-y-4">
        {viewMode === 'mockup' ? (
          /* Realistic X/Twitter Feed Mockup */
          <div className="space-y-4">
            {/* Main Tweet Card */}
            <div className="bg-black border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10">
                    𝕏
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1">
                      OmniPost <BadgeCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    </div>
                    <div className="text-[11px] text-zinc-500">@omnipost_ai • 12m</div>
                  </div>
                </div>
              </div>

              {/* Main Tweet Body */}
              <p className="text-zinc-100 text-sm leading-relaxed whitespace-pre-line font-sans">
                {post.mainTweet}
              </p>

              {/* Attached Visual */}
              <div
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden relative group cursor-pointer"
                onClick={onOpenVisualModal}
              >
                {visual.imageUrl ? (
                  <img
                    src={visual.imageUrl}
                    alt="Twitter visual"
                    className="w-full h-auto object-cover max-h-[300px] transition-transform duration-300 group-hover:scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />
                ) : visual.isGenerating ? (
                  <div className="w-full h-44 flex flex-col items-center justify-center gap-2 text-zinc-400">
                    <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[11px]">Generating optimal 16:9 Twitter visual...</span>
                  </div>
                ) : (
                  <div className="w-full h-36 flex flex-col items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-300">
                    <Sparkles className="w-5 h-5 text-zinc-600" />
                    <span className="text-[11px]">Click to customize / generate visual</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 text-white text-[11px] font-medium border border-zinc-700 shadow-lg flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-sky-400" /> Customize Visual ({visual.aspectRatio || '16:9'} • {visual.imageSize || '2K'})
                  </span>
                </div>
              </div>

              {/* Tweet Action Mockup */}
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-zinc-500 text-xs px-2">
                <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" /> 84
                </span>
                <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                  <Repeat2 className="w-3.5 h-3.5" /> 162
                </span>
                <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                  <Heart className="w-3.5 h-3.5" /> 1.2K
                </span>
                <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                  <Bookmark className="w-3.5 h-3.5" /> 312
                </span>
                <span className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
                  <Share className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Thread Follow-Up Tweets (Tweet 2 & 3) */}
            {post.threadTweets && post.threadTweets.length > 0 && (
              <div className="space-y-2 border-l-2 border-zinc-800 ml-4 pl-3">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Thread Continuations (2/3 & 3/3)
                </span>
                {post.threadTweets.map((tweetText, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                      <span className="font-semibold text-zinc-200">Tweet {idx + 2}/3</span>
                      <span className="font-mono text-[10px] text-zinc-500">{tweetText.length} chars</span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-line">{tweetText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Raw Editor Mode */
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Main Tweet (Strict 280-char limit)
              </label>
              <textarea
                rows={5}
                value={post.mainTweet}
                onChange={(e) => onUpdatePost({ mainTweet: e.target.value })}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:border-sky-500 outline-none resize-none leading-relaxed font-sans"
              />
            </div>

            {post.threadTweets && post.threadTweets.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Thread Follow-ups
                </label>
                {post.threadTweets.map((t, i) => (
                  <textarea
                    key={i}
                    rows={2}
                    value={t}
                    onChange={(e) => {
                      const updatedThread = [...post.threadTweets];
                      updatedThread[i] = e.target.value;
                      onUpdatePost({ threadTweets: updatedThread });
                    }}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:border-sky-500 outline-none resize-none leading-relaxed"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Character Count Progress Meter */}
        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              {isOverLimit && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
              Main Tweet Length
            </span>
            <span
              className={`font-mono text-xs font-bold ${
                isOverLimit ? 'text-rose-500' : charCount > 240 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {charCount} / 280
            </span>
          </div>

          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverLimit ? 'bg-rose-500' : charCount > 240 ? 'bg-amber-500' : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(100, (charCount / 280) * 100)}%` }}
            />
          </div>
        </div>

        {/* Primary Copy to Clipboard Button & Thread Action */}
        <div className="space-y-2">
          <button
            onClick={handleCopyMain}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border border-zinc-800 dark:border-zinc-600/80 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tweet Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>

          {post.threadTweets && post.threadTweets.length > 0 && (
            <button
              onClick={handleCopyFullThread}
              className="w-full py-2 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedThread ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-300" />}
              <span>{copiedThread ? 'Thread Copied to Clipboard!' : 'Copy Full 3-Tweet Thread'}</span>
            </button>
          )}
        </div>

        {/* Fast Refinement Bar (Powered by gemini-3.1-flash-lite) */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Instant Refine (gemini-3.1-flash-lite)
            </span>
            {isRefining && <span className="text-[10px] text-amber-500 dark:text-amber-400 animate-pulse">Polishing...</span>}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onQuickRefine('shorten')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              ⚡ Force &lt;280 Chars
            </button>
            <button
              onClick={() => onQuickRefine('punchy_hook')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              🎯 Max Punch Hook
            </button>
            <button
              onClick={() => onQuickRefine('flip_tone', 'witty')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              😄 Make Witty
            </button>
            <button
              onClick={() => onQuickRefine('boost_engagement')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              💬 Retweet Bait
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
