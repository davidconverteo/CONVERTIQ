'use server';
/**
 * @fileOverview Applies an edit to a marketing image based on a user's instruction.
 *
 * - editMarketingImage - A function that handles the iterative image editing process.
 * - EditMarketingImageInput - The input type for the editMarketingImage function.
 * - EditMarketingImageOutput - The return type for the editMarketingImage function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EditMarketingImageInputSchema = z.object({
  baseImage: z
    .string()
    .describe(
      "The image to be edited, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  editInstruction: z.string().describe('The user instruction for the edit (e.g., "move the logo to the left", "make the background blue").'),
});
export type EditMarketingImageInput = z.infer<typeof EditMarketingImageInputSchema>;

const EditMarketingImageOutputSchema = z.object({
  editedImageUrl: z.string().describe('The URL of the edited image, as a data URI.'),
});
export type EditMarketingImageOutput = z.infer<typeof EditMarketingImageOutputSchema>;

export async function editMarketingImage(
  input: EditMarketingImageInput
): Promise<EditMarketingImageOutput> {
  return editMarketingImageFlow(input);
}

const editMarketingImageFlow = ai.defineFlow(
  {
    name: 'editMarketingImageFlow',
    inputSchema: EditMarketingImageInputSchema,
    outputSchema: EditMarketingImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { text: input.editInstruction },
        { media: { url: input.baseImage } },
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image editing failed to return an image.');
    }

    return { editedImageUrl: media.url };
  }
);
