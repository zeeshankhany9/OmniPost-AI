import React, { useState } from 'react';
import {
  Instagram,
  Copy,
  Check,
  Sparkles,
  Zap,
  Sliders,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Hash,
  Layers,
} from 'lucide-react';
import { InstagramPostData, PlatformVisualConfig } from '../types';

interface InstagramCardProps {
  post: InstagramPostData;
  visual: PlatformVisualConfig;
  onUpdatePost: (updated: Partial<InstagramPostData>) => void;
  onOpenVisualModal: () => void;
  onQuickRefine: (action: 'punchy_hook' | 'shorten' | 'flip_tone' | 'boost_engagement', tone?: string) => void;
  isRefining: boolean;
  onToast: (msg: string, type?: 'success' | 'error') => void;
}

export const InstagramCard: React.FC<InstagramCardProps> = ({
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
  const [copiedTags, setCopiedTags] = useState(false);

  const handleCopyCaption = () => {
    const formattedTags = post.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');
    const fullPost = `${post.caption}\n\n.\n.\n.\n${formattedTags}`;
    navigator.clipboard.writeText(fullPost);
    setCopied(true);
    onToast('Instagram caption + hashtags copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHashtagsOnly = () => {
    const formattedTags = post.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');
    navigator.clipboard.writeText(formattedTags);
    setCopiedTags(true);
    onToast('Copied all Instagram hashtags!', 'success');
    setTimeout(() => setCopiedTags(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md dark:shadow-xl flex flex-col transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/80">
      {/* Platform Header Bar */}
      <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Instagram className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Instagram</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 font-medium">
                Visual & Tags
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Optimal Aspect: 1:1 • High-Aesthetic Grid</p>
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
            onClick={handleCopyCaption}
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
          /* Realistic Instagram Feed Post Mockup */
          <div className="bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs shadow-xs">
            {/* Instagram Profile Header */}
            <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 to-fuchsia-600">
                  <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-900 dark:text-white text-[10px] font-bold">
                    OP
                  </div>
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 text-[11px]">
                    omnipost.studio
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Original Content</div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300" />
            </div>

            {/* Attached 1:1 Visual Square */}
            <div
              className="w-full bg-black flex items-center justify-center relative group cursor-pointer aspect-square overflow-hidden"
              onClick={onOpenVisualModal}
            >
              {visual.imageUrl ? (
                <img
                  src={visual.imageUrl}
                  alt="Instagram visual"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              ) : visual.isGenerating ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400 p-6">
                  <div className="w-7 h-7 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] text-center">Rendering 1:1 Instagram studio visual...</span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-zinc-200 p-6">
                  <Sparkles className="w-6 h-6 text-zinc-500" />
                  <span className="text-[11px]">Click to generate 1:1 visual</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 text-white text-[11px] font-medium border border-zinc-700 shadow-lg flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" /> Customize Visual ({visual.aspectRatio || '1:1'} • {visual.imageSize || '2K'})
                </span>
              </div>
            </div>

            {/* Instagram Social Bar */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-200">
                  <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer transition-colors" />
                  <MessageCircle className="w-4 h-4 hover:text-zinc-500 cursor-pointer transition-colors" />
                  <Send className="w-4 h-4 hover:text-zinc-500 cursor-pointer transition-colors" />
                </div>
                <Bookmark className="w-4 h-4 text-zinc-700 dark:text-zinc-200 hover:text-zinc-500 cursor-pointer transition-colors" />
              </div>

              <div className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">2,419 likes</div>

              {/* Caption */}
              <div className="space-y-1 text-zinc-800 dark:text-zinc-300 text-xs leading-relaxed">
                <p>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 mr-1.5">omnipost.studio</span>
                  {post.caption}
                </p>
              </div>

              {/* Engagement Prompt Highlight */}
              {post.engagementPrompt && (
                <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-700 dark:text-pink-300 text-[11px]">
                  💬 <span className="font-semibold">Question:</span> {post.engagementPrompt}
                </div>
              )}

              {/* Carousel Highlights */}
              {post.carouselPoints && post.carouselPoints.length > 0 && (
                <div className="pt-1 space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-pink-500 dark:text-pink-400" /> Suggested Carousel Slides
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px]">
                    {post.carouselPoints.map((point, i) => (
                      <div key={i} className="p-1.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                        <span className="font-bold text-pink-600 dark:text-pink-400 mr-1">#{i + 1}</span> {point}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Raw Editor Mode */
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                Instagram Caption
              </label>
              <textarea
                rows={9}
                value={post.caption}
                onChange={(e) => onUpdatePost({ caption: e.target.value })}
                className="w-full flex-1 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-200 focus:border-pink-500 outline-none resize-none leading-relaxed font-sans"
              />
            </div>
          </div>
        )}

        {/* Curated Hashtags Manager */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" /> Curated Hashtags ({post.hashtags?.length || 0})
            </span>
            <button
              onClick={handleCopyHashtagsOnly}
              className="text-[10px] text-pink-600 dark:text-pink-400 hover:text-pink-500 font-medium flex items-center gap-1 cursor-pointer"
            >
              {copiedTags ? <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedTags ? 'Copied' : 'Copy Tags Only'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
            {post.hashtags?.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* Primary Copy to Clipboard Button */}
        <button
          onClick={handleCopyCaption}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:via-rose-500 hover:to-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-pink-600/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Caption Copied to Clipboard!' : 'Copy to Clipboard'}</span>
        </button>

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
              onClick={() => onQuickRefine('boost_engagement')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              ✨ Boost Comment Bait
            </button>
            <button
              onClick={() => onQuickRefine('punchy_hook')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              🔥 Scroll-Stop First Line
            </button>
            <button
              onClick={() => onQuickRefine('flip_tone', 'witty')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              😄 Make Witty
            </button>
            <button
              onClick={() => onQuickRefine('shorten')}
              disabled={isRefining}
              className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              ✂️ Crisp Caption
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
