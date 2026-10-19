import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support larger payload for images
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Server-side Gemini initialization as mandated by guidelines
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Gemini API calls will fail.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * 1. SIMULTANEOUS CAMPAIGN GENERATOR
 * Uses gemini-3.8-flash for general multi-platform drafting
 */
app.post('/api/generate-campaign', async (req, res) => {
  try {
    const { idea, tone = 'professional', audience = 'general', extraContext = '' } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide an idea to generate social content.' });
    }

    const systemPrompt = `You are a world-class cross-platform social media director and creative strategist.
Your task is to take a core idea and simultaneously create 3 completely distinct, platform-native posts tailored to the optimal cultural language, mechanics, and formats of:
1. LinkedIn (Long-form thought leadership, strategic career/industry insight, structured spacing, actionable takeaway, 3-5 targeted hashtags).
2. Twitter/X (Short, razor-sharp, punchy, maximum thumb-stopping power, strictly under 280 characters for the main post, plus a 2-tweet follow-up thread, 1-2 high-impact tags).
3. Instagram (Visual-first caption, irresistible opening line, aesthetic formatting with clean linebreaks, high-engagement question prompt, and 15-20 curated hashtags divided by niche/trend).

Desired Tone: "${tone}" (ensure this tone is infused authentically into each platform's distinct voice).
Target Audience: "${audience}".
Additional Context: "${extraContext}".

For each platform, you MUST ALSO write a detailed, visually descriptive Image Generation Prompt specifically tailored to the platform's visual culture and optimal layout:
- LinkedIn: Clean editorial, modern minimalist workplace, isometric concept art, or thought-provoking infographic aesthetic (optimal ratio: 16:9).
- Twitter/X: High-contrast, vibrant, punchy graphic, futuristic 3D render, or striking split-composition (optimal ratio: 16:9).
- Instagram: Rich lifestyle photography, editorial magazine layout, mood lighting, striking vibrant aesthetic (optimal ratio: 1:1).

Return valid structured JSON matching the provided schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Core Idea: "${idea}"\nTone: ${tone}\nAudience: ${audience}\nContext: ${extraContext}` }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            campaignTitle: { type: Type.STRING, description: 'Snappy title for this campaign concept' },
            coreMessage: { type: Type.STRING, description: '1-sentence core value hook' },
            linkedin: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING, description: 'Catchy LinkedIn header' },
                content: { type: Type.STRING, description: 'Full long-form formatted post with line breaks' },
                hook: { type: Type.STRING, description: 'First 2 punchy lines before the see-more fold' },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                callToAction: { type: Type.STRING },
                estimatedReadSeconds: { type: Type.INTEGER },
                imagePrompt: { type: Type.STRING, description: 'Tailored prompt to generate a 16:9 LinkedIn visual' },
                optimalAspectRatio: { type: Type.STRING, description: 'Recommended aspect ratio, e.g. 16:9' },
              },
              required: ['headline', 'content', 'hook', 'hashtags', 'callToAction', 'imagePrompt', 'optimalAspectRatio'],
            },
            twitter: {
              type: Type.OBJECT,
              properties: {
                mainTweet: { type: Type.STRING, description: 'Punchy main tweet STRICTLY under 280 characters' },
                characterCount: { type: Type.INTEGER },
                threadTweets: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 follow-up tweets for thread' },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                imagePrompt: { type: Type.STRING, description: 'Tailored prompt to generate a 16:9 Twitter visual' },
                optimalAspectRatio: { type: Type.STRING, description: 'Recommended aspect ratio, e.g. 16:9' },
              },
              required: ['mainTweet', 'characterCount', 'threadTweets', 'hashtags', 'imagePrompt', 'optimalAspectRatio'],
            },
            instagram: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING, description: 'Aesthetic caption with visual spacing and emojis' },
                hookLine: { type: Type.STRING, description: 'The first line that stops the scroll' },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '15-20 relevant hashtags' },
                carouselPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-4 slide text snippets' },
                engagementPrompt: { type: Type.STRING, description: 'Interactive question for the comment section' },
                imagePrompt: { type: Type.STRING, description: 'Tailored prompt to generate a 1:1 Instagram visual' },
                optimalAspectRatio: { type: Type.STRING, description: 'Recommended aspect ratio, e.g. 1:1' },
              },
              required: ['caption', 'hookLine', 'hashtags', 'carouselPoints', 'engagementPrompt', 'imagePrompt', 'optimalAspectRatio'],
            },
          },
          required: ['campaignTitle', 'coreMessage', 'linkedin', 'twitter', 'instagram'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Model did not return text content');
    }

    const campaignData = JSON.parse(text);
    return res.json(campaignData);
  } catch (error: any) {
    console.error('Error generating campaign:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate campaign',
      details: error?.toString(),
    });
  }
});

/**
 * 2. IMAGE GENERATION ENDPOINT
 * Uses gemini-3-pro-image-preview (studio quality) with affordances for:
 * - Image Size: 1K, 2K, 4K
 * - Aspect Ratio: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
 * Gracefully falls back to gemini-nano-banana-2.1 or gemini-3.1-flash-lite-image if needed.
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = '1:1',
      imageSize = '1K',
      preferredModel = 'gemini-3-pro-image-preview',
      platform = 'generic',
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    const validAspectRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
    const chosenAspect = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    // Model hierarchy: start with user/preferred model, with clean cascade fallback
    const candidateModels = [
      preferredModel,
      preferredModel === 'gemini-3-pro-image-preview' ? 'gemini-nano-banana-2.1' : 'gemini-3-pro-image-preview',
      'gemini-3.1-flash-lite-image',
    ].filter((v, i, a) => a.indexOf(v) === i);

    let lastError: any = null;
    let generatedImage: { url: string; mimeType: string; modelUsed: string } | null = null;

    for (const modelToTry of candidateModels) {
      try {
        console.log(`Generating image for [${platform}] using model: ${modelToTry}, aspect: ${chosenAspect}, size: ${chosenSize}`);

        // Build config based on model capabilities
        const config: any = {
          imageConfig: {
            aspectRatio: chosenAspect,
          },
        };

        // gemini-3-pro-image-preview and gemini-nano-banana-2.1 support imageSize (1K, 2K, 4K)
        if (modelToTry !== 'gemini-3.1-flash-lite-image') {
          config.imageConfig.imageSize = chosenSize;
        }

        const response = await ai.models.generateContent({
          model: modelToTry,
          contents: {
            parts: [{ text: prompt }],
          },
          config,
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              generatedImage = {
                url: `data:${mime};base64,${part.inlineData.data}`,
                mimeType: mime,
                modelUsed: modelToTry,
              };
              break;
            }
          }
        }

        if (generatedImage) {
          break; // successfully retrieved image
        }
      } catch (err: any) {
        console.warn(`Model ${modelToTry} attempt failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!generatedImage) {
      throw lastError || new Error('Failed to generate image from model parts.');
    }

    return res.json({
      success: true,
      imageUrl: generatedImage.url,
      modelUsed: generatedImage.modelUsed,
      aspectRatio: chosenAspect,
      imageSize: chosenSize,
      platform,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-image:', error);
    return res.status(500).json({
      error: error?.message || 'Image generation failed',
      details: error?.toString(),
    });
  }
});

/**
 * 3. COMPLEX TASK: STRATEGIC AUDIT & RESONANCE ANALYSIS
 * Uses gemini-4-argon for deep cognitive analysis, audience psychology, and multi-platform synergy
 */
app.post('/api/strategic-analysis', async (req, res) => {
  try {
    const { campaignTitle, linkedinPost, twitterPost, instagramPost, tone, audience } = req.body;

    const analysisPrompt = `You are a Chief Marketing Officer and Viral Growth Algorithm Specialist.
Analyze this cross-platform social media campaign concept across LinkedIn, Twitter/X, and Instagram.

Campaign: "${campaignTitle}"
Intended Tone: "${tone}"
Target Audience: "${audience}"

LinkedIn Content:
${linkedinPost}

Twitter/X Content:
${twitterPost}

Instagram Content:
${instagramPost}

Perform a rigorous, high-level strategic audit using deep reasoning:
1. Overall Campaign Resonance Score (1-100)
2. Platform-by-Platform Metric Breakdown:
   - LinkedIn: Hook Strength (1-100), Authority/B2B Fit (1-100), Readability Grade (e.g. 8th grade), Key Psychological Trigger, 1 high-leverage improvement tip.
   - Twitter/X: Virality Index (1-100), Scroll-Stopping Rating (1-100), Character Efficiency, Retweet Propensity, 1 punch-up recommendation.
   - Instagram: Visual-Caption Synergy (1-100), Comment-Bait Rating (1-100), Hashtag Spread Quality, Community Engagement Driver, 1 enhancement suggestion.
3. Psychological Drivers Identified (list 3-4 specific cognitive hooks like Curiosity Gap, Loss Aversion, Identity Affirmation, Social Proof).
4. Multi-Platform Funnel Strategy: How to stagger the posts across the week for maximum compounding reach.

Respond strictly in valid JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallResonanceScore: { type: Type.INTEGER },
            summaryVerdict: { type: Type.STRING },
            psychologicalDrivers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  driver: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['driver', 'description'],
              },
            },
            linkedinAudit: {
              type: Type.OBJECT,
              properties: {
                authorityScore: { type: Type.INTEGER },
                hookStrength: { type: Type.INTEGER },
                readabilityGrade: { type: Type.STRING },
                primaryTrigger: { type: Type.STRING },
                proTip: { type: Type.STRING },
              },
              required: ['authorityScore', 'hookStrength', 'readabilityGrade', 'primaryTrigger', 'proTip'],
            },
            twitterAudit: {
              type: Type.OBJECT,
              properties: {
                viralityScore: { type: Type.INTEGER },
                scrollStopRating: { type: Type.INTEGER },
                retweetPropensity: { type: Type.STRING },
                proTip: { type: Type.STRING },
              },
              required: ['viralityScore', 'scrollStopRating', 'retweetPropensity', 'proTip'],
            },
            instagramAudit: {
              type: Type.OBJECT,
              properties: {
                engagementScore: { type: Type.INTEGER },
                captionSynergy: { type: Type.INTEGER },
                commentDriver: { type: Type.STRING },
                proTip: { type: Type.STRING },
              },
              required: ['engagementScore', 'captionSynergy', 'commentDriver', 'proTip'],
            },
            crossPlatformRollout: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  action: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                },
                required: ['day', 'platform', 'action', 'rationale'],
              },
            },
          },
          required: [
            'overallResonanceScore',
            'summaryVerdict',
            'psychologicalDrivers',
            'linkedinAudit',
            'twitterAudit',
            'instagramAudit',
            'crossPlatformRollout',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('gemini-4-argon returned no text');
    }

    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error in /api/strategic-analysis:', error);
    return res.status(500).json({
      error: error?.message || 'Strategic analysis failed',
      details: error?.toString(),
    });
  }
});

/**
 * 4. FAST TASKS: QUICK HOOK RE-WRITER & TONE POLISH
 * Uses gemini-3.1-flash-lite for ultra-responsive, instant micro-edits
 */
app.post('/api/quick-refine', async (req, res) => {
  try {
    const { platform, text, action, tone, customInstruction } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }

    let instruction = '';
    switch (action) {
      case 'punchy_hook':
        instruction = `Rewrite the opening hook of this ${platform} post to make it 3x more thumb-stopping, curious, and punchy. Keep the rest of the post intact.`;
        break;
      case 'shorten':
        instruction = `Condense this ${platform} post by 30-40% so it delivers the maximum impact in fewer words. Strictly stay under 280 characters if platform is Twitter/X.`;
        break;
      case 'flip_tone':
        instruction = `Rewrite this ${platform} post to adopt a distinctly "${tone || 'witty'}" tone while keeping the core message and platform best practices intact.`;
        break;
      case 'boost_engagement':
        instruction = `Add high-converting engagement elements (e.g. compelling question, controversial perspective, or strong call to reply) tailored for ${platform}.`;
        break;
      case 'custom':
        instruction = `Apply this user instruction to the ${platform} post: "${customInstruction}".`;
        break;
      default:
        instruction = `Refine and polish this ${platform} post for maximum readability and impact.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${instruction}\n\nOriginal Post:\n"""\n${text}\n"""\n\nReturn ONLY the revised post text without markdown quotes or conversational prefixes.`,
            },
          ],
        },
      ],
      config: {
        temperature: 0.7,
      },
    });

    const refinedText = response.text?.trim() || text;
    return res.json({ refinedText, action });
  } catch (error: any) {
    console.error('Error in /api/quick-refine:', error);
    return res.status(500).json({
      error: error?.message || 'Quick refinement failed',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Mount Vite or static server
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
