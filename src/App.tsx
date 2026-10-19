import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  History,
  Trash2,
  ExternalLink,
  HelpCircle,
  Share2,
  Download,
  Info,
} from 'lucide-react';
import {
  AspectRatioType,
  CampaignData,
  ImageModelType,
  ImageSizeType,
  PlatformType,
  PlatformVisualConfig,
  ToneType,
} from './types';
import { apiGenerateCampaign, apiGenerateImage, apiQuickRefine, apiStrategicAudit } from './utils/api';
import { Header } from './components/Header';
import { CampaignInput } from './components/CampaignInput';
import { LinkedInCard } from './components/LinkedInCard';
import { TwitterCard } from './components/TwitterCard';
import { InstagramCard } from './components/InstagramCard';
import { VisualConfigModal } from './components/VisualConfigModal';
import { StrategicAuditModal } from './components/StrategicAuditModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignData[]>([]);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [activeVisualModal, setActiveVisualModal] = useState<{ platform: PlatformType } | null>(null);
  const [isVisualGenerating, setIsVisualGenerating] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [refiningPlatform, setRefiningPlatform] = useState<PlatformType | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('omnipost_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('omnipost_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load saved campaigns from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omnipost_campaigns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedCampaigns(parsed);
          setCampaign(parsed[0]); // load latest by default
        }
      }
    } catch (e) {
      console.warn('Failed to load campaigns from localStorage', e);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const persistCampaign = (updatedCampaign: CampaignData) => {
    setCampaign(updatedCampaign);
    setSavedCampaigns((prev) => {
      const filtered = prev.filter((c) => c.id !== updatedCampaign.id);
      const nextList = [updatedCampaign, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('omnipost_campaigns', JSON.stringify(nextList));
      } catch (e) {
        console.warn('Storage quota exceeded, omitting image cache');
      }
      return nextList;
    });
  };

  /**
   * Handle simultaneous multi-platform generation
   */
  const handleGenerateCampaign = async (params: {
    idea: string;
    tone: ToneType;
    audience: string;
    imageSize: ImageSizeType;
    imageModel: ImageModelType;
    defaultAspectRatio: AspectRatioType | 'platform_optimized';
  }) => {
    setIsGeneratingCampaign(true);
    showToast('Drafting tailored posts for LinkedIn, Twitter, and Instagram...', 'info');

    try {
      // Step 1: Generate all 3 platform drafts simultaneously with gemini-3.8-flash
      const generated = await apiGenerateCampaign(params.idea, params.tone, params.audience);

      // Determine optimal aspect ratios for each platform
      const linkedinAspect: AspectRatioType =
        params.defaultAspectRatio === 'platform_optimized' ? '16:9' : params.defaultAspectRatio;
      const twitterAspect: AspectRatioType =
        params.defaultAspectRatio === 'platform_optimized' ? '16:9' : params.defaultAspectRatio;
      const instagramAspect: AspectRatioType =
        params.defaultAspectRatio === 'platform_optimized' ? '1:1' : params.defaultAspectRatio;

      const campaignId = 'camp_' + Date.now().toString();

      const initialCampaign: CampaignData = {
        id: campaignId,
        createdAt: new Date().toISOString(),
        idea: params.idea,
        tone: params.tone,
        audience: params.audience,
        campaignTitle: generated.campaignTitle || 'Social Media Campaign',
        coreMessage: generated.coreMessage || params.idea,
        linkedin: generated.linkedin,
        twitter: generated.twitter,
        instagram: generated.instagram,
        visuals: {
          linkedin: {
            prompt: generated.linkedin?.imagePrompt || `${params.idea}, professional LinkedIn editorial graphic`,
            aspectRatio: linkedinAspect,
            imageSize: params.imageSize,
            model: params.imageModel,
            isGenerating: true,
          },
          twitter: {
            prompt: generated.twitter?.imagePrompt || `${params.idea}, high-impact Twitter graphic`,
            aspectRatio: twitterAspect,
            imageSize: params.imageSize,
            model: params.imageModel,
            isGenerating: true,
          },
          instagram: {
            prompt: generated.instagram?.imagePrompt || `${params.idea}, vibrant aesthetic Instagram photography`,
            aspectRatio: instagramAspect,
            imageSize: params.imageSize,
            model: params.imageModel,
            isGenerating: true,
          },
        },
      };

      setCampaign(initialCampaign);
      showToast('Posts drafted! Simultaneously generating 3 platform visuals...', 'info');

      // Step 2: Concurrently generate distinct visual assets for all 3 platforms
      const generateVisualForPlatform = async (platform: PlatformType, prompt: string, aspect: AspectRatioType) => {
        try {
          const res = await apiGenerateImage({
            prompt,
            aspectRatio: aspect,
            imageSize: params.imageSize,
            preferredModel: params.imageModel,
            platform,
          });
          return { platform, imageUrl: res.imageUrl, modelUsed: res.modelUsed };
        } catch (err: any) {
          console.error(`Visual generation failed for ${platform}:`, err);
          return { platform, error: err?.message || 'Failed' };
        }
      };

      const results = await Promise.allSettled([
        generateVisualForPlatform('linkedin', initialCampaign.visuals.linkedin.prompt, linkedinAspect),
        generateVisualForPlatform('twitter', initialCampaign.visuals.twitter.prompt, twitterAspect),
        generateVisualForPlatform('instagram', initialCampaign.visuals.instagram.prompt, instagramAspect),
      ]);

      setCampaign((prev) => {
        if (!prev) return prev;
        const updatedVisuals = { ...prev.visuals };

        results.forEach((res) => {
          if (res.status === 'fulfilled' && res.value) {
            const { platform, imageUrl, error, modelUsed } = res.value;
            updatedVisuals[platform] = {
              ...updatedVisuals[platform],
              imageUrl: imageUrl || undefined,
              error: error || undefined,
              isGenerating: false,
              model: (modelUsed as ImageModelType) || updatedVisuals[platform].model,
            };
          }
        });

        const completed = { ...prev, visuals: updatedVisuals };
        persistCampaign(completed);
        return completed;
      });

      showToast('All 3 platforms and visuals successfully generated!', 'success');
    } catch (error: any) {
      console.error('Campaign generation failed:', error);
      showToast(error?.message || 'Failed to generate campaign', 'error');
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  /**
   * Regenerate single image with custom parameters
   */
  const handleRegenerateVisual = async (params: {
    platform: PlatformType;
    prompt: string;
    aspectRatio: AspectRatioType;
    imageSize: ImageSizeType;
    model: ImageModelType;
  }) => {
    if (!campaign) return;

    setIsVisualGenerating(true);
    showToast(`Rendering ${params.imageSize} visual for ${params.platform}...`, 'info');

    setCampaign((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        visuals: {
          ...prev.visuals,
          [params.platform]: {
            ...prev.visuals[params.platform],
            prompt: params.prompt,
            aspectRatio: params.aspectRatio,
            imageSize: params.imageSize,
            model: params.model,
            isGenerating: true,
          },
        },
      };
    });

    try {
      const res = await apiGenerateImage({
        prompt: params.prompt,
        aspectRatio: params.aspectRatio,
        imageSize: params.imageSize,
        preferredModel: params.model,
        platform: params.platform,
      });

      setCampaign((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          visuals: {
            ...prev.visuals,
            [params.platform]: {
              prompt: params.prompt,
              aspectRatio: params.aspectRatio,
              imageSize: params.imageSize,
              model: (res.modelUsed as ImageModelType) || params.model,
              imageUrl: res.imageUrl,
              isGenerating: false,
            },
          },
        };
        persistCampaign(updated);
        return updated;
      });

      showToast(`Updated ${params.platform} visual!`, 'success');
    } catch (err: any) {
      console.error('Failed to regenerate visual:', err);
      showToast(err?.message || 'Failed to generate image', 'error');
      setCampaign((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          visuals: {
            ...prev.visuals,
            [params.platform]: {
              ...prev.visuals[params.platform],
              isGenerating: false,
              error: err?.message,
            },
          },
        };
      });
    } finally {
      setIsVisualGenerating(false);
    }
  };

  /**
   * Fast Refinement with gemini-3.1-flash-lite
   */
  const handleQuickRefine = async (
    platform: PlatformType,
    action: 'punchy_hook' | 'shorten' | 'flip_tone' | 'boost_engagement',
    tone?: string
  ) => {
    if (!campaign) return;

    setRefiningPlatform(platform);
    showToast(`Applying instant polish (${action.replace('_', ' ')})...`, 'info');

    let textToRefine = '';
    if (platform === 'linkedin') textToRefine = campaign.linkedin.content;
    else if (platform === 'twitter') textToRefine = campaign.twitter.mainTweet;
    else if (platform === 'instagram') textToRefine = campaign.instagram.caption;

    try {
      const res = await apiQuickRefine({
        platform,
        text: textToRefine,
        action,
        tone,
      });

      setCampaign((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        if (platform === 'linkedin') {
          updated.linkedin = { ...updated.linkedin, content: res.refinedText };
        } else if (platform === 'twitter') {
          updated.twitter = {
            ...updated.twitter,
            mainTweet: res.refinedText,
            characterCount: res.refinedText.length,
          };
        } else if (platform === 'instagram') {
          updated.instagram = { ...updated.instagram, caption: res.refinedText };
        }
        persistCampaign(updated);
        return updated;
      });

      showToast('Polished with gemini-3.1-flash-lite!', 'success');
    } catch (err: any) {
      console.error('Quick refine failed:', err);
      showToast(err?.message || 'Refinement failed', 'error');
    } finally {
      setRefiningPlatform(null);
    }
  };

  /**
   * Run Strategic Audit with gemini-4-argon
   */
  const handleRunAudit = async () => {
    if (!campaign) return;

    setIsAuditing(true);
    setIsAuditModalOpen(true);

    try {
      const auditResult = await apiStrategicAudit({
        campaignTitle: campaign.campaignTitle,
        linkedinPost: campaign.linkedin.content,
        twitterPost: campaign.twitter.mainTweet,
        instagramPost: campaign.instagram.caption,
        tone: campaign.tone,
        audience: campaign.audience,
      });

      setCampaign((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, audit: auditResult };
        persistCampaign(updated);
        return updated;
      });

      showToast('Completed strategic audit with gemini-4-argon!', 'success');
    } catch (err: any) {
      console.error('Audit failed:', err);
      showToast(err?.message || 'Strategic audit failed', 'error');
    } finally {
      setIsAuditing(false);
    }
  };

  /**
   * Export Full Campaign Package as Markdown file
   */
  const handleExport = () => {
    if (!campaign) return;

    const markdown = `# ${campaign.campaignTitle}
**Created:** ${new Date(campaign.createdAt).toLocaleString()}  
**Tone:** ${campaign.tone}  
**Audience:** ${campaign.audience}  
**Core Message:** ${campaign.coreMessage}

---

## 1. LinkedIn (Long-Form)
**Headline:** ${campaign.linkedin.headline}  
**Aspect Ratio:** ${campaign.visuals.linkedin.aspectRatio} (${campaign.visuals.linkedin.imageSize})  
**Image Prompt:** ${campaign.visuals.linkedin.prompt}

### Content:
${campaign.linkedin.content}

### Hashtags:
${campaign.linkedin.hashtags?.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}

---

## 2. Twitter / X (Short & Punchy)
**Aspect Ratio:** ${campaign.visuals.twitter.aspectRatio} (${campaign.visuals.twitter.imageSize})  
**Image Prompt:** ${campaign.visuals.twitter.prompt}

### Main Tweet (${campaign.twitter.characterCount} chars):
${campaign.twitter.mainTweet}

### Follow-up Thread Tweets:
${campaign.twitter.threadTweets?.map((t, idx) => `Tweet ${idx + 2}/3:\n${t}`).join('\n\n')}

---

## 3. Instagram (Visual & Hashtags)
**Aspect Ratio:** ${campaign.visuals.instagram.aspectRatio} (${campaign.visuals.instagram.imageSize})  
**Image Prompt:** ${campaign.visuals.instagram.prompt}

### Caption:
${campaign.instagram.caption}

### Engagement Prompt:
${campaign.instagram.engagementPrompt}

### Curated Hashtags (${campaign.instagram.hashtags?.length}):
${campaign.instagram.hashtags?.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}

---
Generated with OmniPost AI (Google Gemini Models)
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnipost-campaign-${campaign.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Exported campaign as Markdown package!', 'success');
  };

  const handleReset = () => {
    setCampaign(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Header
        currentCampaign={campaign}
        onOpenAudit={() => {
          if (campaign?.audit) setIsAuditModalOpen(true);
          else handleRunAudit();
        }}
        onExport={handleExport}
        onReset={handleReset}
        isAuditing={isAuditing}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Campaign Input Section */}
        <section>
          <CampaignInput onGenerate={handleGenerateCampaign} isLoading={isGeneratingCampaign} />
        </section>

        {/* Campaign History Quick Bar */}
        {savedCampaigns.length > 1 && (
          <section className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-semibold shrink-0">
              <History className="w-3.5 h-3.5" /> Recent Campaigns:
            </span>
            {savedCampaigns.map((camp) => (
              <button
                key={camp.id}
                onClick={() => setCampaign(camp)}
                className={`px-3 py-1.5 rounded-lg border text-left shrink-0 transition-all ${
                  campaign?.id === camp.id
                    ? 'bg-indigo-600/10 dark:bg-indigo-600/20 border-indigo-500/50 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 shadow-xs'
                }`}
              >
                {camp.campaignTitle || camp.idea.slice(0, 24)}...
              </button>
            ))}
          </section>
        )}

        {/* Generated Multi-Platform Studio Grid */}
        {campaign ? (
          <section className="space-y-6 animate-fade-in">
            {/* Campaign Title & Meta Bar */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm dark:shadow-none">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                    {campaign.tone} Tone
                  </span>
                  <span>•</span>
                  <span>Audience: {campaign.audience}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {campaign.campaignTitle}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">{campaign.coreMessage}</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {campaign.audit ? 'View Strategic Audit' : 'Run Strategy Audit (4-argon)'}
                </button>
              </div>
            </div>

            {/* Tri-Platform Columns: LinkedIn, Twitter/X, Instagram */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* LinkedIn Column */}
              <LinkedInCard
                post={campaign.linkedin}
                visual={campaign.visuals.linkedin}
                onUpdatePost={(updated) => {
                  const updatedCampaign = {
                    ...campaign,
                    linkedin: { ...campaign.linkedin, ...updated },
                  };
                  persistCampaign(updatedCampaign);
                }}
                onOpenVisualModal={() => setActiveVisualModal({ platform: 'linkedin' })}
                onQuickRefine={(action, tone) => handleQuickRefine('linkedin', action, tone)}
                isRefining={refiningPlatform === 'linkedin'}
                onToast={showToast}
              />

              {/* Twitter / X Column */}
              <TwitterCard
                post={campaign.twitter}
                visual={campaign.visuals.twitter}
                onUpdatePost={(updated) => {
                  const updatedCampaign = {
                    ...campaign,
                    twitter: { ...campaign.twitter, ...updated },
                  };
                  persistCampaign(updatedCampaign);
                }}
                onOpenVisualModal={() => setActiveVisualModal({ platform: 'twitter' })}
                onQuickRefine={(action, tone) => handleQuickRefine('twitter', action, tone)}
                isRefining={refiningPlatform === 'twitter'}
                onToast={showToast}
              />

              {/* Instagram Column */}
              <InstagramCard
                post={campaign.instagram}
                visual={campaign.visuals.instagram}
                onUpdatePost={(updated) => {
                  const updatedCampaign = {
                    ...campaign,
                    instagram: { ...campaign.instagram, ...updated },
                  };
                  persistCampaign(updatedCampaign);
                }}
                onOpenVisualModal={() => setActiveVisualModal({ platform: 'instagram' })}
                onQuickRefine={(action, tone) => handleQuickRefine('instagram', action, tone)}
                isRefining={refiningPlatform === 'instagram'}
                onToast={showToast}
              />
            </div>
          </section>
        ) : null}
      </main>

      {/* Visual Configuration Modal */}
      {activeVisualModal && campaign && (
        <VisualConfigModal
          isOpen={Boolean(activeVisualModal)}
          onClose={() => setActiveVisualModal(null)}
          platform={activeVisualModal.platform}
          visualConfig={campaign.visuals[activeVisualModal.platform]}
          onRegenerate={handleRegenerateVisual}
          isGenerating={isVisualGenerating}
        />
      )}

      {/* Strategic Audit Modal (gemini-4-argon) */}
      <StrategicAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        audit={campaign?.audit || null}
        isLoading={isAuditing}
        onRunAudit={handleRunAudit}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
