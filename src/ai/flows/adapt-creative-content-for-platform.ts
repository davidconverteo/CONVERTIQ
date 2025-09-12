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
  creativeContent: z.string().describe('The original creative content to adapt.'),
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
  adaptedContent: z.string().describe('The adapted creative content optimized for the target platform.'),
});
export type AdaptCreativeContentForPlatformOutput = z.infer<typeof AdaptCreativeContentForPlatformOutputSchema>;

export async function adaptCreativeContentForPlatform(input: AdaptCreativeContentForPlatformInput): Promise<AdaptCreativeContentForPlatformOutput> {
  return adaptCreativeContentForPlatformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptCreativeContentForPlatformPrompt',
  input: {schema: AdaptCreativeContentForPlatformInputSchema},
  output: {schema: AdaptCreativeContentForPlatformOutputSchema},
  prompt: `You are an AI expert in marketing and advertising.
Your task is to adapt the given creative content for a specific activation platform, ensuring it adheres to the platform's specifications and best practices. Include the provided logo in the generated creative content.

Original Creative Content: {{{creativeContent}}}
Target Platform: {{{targetPlatform}}}
Logo: {{media url=logoDataUri}}
Output Format: {{{outputFormat}}}

Please provide the adapted creative content optimized for the specified platform:

Adapted Creative Content:`, // Added a colon at the end of the prompt
});

const adaptCreativeContentForPlatformFlow = ai.defineFlow(
  {
    name: 'adaptCreativeContentForPlatformFlow',
    inputSchema: AdaptCreativeContentForPlatformInputSchema,
    outputSchema: AdaptCreativeContentForPlatformOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
