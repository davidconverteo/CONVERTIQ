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
  prompt: `You are an AI prompt generator. You will create a detailed text prompt based on the file and the user instructions.

User instructions: {{{userPrompt}}}

Creative asset: {{media url=fileDataUri}}`,
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
