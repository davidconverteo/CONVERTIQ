'use server';
/**
 * @fileOverview Adapts creative content for a specific activation platform.
 *
 * - adaptCreativeContentForPlatform - A function that adapts creative content for a given platform.
 * - AdaptCreativeContentForPlatformInput - The input type for the adaptCreativeContentForPlatform function.
 * - AdaptCreativeContentForPlatformOutput - The return type for the adaptCreativeContentForPlatform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptCreativeContentForPlatformInputSchema = z.object({
  creativeContent: z
    .string()
    .describe(
      "The generated creative image to adapt, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  targetPlatform: z.string().describe('The target activation platform (e.g., Facebook, Instagram, Google Ads).'),
  logoDataUri: z
    .string()
    .describe(
      "A logo to be added to the creative content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  outputFormat: z.enum(["PNG", "JPEG", "SVG"]).describe("The desired output format of the adapted content."),
});
export type AdaptCreativeContentForPlatformInput = z.infer<typeof AdaptCreativeContentForPlatformInputSchema>;

const AdaptCreativeContentForPlatformOutputSchema = z.object({
  adaptedContent: z.string().describe('A short, engaging marketing text, optimized for the target platform, to accompany the visual.'),
});
export type AdaptCreativeContentForPlatformOutput = z.infer<typeof AdaptCreativeContentForPlatformOutputSchema>;

export async function adaptCreativeContentForPlatform(input: AdaptCreativeContentForPlatformInput): Promise<AdaptCreativeContentForPlatformOutput> {
  return adaptCreativeContentForPlatformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptCreativeContentForPlatformPrompt',
  input: {schema: AdaptCreativeContentForPlatformInputSchema},
  output: {schema: AdaptCreativeContentForPlatformOutputSchema},
  prompt: `You are an AI expert in social media marketing and advertising.
Your task is to create a short, engaging marketing post to accompany a creative image. The post must be optimized for the specific target platform, adhering to its character limits and best practices.

**Instructions:**
1. Analyze the provided creative image.
2. Incorporate the branding from the provided logo.
3. Write a compelling marketing text (e.g., a post, a tweet, an ad copy) that is perfectly suited for the specified target platform.
4. The output must be only the text for the post, nothing else.

**Inputs:**
- **Target Platform:** {{{targetPlatform}}}
- **Creative Image:** {{media url=creativeContent}}
- **Brand Logo:** {{media url=logoDataUri}}

Generate the marketing text below.
`,
});

const adaptCreativeContentForPlatformFlow = ai.defineFlow(
  {
    name: 'adaptCreativeContentForPlatformFlow',
    inputSchema: AdaptCreativeContentForPlatformInputSchema,
    outputSchema: AdaptCreativeContentForPlatformOutputSchema,
  },
  async input => {
    // Note: The 'outputFormat' is available in 'input.outputFormat' but the prompt doesn't explicitly use it
    // to generate a different image format. The current implementation focuses on generating optimized *text*.
    // To generate a different image format, we would need another ai.generate call with an image model.
    const {output} = await prompt(input);
    return output!;
  }
);
