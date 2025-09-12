'use server';
/**
 * @fileOverview A flow that create a text prompt based on the file content.
 *
 * - createPromptFromFileUpload - A function that handles the plant diagnosis process.
 * - CreatePromptFromFileUploadInput - The input type for the createPromptFromFileUpload function.
 * - CreatePromptFromFileUploadOutput - The return type for the createPromptFromFileUpload function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePromptFromFileUploadInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A creative asset file (e.g., logo, reference image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userPrompt: z.string().describe('The user instructions for image generation.'),
});
export type CreatePromptFromFileUploadInput = z.infer<typeof CreatePromptFromFileUploadInputSchema>;

const CreatePromptFromFileUploadOutputSchema = z.object({
  prompt: z.string().describe('The AI-generated text prompt.'),
});
export type CreatePromptFromFileUploadOutput = z.infer<typeof CreatePromptFromFileUploadOutputSchema>;

export async function createPromptFromFileUpload(input: CreatePromptFromFileUploadInput): Promise<CreatePromptFromFileUploadOutput> {
  return createPromptFromFileUploadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPromptFromFileUploadPrompt',
  input: {schema: CreatePromptFromFileUploadInputSchema},
  output: {schema: CreatePromptFromFileUploadOutputSchema},
  prompt: `You are an expert AI prompt engineer. Your task is to generate a highly detailed and effective text prompt for an image generation model (like Imagen).

You will be given user instructions and an optional creative asset (like a reference image or a logo). Your generated prompt should combine the user's intent with a rich, descriptive language that will produce a high-quality, visually appealing marketing image.

User instructions: {{{userPrompt}}}

Inspiration Asset:
{{media url=fileDataUri}}

Based on the provided information, generate a new, detailed text prompt. Describe the scene, the style, the lighting, the composition, and any relevant details from the reference image to guide the image generation AI.`,
});

const createPromptFromFileUploadFlow = ai.defineFlow(
  {
    name: 'createPromptFromFileUploadFlow',
    inputSchema: CreatePromptFromFileUploadInputSchema,
    outputSchema: CreatePromptFromFileUploadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
