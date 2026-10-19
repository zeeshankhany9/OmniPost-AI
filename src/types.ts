export type PlatformType = 'linkedin' | 'twitter' | 'instagram';

export type AspectRatioType = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type ImageSizeType = '1K' | '2K' | '4K';

export type ImageModelType = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type ToneType = 'professional' | 'witty' | 'urgent' | 'inspirational' | 'storytelling' | 'provocative';

export interface PlatformVisualConfig {
  prompt: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  model: ImageModelType;
  imageUrl?: string;
  isGenerating?: boolean;
  error?: string;
}

export interface LinkedInPostData {
  headline: string;
  hook: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  estimatedReadSeconds: number;
  imagePrompt: string;
  optimalAspectRatio: AspectRatioType;
}

export interface TwitterPostData {
  mainTweet: string;
  characterCount: number;
  threadTweets: string[];
  hashtags: string[];
  imagePrompt: string;
  optimalAspectRatio: AspectRatioType;
}

export interface InstagramPostData {
  hookLine: string;
  caption: string;
  hashtags: string[];
  carouselPoints: string[];
  engagementPrompt: string;
  imagePrompt: string;
  optimalAspectRatio: AspectRatioType;
}

export interface CampaignData {
  id: string;
  createdAt: string;
  idea: string;
  tone: ToneType;
  audience: string;
  campaignTitle: string;
  coreMessage: string;
  linkedin: LinkedInPostData;
  twitter: TwitterPostData;
  instagram: InstagramPostData;
  visuals: {
    linkedin: PlatformVisualConfig;
    twitter: PlatformVisualConfig;
    instagram: PlatformVisualConfig;
  };
  audit?: StrategicAuditData;
}

export interface StrategicAuditData {
  overallResonanceScore: number;
  summaryVerdict: string;
  psychologicalDrivers: Array<{
    driver: string;
    description: string;
  }>;
  linkedinAudit: {
    authorityScore: number;
    hookStrength: number;
    readabilityGrade: string;
    primaryTrigger: string;
    proTip: string;
  };
  twitterAudit: {
    viralityScore: number;
    scrollStopRating: number;
    retweetPropensity: string;
    proTip: string;
  };
  instagramAudit: {
    engagementScore: number;
    captionSynergy: number;
    commentDriver: string;
    proTip: string;
  };
  crossPlatformRollout: Array<{
    day: string;
    platform: string;
    action: string;
    rationale: string;
  }>;
}
