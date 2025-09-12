'use server';
/**
 * @fileOverview Generates a marketing image from a text prompt.
 *
 * - generateMarketingImage - A function that handles the image generation process.
 * - GenerateMarketingImageInput - The input type for the generateMarketingImage function.
 * - GenerateMarketingImageOutput - The return type for the generateMarketingImage function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingImageInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired marketing image.'),
});
export type GenerateMarketingImageInput = z.infer<typeof GenerateMarketingImageInputSchema>;

const GenerateMarketingImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated marketing image.'),
});
export type GenerateMarketingImageOutput = z.infer<typeof GenerateMarketingImageOutputSchema>;

export async function generateMarketingImage(
  input: GenerateMarketingImageInput
): Promise<GenerateMarketingImageOutput> {
  return generateMarketingImageFlow(input);
}

const generateMarketingImageFlow = ai.defineFlow(
  {
    name: 'generateMarketingImageFlow',
    inputSchema: GenerateMarketingImageInputSchema,
    outputSchema: GenerateMarketingImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {text: 'Generate an image of a cat'},
        {text: input.prompt},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No media was returned from image generation.');
    }
    return {imageUrl: media.url!};
  }
);
