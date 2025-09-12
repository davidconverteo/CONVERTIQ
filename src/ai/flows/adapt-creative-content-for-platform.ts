
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
  targetPlatform: z.string().describe('The target activation platform (e.g., "Post Instagram (1080x1080)", "Story Facebook (1080x1920)", "Bannière Web (728x90)").'),
  logoDataUri: z
    .string()
    .optional()
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


const adaptCreativeContentForPlatformFlow = ai.defineFlow(
  {
    name: 'adaptCreativeContentForPlatformFlow',
    inputSchema: AdaptCreativeContentForPlatformInputSchema,
    outputSchema: AdaptCreativeContentForPlatformOutputSchema,
  },
  async (input) => {
    // Extract dimensions from the platform string, e.g., "Post Instagram (1080x1080)"
    const dimensionRegex = /(\d{2,})x(\d{2,})/;
    const match = input.targetPlatform.match(dimensionRegex);
    let dimensionInstruction = `Adapt this image for the target platform: ${input.targetPlatform}.`;
    
    if (match && match[1] && match[2]) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);
        const orientation = width > height ? "paysage" : width < height ? "portrait" : "carré";
        dimensionInstruction = `Crucially, you MUST regenerate and crop the provided image to a strict ${width}x${height} pixel aspect ratio (${orientation}). Do not distort the image, crop it intelligently. The output must have these exact dimensions.`;
    }

    // Build the prompt for the image generation model.
    const imagePromptParts: (object)[] = [
      { text: dimensionInstruction },
      { media: { url: input.baseImage } },
    ];
    
    if (input.logoDataUri) {
        (imagePromptParts[0] as {text: string}).text += ` Intelligently incorporate the provided logo onto the image, ensuring it is visible but not obtrusive.`;
        imagePromptParts.push({ media: { url: input.logoDataUri } });
    }

    if (input.brandGuidelinesDataUri) {
      (imagePromptParts[0] as {text: string}).text += ` If brand guidelines are provided, use them to influence the style, color palette, and typography.`;
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
    
    return {
      adaptedImageUrl: media.url,
      adaptedText: "", // Text generation is removed as per user request.
    };
  }
);


export async function adaptCreativeContentForPlatform(input: AdaptCreativeContentForPlatformInput): Promise<AdaptCreativeContentForPlatformOutput> {
  return adaptCreativeContentForPlatformFlow(input);
}
