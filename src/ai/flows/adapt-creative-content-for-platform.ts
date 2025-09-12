
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


/**
 * Generates an SVG shape mask as a data URI based on target dimensions.
 * @param platform The target platform string, e.g., "Post Instagram (1080x1080)".
 * @returns A data URI for the SVG mask, or null if no dimensions are found.
 */
const generateShapeMask = (platform: string): string | null => {
    const dimensionRegex = /(\d{2,})x(\d{2,})/;
    const match = platform.match(dimensionRegex);

    if (match && match[1] && match[2]) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);

        // Create a simple SVG rectangle with the target dimensions.
        // Using a viewBox allows us to define the aspect ratio clearly.
        const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="white"/></svg>`;
        const base64Svg = Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64Svg}`;
    }
    return null;
};


const adaptCreativeContentForPlatformFlow = ai.defineFlow(
  {
    name: 'adaptCreativeContentForPlatformFlow',
    inputSchema: AdaptCreativeContentForPlatformInputSchema,
    outputSchema: AdaptCreativeContentForPlatformOutputSchema,
  },
  async (input) => {
    // Generate the shape mask based on the target platform.
    const shapeMaskDataUri = generateShapeMask(input.targetPlatform);

    // Build the prompt for the image generation model.
    const imagePromptParts: (object)[] = [
      { text: `Adapt this image for the target platform: ${input.targetPlatform}. Use the provided image and shape mask to influence the output's aspect ratio.` },
      { media: { url: input.baseImage } },
    ];

    if (shapeMaskDataUri) {
        imagePromptParts.push({ media: { url: shapeMaskDataUri } });
    }
    
    if (input.logoDataUri) {
        imagePromptParts[0].text += ` Intelligently incorporate the provided logo onto the image, ensuring it is visible but not obtrusive.`
        imagePromptParts.push({ media: { url: input.logoDataUri } });
    }

    if (input.brandGuidelinesDataUri) {
      imagePromptParts[0].text += ` If brand guidelines are provided, use them to influence the style, color palette, and typography.`
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
