'use server';
/**
 * @fileOverview A simple chatbot flow with data access.
 *
 * - askChatbot - A function that takes a prompt and returns a response.
 * - ChatbotInput - The input type for the askChatbot function.
 * - ChatbotOutput - The return type for the askChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getDataSummary, DataCategorySchema } from '@/services/data-service';

const ChatbotInputSchema = z.object({
  prompt: z.string().describe("The user's question or message."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe("The AI's response."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function askChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const getDataSummaryTool = ai.defineTool(
    {
        name: 'getDataSummary',
        description: 'Get a summary of data for a specific category (e.g., mediaBrand, retailMedia, mmm).',
        inputSchema: z.object({
            category: DataCategorySchema,
        }),
        outputSchema: z.any(),
    },
    async ({ category }) => {
        return getDataSummary(category);
    }
);


const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  tools: [getDataSummaryTool],
  prompt: `Tu es un expert en analyse de données marketing pour la plateforme "ConvertIQ" qui aide la marque de yaourts "La Prairie Gourmande".
  Tu réponds à des questions basées sur les données affichées dans les différents tableaux de bord.
  Utilise l'outil 'getDataSummary' si nécessaire pour répondre à la question de l'utilisateur sur les données de performance. Les catégories disponibles sont 'mediaBrand', 'retailMedia', et 'mmm'.
  Sois concis, pertinent et sympathique.
  
  Question de l'utilisateur: {{{prompt}}}`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
