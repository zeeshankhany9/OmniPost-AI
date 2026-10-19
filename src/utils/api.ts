import {
  AspectRatioType,
  ImageModelType,
  ImageSizeType,
  PlatformType,
  StrategicAuditData,
  ToneType,
} from '../types';

export async function apiGenerateCampaign(
  idea: string,
  tone: ToneType,
  audience: string,
  extraContext?: string
) {
  const response = await fetch('/api/generate-campaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, tone, audience, extraContext }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to generate campaign' }));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function apiGenerateImage(params: {
  prompt: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  preferredModel: ImageModelType;
  platform: PlatformType | 'generic';
}) {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Image generation failed' }));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function apiStrategicAudit(params: {
  campaignTitle: string;
  linkedinPost: string;
  twitterPost: string;
  instagramPost: string;
  tone: string;
  audience: string;
}): Promise<StrategicAuditData> {
  const response = await fetch('/api/strategic-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Strategic analysis failed' }));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function apiQuickRefine(params: {
  platform: PlatformType;
  text: string;
  action: 'punchy_hook' | 'shorten' | 'flip_tone' | 'boost_engagement' | 'custom';
  tone?: string;
  customInstruction?: string;
}) {
  const response = await fetch('/api/quick-refine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Quick refinement failed' }));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}
