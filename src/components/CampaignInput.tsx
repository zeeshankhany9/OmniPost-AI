import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Sliders,
  Maximize2,
  Cpu,
  Layers,
  ChevronDown,
  Briefcase,
  Laugh,
  Flame,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { AspectRatioType, ImageModelType, ImageSizeType, ToneType } from '../types';

interface CampaignInputProps {
  onGenerate: (params: {
    idea: string;
    tone: ToneType;
    audience: string;
    imageSize: ImageSizeType;
    imageModel: ImageModelType;
    defaultAspectRatio: AspectRatioType | 'platform_optimized';
  }) => void;
  isLoading: boolean;
}

const TONE_OPTIONS: Array<{
  id: ToneType;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    id: 'professional',
    label: 'Professional',
    desc: 'Thought-leadership, authority & B2B credibility',
    icon: <Briefcase className="w-4 h-4" />,
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'witty',
    label: 'Witty',
    desc: 'Clever, humorous, punchy & engaging',
    icon: <Laugh className="w-4 h-4" />,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'urgent',
    label: 'Urgent',
    desc: 'High FOMO, breaking announcement, fast action',
    icon: <Flame className="w-4 h-4" />,
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300',
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    desc: 'Visionary, motivational, storytelling journey',
    icon: <Lightbulb className="w-4 h-4" />,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    desc: 'Behind-the-scenes founder or builder narrative',
    icon: <BookOpen className="w-4 h-4" />,
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300',
  },
];

const PRESET_IDEAS = [
  {
    title: '🚀 Launching AI Meeting Copilot',
    idea: 'We just launched an open-source AI meeting agent that transcribes, extracts actionable tasks, and drafts follow-up emails in real-time. Saved our 12-person team 18 hours this week.',
    tone: 'witty' as ToneType,
    audience: 'Tech founders, Product Managers, Remote Workers',
  },
  {
    title: '💡 Quitting 9-to-5 for Bootstrapping',
    idea: '12 months ago I resigned from a VP Engineering role at Big Tech to bootstrap a SaaS. No VC funding, no safety net. Here is what happened to my income, sanity, and marriage.',
    tone: 'professional' as ToneType,
    audience: 'Software Engineers, Indie Hackers, Mid-career professionals',
  },
  {
    title: '⚡ Critical Zero-Day Vulnerability Alert',
    idea: 'A major security vulnerability was just disclosed affecting npm packages downloaded over 40M times. Immediate patching required before attackers scan exposed cloud endpoints.',
    tone: 'urgent' as ToneType,
    audience: 'DevOps, Security Engineers, CTOs',
  },
];

export const CampaignInput: React.FC<CampaignInputProps> = ({ onGenerate, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [audience, setAudience] = useState('Founders, creators & digital professionals');
  const [imageSize, setImageSize] = useState<ImageSizeType>('2K');
  const [imageModel, setImageModel] = useState<ImageModelType>('gemini-3-pro-image-preview');
  const [aspectRatioOverride, setAspectRatioOverride] = useState<AspectRatioType | 'platform_optimized'>('platform_optimized');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;
    onGenerate({
      idea,
      tone,
      audience,
      imageSize,
      imageModel,
      defaultAspectRatio: aspectRatioOverride,
    });
  };

  const loadPreset = (preset: (typeof PRESET_IDEAS)[0]) => {
    setIdea(preset.idea);
    setTone(preset.tone);
    setAudience(preset.audience);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
      {/* Decorative ambient gradient */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Header callout */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> 1-Click Tri-Platform Engine
            </span>
            <span className="text-xs text-zinc-500">LinkedIn • Twitter/X • Instagram</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            What idea or story do you want to publish?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            OmniPost simultaneously creates long-form LinkedIn thought-leadership, punchy Twitter/X threads, and aesthetic Instagram captions with matching visuals.
          </p>
        </div>

        {/* Idea Presets */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Or pick an inspiration spark:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_IDEAS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(preset)}
                className="text-left p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-xs text-zinc-700 dark:text-zinc-300 group"
              >
                <div className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-white truncate">
                  {preset.title}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                  Tone: <span className="capitalize">{preset.tone}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Idea Input */}
        <div className="space-y-2">
          <label htmlFor="idea-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Core Idea / Announcement / Story <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="idea-input"
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Paste your rough thoughts, a product launch, a milestone, lessons learned, or an industry observation..."
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm leading-relaxed resize-none transition-all outline-none"
            required
          />
        </div>

        {/* Tone Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Desired Tone <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-zinc-500">Guides language, hooks, and style</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {TONE_OPTIONS.map((item) => {
              const isSelected = tone === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTone(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-b ${item.color} shadow-sm ring-1 ring-indigo-500/20`
                      : 'bg-zinc-50/80 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                      {item.icon} {item.label}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-sm animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label htmlFor="audience-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Target Audience
          </label>
          <input
            id="audience-input"
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. B2B buyers, indie makers, startup founders, creative directors"
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
          />
        </div>

        {/* Advanced Visual Generation Settings Accordion */}
        <div className="border border-zinc-200 dark:border-zinc-800/90 rounded-xl bg-zinc-50/60 dark:bg-zinc-950/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Studio Visual Settings</span>
              <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded font-mono">
                Model: {imageModel === 'gemini-3-pro-image-preview' ? '3-pro-image' : 'nano-banana-2.1'} • Size: {imageSize}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          {showAdvanced && (
            <div className="p-4 pt-2 border-t border-zinc-200 dark:border-zinc-800/60 space-y-4 text-xs">
              {/* Image Size affordance (1K, 2K, 4K) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                    Image Resolution / Size
                  </span>
                  <span className="text-[11px] text-zinc-500">Supported by studio model</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSizeType[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setImageSize(sz)}
                      className={`py-2 px-3 rounded-lg border text-center font-mono font-medium transition-all ${
                        imageSize === sz
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-700 dark:text-purple-200'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {sz} {sz === '2K' && <span className="text-[10px] text-purple-600 dark:text-purple-400 ml-1">(Recommended)</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Model Affordance */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    Image Generation Engine
                  </span>
                  <span className="text-[11px] text-zinc-500">Gemini Image Preview</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-3-pro-image-preview')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      imageModel === 'gemini-3-pro-image-preview'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-800 dark:text-indigo-200 ring-1 ring-indigo-500/30'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="font-semibold text-zinc-900 dark:text-zinc-200 flex items-center justify-between">
                      <span>gemini-3-pro-image-preview</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                        Studio Pro
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                      Highest fidelity studio rendering, supports 1K, 2K, and 4K resolutions.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-nano-banana-2.1')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      imageModel === 'gemini-nano-banana-2.1'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-800 dark:text-indigo-200 ring-1 ring-indigo-500/30'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="font-semibold text-zinc-900 dark:text-zinc-200 flex items-center justify-between">
                      <span>gemini-nano-banana-2.1</span>
                      <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                        Fast & Flexible
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                      Broad aspect ratio support (1:1 up to 21:9), rapid generation.
                    </p>
                  </button>
                </div>
              </div>

              {/* Aspect Ratio Affordance */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    Aspect Ratio Mode
                  </span>
                  <span className="text-[11px] text-zinc-500">All 8 standard aspect ratios supported</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAspectRatioOverride('platform_optimized')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      aspectRatioOverride === 'platform_optimized'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-800 dark:text-emerald-200'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    ✨ Auto-Optimized (LinkedIn 16:9 • Twitter 16:9 • IG 1:1)
                  </button>

                  {(['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'] as AspectRatioType[]).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setAspectRatioOverride(ar)}
                      className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                        aspectRatioOverride === ar
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-800 dark:text-emerald-200'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:scale-[0.99] transition-all shadow-xl shadow-indigo-600/25 border border-white/20 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simultaneously Generating 3 Platforms & Visuals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Simultaneously Generate LinkedIn, Twitter/X & Instagram</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-zinc-500 mt-2">
            Generates 3 customized drafted posts + 3 distinct tailored images in parallel.
          </p>
        </div>
      </form>
    </div>
  );
};
