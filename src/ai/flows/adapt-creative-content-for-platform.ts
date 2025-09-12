
'use server';
/**
 * @fileOverview Adapts a creative image for a specific marketing platform.
 *
 * - adaptCreativeContentForPlatform - A function that adapts creative content for a given platform.
 * - AdaptCreativeContentForPlatformInput - The input type for the adaptCreativeContentForPlatform function.
 * - AdaptCreativeContentForPlatformOutput - The return type for the adaptCreativeContentForPlatform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptCreativeContentForPlatformInputSchema = z.object({
  baseImage: z
    .string()
    .describe(
      "The base creative image to adapt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetPlatform: z.string().describe('The target activation platform (e.g., "Post Instagram (Carré)", "Story Facebook (Vertical)", "Bannière Web (Large)").'),
  logoDataUri: z
    .string()
    .describe(
      "The brand logo to be added to the creative content, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  brandGuidelinesDataUri: z
    .string()
    .optional()
    .describe(
      "An image or PDF of the brand guidelines (colors, fonts, etc.) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AdaptCreativeContentForPlatformInput = z.infer<typeof AdaptCreativeContentForPlatformInputSchema>;

const AdaptCreativeContentForPlatformOutputSchema = z.object({
  adaptedImageUrl: z.string().describe('The URL of the adapted image, as a data URI.'),
  adaptedText: z.string().describe('A short, engaging marketing text, optimized for the target platform, to accompany the visual.'),
});
export type AdaptCreativeContentForPlatformOutput = z.infer<typeof AdaptCreativeContentForPlatformOutputSchema>;


const adaptationPrompt = ai.definePrompt({
    name: 'adaptationPrompt',
    input: { schema: z.object({ platform: z.string() }) },
    output: { schema: z.object({ text: z.string() }) },
    prompt: `You are an expert social media marketer.
    Generate a short, engaging marketing text to accompany the provided visual.
    The post must be optimized for the specific target platform, adhering to its character limits and best practices.
    The output must be ONLY the text for the post, nothing else.
    
    Target Platform: {{{platform}}}
    `,
});

const getAspectRatio = (platform: string) => {
    if (platform.includes('Carré')) return '1:1';
    if (platform.includes('Vertical')) return '9:16';
    if (platform.includes('Large')) return '16:9';
    return '1:1';
};

const adaptCreativeContentForPlatformFlow = ai.defineFlow(
  {
    name: 'adaptCreativeContentForPlatformFlow',
    inputSchema: AdaptCreativeContentForPlatformInputSchema,
    outputSchema: AdaptCreativeContentForPlatformOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the adapted marketing text in parallel.
    const textGenerationPromise = adaptationPrompt({ platform: input.targetPlatform });

    // Step 2: Generate the adapted image.
    const imagePromptParts: (object)[] = [
      { text: `Adapt this image for ${input.targetPlatform}. Recrop it to a ${getAspectRatio(input.targetPlatform)} aspect ratio. Intelligently incorporate the provided logo onto the image, ensuring it is visible but not obtrusive. If brand guidelines are provided, use them to influence the style, color palette, and typography. ` },
      { media: { url: input.baseImage } },
      { media: { url: input.logoDataUri } },
    ];
    if (input.brandGuidelinesDataUri) {
      imagePromptParts.push({ media: { url: input.brandGuidelinesDataUri } });
    }

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: imagePromptParts,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image adaptation failed to return an image.');
    }

    // Step 3: Wait for the text generation and combine results.
    const textResponse = await textGenerationPromise;
    
    return {
      adaptedImageUrl: media.url,
      adaptedText: textResponse.output?.text || '',
    };
  }
);


export async function adaptCreativeContentForPlatform(input: AdaptCreativeContentForPlatformInput): Promise<AdaptCreativeContentForPlatformOutput> {
  return adaptCreativeContentForPlatformFlow(input);
}

    