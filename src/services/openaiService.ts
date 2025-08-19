import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});

export interface CopyGenerationRequest {
  topic: string;
  platforms: string[];
  tone: string;
  variationCount?: number;
}

export interface GeneratedCopy {
  platform: string;
  variations: string[];
}

export interface ImageGenerationRequest {
  prompt: string;
  style: string;
  aspectRatio: string;
  count: number;
}

export interface GeneratedImage {
  url: string;
  index: number;
}

// Platform-specific content guidelines
const platformGuidelines = {
  instagram: {
    maxLength: 2200,
    characteristics: "Visual-focused, hashtag-friendly, engaging captions, story-driven",
    format: "Short paragraphs, emojis, call-to-action"
  },
  facebook: {
    maxLength: 500,
    characteristics: "Community-focused, conversational, shareable content",
    format: "Engaging questions, relatable content, clear messaging"
  },
  linkedin: {
    maxLength: 1300,
    characteristics: "Professional, industry insights, thought leadership",
    format: "Professional tone, industry terminology, networking focus"
  },
  twitter: {
    maxLength: 280,
    characteristics: "Concise, trending topics, real-time engagement",
    format: "Brief, punchy, hashtag integration, thread-worthy"
  },
  youtube: {
    maxLength: 5000,
    characteristics: "Video-focused, descriptive, SEO-optimized",
    format: "Detailed descriptions, timestamps, call-to-subscribe"
  }
};

// Tone definitions
const toneDefinitions = {
  professional: "formal, authoritative, industry-focused, credible",
  friendly: "warm, approachable, conversational, welcoming",
  funny: "humorous, witty, entertaining, light-hearted",
  persuasive: "compelling, action-oriented, convincing, motivational",
  educational: "informative, clear, instructional, helpful",
  inspiring: "motivational, uplifting, empowering, aspirational"
};

export async function generateCopy(request: CopyGenerationRequest): Promise<Record<string, string[]>> {
  try {
    const results: Record<string, string[]> = {};

    // Generate content for each platform
    for (const platform of request.platforms) {
      const platformInfo = platformGuidelines[platform as keyof typeof platformGuidelines];
      const toneDescription = toneDefinitions[request.tone as keyof typeof toneDefinitions];
      const variationCount = request.variationCount || 3;

      const prompt = `You are an expert copywriter and content creator specializing in social media marketing. Your task is to create engaging, platform-specific content that drives engagement and achieves marketing objectives.

CONTENT BRIEF:
- Topic/Theme: ${request.topic}
- Platform: ${platform.toUpperCase()}
- Tone: ${toneDescription}
- Target: Generate ${variationCount} unique variations

PLATFORM SPECIFICATIONS for ${platform.toUpperCase()}:
- Character limit: ${platformInfo.maxLength} characters
- Platform characteristics: ${platformInfo.characteristics}
- Content format: ${platformInfo.format}

REQUIREMENTS:
1. Create ${variationCount} distinct variations of content for the same topic
2. Each variation should have a different approach or angle
3. Optimize for ${platform} audience behavior and engagement patterns
4. Include relevant hashtags where appropriate (especially for Instagram and Twitter)
5. Ensure content is ${toneDescription} in tone
6. Make content actionable and engaging
7. Consider platform-specific features (Stories, Reels, etc. for Instagram; threads for Twitter; etc.)
8. Write in the same language as the topic provided by the user

OUTPUT FORMAT:
Provide exactly ${variationCount} variations, each as a complete, ready-to-post piece of content.

CRITICAL: You must separate each variation clearly. Use this exact format:

${Array.from({ length: variationCount }, (_, i) => `VARIATION ${i + 1}:
[Complete ${i === 0 ? 'first' : i === 1 ? 'second' : 'third'} post content here - no additional text]`).join('\n\n')}

Do NOT include any other text outside of the variations. Each variation should be a standalone, complete post.

Generate the content now:`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: import.meta.env.VITE_COPY_GENERATION_SYSTEM || "You are an expert copywriter and social media content creator. You create engaging, platform-optimized content that drives engagement and achieves marketing objectives. Always respond in the same language as the user's input."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      });

      const content = completion.choices[0]?.message?.content || '';

      // Split the content into variations
      let variations: string[] = [];

      // Try different splitting patterns
      const patterns = [
        /VARIATION \d+:/i,
        /---VARIATION \d+---/i,
        /\d+\.\s*\*\*/,
        /\*\*\d+\./
      ];

      for (const pattern of patterns) {
        const split = content.split(pattern);
        if (split.length > 1) {
          variations = split
            .slice(1) // Remove the first empty element
            .map(variation => variation.trim())
            .filter(variation => variation.length > 0)
            .slice(0, variationCount);
          break;
        }
      }

      // If no pattern worked, try to extract content manually
      if (variations.length === 0) {
        // Look for numbered content or bullet points
        const lines = content.split('\n');
        let currentVariation = '';
        let foundVariations = 0;

        for (const line of lines) {
          if (line.match(/^\d+[\.\)]/)) {
            if (currentVariation.trim()) {
              variations.push(currentVariation.trim());
              foundVariations++;
            }
            currentVariation = line;
          } else {
            currentVariation += '\n' + line;
          }

          if (foundVariations >= variationCount) break;
        }

        if (currentVariation.trim()) {
          variations.push(currentVariation.trim());
        }
      }

      // If still no variations, use the whole content as one variation
      if (variations.length === 0) {
        variations = [content.trim()];
      }

      // Ensure we have exactly 3 variations
      variations = variations.slice(0, 3);
      while (variations.length < 3) {
        variations.push(variations[0] || `Conteúdo gerado para ${platform} sobre ${request.topic}`);
      }

      results[platform] = variations;
    }

    return results;
  } catch (error) {
    console.error('Error generating copy:', error);
    throw new Error('Failed to generate copy. Please check your API key and try again.');
  }
}

// Function to regenerate a specific variation
export async function regenerateVariation(
  topic: string, 
  platform: string, 
  tone: string, 
  currentVariation: string
): Promise<string> {
  try {
    const platformInfo = platformGuidelines[platform as keyof typeof platformGuidelines];
    const toneDescription = toneDefinitions[tone as keyof typeof toneDefinitions];

    const prompt = `You are an expert copywriter. Create a NEW variation of content that is different from the current one.

CONTENT BRIEF:
- Topic: ${topic}
- Platform: ${platform.toUpperCase()}
- Tone: ${toneDescription}
- Current variation to improve/change: "${currentVariation}"

PLATFORM SPECIFICATIONS:
- Character limit: ${platformInfo.maxLength} characters
- Platform characteristics: ${platformInfo.characteristics}
- Content format: ${platformInfo.format}

Create a completely new variation that:
1. Covers the same topic but with a different angle or approach
2. Maintains the ${toneDescription} tone
3. Is optimized for ${platform}
4. Is distinctly different from the current variation
5. Includes appropriate hashtags if relevant
6. Write in the same language as the topic provided

Provide only the new content variation:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: import.meta.env.VITE_COPY_REGENERATION_SYSTEM || "You are an expert copywriter and social media content creator. Always respond in the same language as the user's input."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.9,
    });

    return completion.choices[0]?.message?.content?.trim() || currentVariation;
  } catch (error) {
    console.error('Error regenerating variation:', error);
    throw new Error('Failed to regenerate content. Please try again.');
  }
}

// Function to enhance image generation prompts
export async function enhanceImagePrompt(originalPrompt: string): Promise<string> {
  try {
    const systemPrompt = import.meta.env.VITE_IMAGE_ENHANCE_PROMPT || `Você é um especialista em criação de prompts para geração de imagens com IA. Sua tarefa é reescrever prompts para torná-los mais detalhados, vívidos e descritivos, resultando em imagens de maior qualidade.

INSTRUÇÕES:
1. Mantenha a ideia central do prompt original
2. Adicione detalhes sobre iluminação (ex: "luz dourada", "iluminação dramática", "luz suave")
3. Inclua detalhes sobre ambiente e composição (ex: "fundo desfocado", "composição centralizada")
4. Adicione qualificadores de qualidade (ex: "alta resolução", "detalhes nítidos", "qualidade profissional")
5. Mantenha o idioma original do prompt
6. Seja específico mas não excessivamente longo
7. Foque em elementos visuais que melhorem a qualidade da imagem

EXEMPLO:
Original: "Um gato laranja"
Melhorado: "Um gato laranja fofo com pelos macios e brilhantes, sentado em uma superfície clara, iluminação natural suave, fundo desfocado, fotografia profissional, alta resolução, detalhes nítidos"

Reescreva o seguinte prompt para gerar uma imagem melhor:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: originalPrompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || originalPrompt;
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw new Error('Failed to enhance prompt. Please try again.');
  }
}

// Function to convert aspect ratio to DALL-E 3 size format
function getImageSize(aspectRatio: string): string {
  const sizeMap: Record<string, string> = {
    "1:1": "1024x1024",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "4:3": "1792x1024",
    "3:4": "1024x1792"
  };
  return sizeMap[aspectRatio] || "1024x1024";
}

// Function to build final prompt with style
function buildFinalPrompt(prompt: string, style: string): string {
  if (!style) return prompt;

  const styleMap: Record<string, string> = {
    "realistic": "fotorrealista",
    "artistic": "arte digital",
    "cartoon": "estilo cartoon",
    "minimalist": "estilo minimalista",
    "professional": "fotografia profissional",
    "vintage": "estilo vintage"
  };

  const styleText = styleMap[style] || style;
  return `${prompt}, no estilo de ${styleText}`;
}

// Function to generate images using DALL-E 3
export async function generateImages(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
  try {
    const size = getImageSize(request.aspectRatio);
    const finalPrompt = buildFinalPrompt(request.prompt, request.style);

    // DALL-E 3 doesn't support n > 1, so we need to make parallel calls
    const imagePromises = Array.from({ length: request.count }, async (_, index) => {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: size as "1024x1024" | "1024x1792" | "1792x1024",
        quality: "standard",
        style: "natural"
      });

      return {
        url: response.data[0].url || '',
        index: index
      };
    });

    // Wait for all images to be generated
    const results = await Promise.all(imagePromises);
    return results.filter(result => result.url); // Filter out any failed generations

  } catch (error) {
    console.error('Error generating images:', error);
    throw new Error('Failed to generate images. Please check your API key and try again.');
  }
}
