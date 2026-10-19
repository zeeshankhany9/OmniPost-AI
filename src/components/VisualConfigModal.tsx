import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Maximize2,
  Layers,
  Cpu,
  Download,
  RefreshCw,
  Check,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { AspectRatioType, ImageModelType, ImageSizeType, PlatformType, PlatformVisualConfig } from '../types';

interface VisualConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformType;
  visualConfig: PlatformVisualConfig;
  onRegenerate: (params: {
    platform: PlatformType;
    prompt: string;
    aspectRatio: AspectRatioType;
    imageSize: ImageSizeType;
    model: ImageModelType;
  }) => void;
  isGenerating: boolean;
}

const ALL_ASPECT_RATIOS: Array<{ ratio: AspectRatioType; desc: string }> = [
  { ratio: '1:1', desc: 'Square (IG / Post standard)' },
  { ratio: '16:9', desc: 'Landscape (LinkedIn / X optimal)' },
  { ratio: '4:3', desc: 'Standard Desktop' },
  { ratio: '9:16', desc: 'Vertical / Story / Reel' },
  { ratio: '3:4', desc: 'Portrait Feed' },
  { ratio: '3:2', desc: 'Photography Landscape' },
  { ratio: '2:3', desc: 'Tall Portrait' },
  { ratio: '21:9', desc: 'Cinematic Ultra-Wide' },
];

export const VisualConfigModal: React.FC<VisualConfigModalProps> = ({
  isOpen,
  onClose,
  platform,
  visualConfig,
  onRegenerate,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState(visualConfig.prompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(visualConfig.aspectRatio || '1:1');
  const [imageSize, setImageSize] = useState<ImageSizeType>(visualConfig.imageSize || '2K');
  const [model, setModel] = useState<ImageModelType>(visualConfig.model || 'gemini-3-pro-image-preview');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerate({
      platform,
      prompt,
      aspectRatio,
      imageSize,
      model,
    });
  };

  const handleDownload = () => {
    if (!visualConfig.imageUrl) return;
    const a = document.createElement('a');
    a.href = visualConfig.imageUrl;
    a.download = `omnipost-${platform}-${aspectRatio.replace(':', 'x')}-${imageSize.toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPromptText = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const platformTitle =
    platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'Twitter / X' : 'Instagram';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Visual Studio: {platformTitle}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Customize aspect ratio, resolution (1K/2K/4K), and generation prompt
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300">
          {/* Current Preview */}
          <div className="space-y-2">
            <span className="font-semibold uppercase tracking-wider text-zinc-400">Current Visual</span>
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              {visualConfig.imageUrl ? (
                <div className="relative max-h-[300px] w-full flex items-center justify-center">
                  <img
                    src={visualConfig.imageUrl}
                    alt={`${platformTitle} visual`}
                    className="max-h-[280px] max-w-full rounded-lg object-contain shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      onClick={handleDownload}
                      className="px-2.5 py-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-md flex items-center gap-1.5 text-[11px] font-medium"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-400 text-xs">Rendering studio visual with {model}...</p>
                </div>
              ) : (
                <div className="text-center py-10 text-zinc-500 space-y-1">
                  <AlertCircle className="w-6 h-6 mx-auto text-zinc-600 mb-1" />
                  <p>No image generated yet.</p>
                  <p className="text-[11px]">Click "Generate / Re-render" below to create one.</p>
                </div>
              )}

              {/* Status footer pill */}
              <div className="mt-3 w-full flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-900">
                <span className="font-mono">Aspect: {aspectRatio}</span>
                <span className="font-mono">Size: {imageSize}</span>
                <span className="font-mono">Engine: {model}</span>
              </div>
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-zinc-300">
                Visual Art Prompt
              </label>
              <button
                type="button"
                onClick={copyPromptText}
                className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedPrompt ? 'Copied' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs leading-relaxed outline-none transition-all resize-none"
              placeholder="Describe the image you want Gemini to generate..."
            />
          </div>

          {/* Aspect Ratio Selector (affordance for 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Select Aspect Ratio
              </span>
              <span className="text-[11px] text-zinc-500">
                Platform default: {platform === 'instagram' ? '1:1' : '16:9'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_ASPECT_RATIOS.map((item) => {
                const isSelected = aspectRatio === item.ratio;
                return (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => setAspectRatio(item.ratio)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500/60 text-white shadow-sm ring-1 ring-indigo-500/40'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-mono font-bold text-xs">{item.ratio}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Size Selector (affordance for 1K, 2K, 4K) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                Image Resolution Size
              </span>
              <span className="text-[11px] text-zinc-500">Studio quality scaling</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(['1K', '2K', '4K'] as ImageSizeType[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setImageSize(sz)}
                  className={`py-2 px-3 rounded-lg border text-center font-mono font-medium transition-all ${
                    imageSize === sz
                      ? 'bg-purple-500/20 border-purple-500/60 text-purple-200 ring-1 ring-purple-500/40'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-bold">{sz}</div>
                  <div className="text-[10px] text-zinc-400">
                    {sz === '1K' ? '1024px standard' : sz === '2K' ? '2048px high-def' : '4096px ultra-crisp'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Engine Model Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Image Model
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModel('gemini-3-pro-image-preview')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  model === 'gemini-3-pro-image-preview'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-xs text-white">gemini-3-pro-image-preview</div>
                <div className="text-[10px] text-zinc-400">Studio Pro - Flagship quality (1K, 2K, 4K)</div>
              </button>

              <button
                type="button"
                onClick={() => setModel('gemini-nano-banana-2.1')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  model === 'gemini-nano-banana-2.1'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-semibold text-xs text-white">gemini-nano-banana-2.1</div>
                <div className="text-[10px] text-zinc-400">General & Rapid - Multi-aspect versatility</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isGenerating || !prompt.trim()}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-indigo-600/30"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rendering {imageSize} Image...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Re-render Image with Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
