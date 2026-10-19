import React, { useState } from 'react';
import {
  Linkedin,
  Copy,
  Check,
  Maximize2,
  Sparkles,
  Zap,
  Clock,
  Eye,
  Edit3,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Globe,
  Sliders,
} from 'lucide-react';
import { LinkedInPostData, PlatformVisualConfig } from '../types';

interface LinkedInCardProps {
  post: LinkedInPostData;
  visual: PlatformVisualConfig;
  onUpdatePost: (updated: Partial<LinkedInPostData>) => void;
  onOpenVisualModal: () => void;
  onQuickRefine: (action: 'punchy_hook' | 'shorten' | 'flip_tone' | 'boost_engagement', tone?: string) => void;
  isRefining: boolean;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const LinkedInCard: React.FC<LinkedInCardProps> = ({
  post,
  visual,
  onUpdatePost,
  onOpenVisualModal,
  onQuickRefine,
  isRefining,
  onToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'mockup' | 'raw'>('mockup');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `${post.headline ? post.headline + '\n\n' : ''}${post.content}\n\n${post.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    onToast('LinkedIn post copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md dark:shadow-xl flex flex-col transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/80">
      {/* Platform Header Bar */}
      <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0077B5]/20 border border-[#0077B5]/40 flex items-center justify-center text-[#0A66C2]">
            <Linkedin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">LinkedIn</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                Long-form
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Optimal Aspect: 16:9 • Strategic & B2B</p>
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
            onClick={handleCopy}
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
          /* Realistic LinkedIn Feed Mockup */
          <div className="bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 rounded-xl p-4 space-y-3.5 text-xs shadow-xs">
            {/* LinkedIn Author Row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10">
                  OP
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    OmniPost Creator <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-normal">• 1st</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">Strategic Content Architect & Thought Leader</p>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    <span>Just now</span> • <Globe className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300" />
            </div>

            {/* Headline Callout */}
            {post.headline && (
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug border-l-2 border-blue-500 pl-2.5 py-0.5">
                {post.headline}
              </div>
            )}

            {/* Post Content */}
            <div className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-normal space-y-2">
              {post.content}
            </div>

            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-[#0A66C2] hover:underline font-medium cursor-pointer">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}

            {/* Attached LinkedIn Visual */}
            <div className="pt-2">
              <div
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden relative group cursor-pointer"
                onClick={onOpenVisualModal}
              >
                {visual.imageUrl ? (
                  <img
                    src={visual.imageUrl}
                    alt="LinkedIn visual"
                    className="w-full h-auto object-cover max-h-[320px] transition-transform duration-300 group-hover:scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />
                ) : visual.isGenerating ? (
                  <div className="w-full h-48 flex flex-col items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[11px]">Generating optimal 16:9 LinkedIn image...</span>
                  </div>
                ) : (
                  <div className="w-full h-40 flex flex-col items-center justify-center gap-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300">
                    <Sparkles className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                    <span className="text-[11px]">Click to generate / customize visual</span>
                  </div>
                )}

                {/* Hover overlay button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 text-white text-[11px] font-medium border border-zinc-700/80 shadow-lg flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" /> Customize Visual ({visual.aspectRatio || '16:9'} • {visual.imageSize || '2K'})
                  </span>
                </div>
              </div>
            </div>

            {/* Social Engagement Counters Mockup */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white">👍</span>
                <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[9px] text-white -ml-2">❤️</span>
                <span className="ml-1 text-zinc-600 dark:text-zinc-400 font-medium">142</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                <span>38 comments</span> • <span>19 reposts</span>
              </div>
            </div>

            {/* Social Action Bar */}
            <div className="border-t border-zinc-200 dark:border-zinc-800/60 pt-2 grid grid-cols-4 gap-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              <button className="py-1.5 flex items-center justify-center gap-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-700 dark:text-zinc-300">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </button>
              <button className="py-1.5 flex items-center justify-center gap-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-700 dark:text-zinc-300">
                <MessageSquare className="w-3.5 h-3.5" /> Comment
              </button>
              <button className="py-1.5 flex items-center justify-center gap-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-700 dark:text-zinc-300">
                <Repeat2 className="w-3.5 h-3.5" /> Repost
              </button>
              <button className="py-1.5 flex items-center justify-center gap-1.5 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-700 dark:text-zinc-300">
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        ) : (
          /* Raw Editor Mode */
          <div className="space-y-3 flex-1 flex flex-col">
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                Headline (Optional Hook)
              </label>
              <input
                type="text"
                value={post.headline}
                onChange={(e) => onUpdatePost({ headline: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                Post Body
              </label>
              <textarea
                rows={10}
                value={post.content}
                onChange={(e) => onUpdatePost({ content: e.target.value })}
                className="w-full flex-1 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-200 focus:border-blue-500 outline-none resize-none leading-relaxed font-sans"
              />
            </div>
          </div>
        )}

        {/* Primary Copy to Clipboard Button */}
        <button
          onClick={handleCopy}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Post Copied to Clipboard!' : 'Copy to Clipboard'}</span>
        </button>

        {/* Readability & Stats Bar */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-1 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" /> ~{post.estimatedReadSeconds || Math.round(wordCount / 3.5)}s read
            </span>
            <span>{wordCount} words</span>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            Aspect: {visual.aspectRatio || '16:9'} • Size: {visual.imageSize || '2K'}
          </span>
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
              onClick={() => onQuickRefine('punchy_hook')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              🔥 Sharpen Hook
            </button>
            <button
              onClick={() => onQuickRefine('shorten')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              ✂️ Shorten 30%
            </button>
            <button
              onClick={() => onQuickRefine('flip_tone', 'witty')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              😄 Make Witty
            </button>
            <button
              onClick={() => onQuickRefine('flip_tone', 'urgent')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              🚨 Make Urgent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
