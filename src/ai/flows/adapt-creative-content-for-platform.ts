
'use server';
/**
 * @fileOverview Adapts a creative image for a specific marketing platform using outpainting.
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
    
    let textPrompt = `Expand this image to perfectly fit the target format: ${input.targetPlatform}. Generate new, coherent content at the edges to fill the space. Do not crop, distort, or letterbox the original image. Maintain the original style and quality.`;
    
    const imagePromptParts: (object)[] = [
      { text: textPrompt },
      { media: { url: input.baseImage } },
    ];
    
    if (input.logoDataUri) {
        textPrompt += ` Intelligently incorporate the provided logo onto the image, ensuring it is visible but not obtrusive.`;
        (imagePromptParts[0] as {text: string}).text = textPrompt;
        imagePromptParts.push({ media: { url: input.logoDataUri } });
    }

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: imagePromptParts,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image adaptation failed to return an image.');
    }
    
    return {
      adaptedImageUrl: media.url,
      adaptedText: "Déclinaison générée avec succès.",
    };
  }
);


export async function adaptCreativeContentForPlatform(input: AdaptCreativeContentForPlatformInput): Promise<AdaptCreativeContentForPlatformOutput> {
  return adaptCreativeContentForPlatformFlow(input);
}
