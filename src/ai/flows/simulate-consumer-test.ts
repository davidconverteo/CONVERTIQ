
'use server';
/**
 * @fileOverview A flow to simulate a consumer test using AI.
 *
 * - simulateConsumerTest - A function that takes test stimuli and returns a simulated report.
 * - SimulateConsumerTestInput - The input type for the simulateConsumerTest function.
 * - SimulateConsumerTestOutput - The return type for the simulateConsumerTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateConsumerTestInputSchema = z.object({
  testTitle: z.string().describe('The title of the test.'),
  testObjective: z.string().describe('The main objective of the test.'),
  targetPanel: z.string().describe('The consumer panel to simulate (e.g., "Familles avec enfants").'),
  script: z.string().optional().describe('A text script, concept description, or other text stimulus.'),
  fileDataUri: z.string().optional().describe('An image or video file as a data URI.'),
  fileType: z.string().optional().describe('The MIME type of the file (e.g., "image/jpeg", "video/mp4").'),
});
export type SimulateConsumerTestInput = z.infer<typeof SimulateConsumerTestInputSchema>;

const SimulateConsumerTestOutputSchema = z.object({
  attractionScore: z.number().describe('A global attraction score out of 100.'),
  keyStrengths: z.string().describe('A summary of the key strengths identified by the AI panel.'),
  keyWeaknesses: z.string().describe('A summary of the key weaknesses identified by the AI panel.'),
  consumerVerbatims: z.array(z.object({
    profile: z.string().describe("The simulated consumer's profile (e.g., 'Femme, 34 ans')."),
    quote: z.string().describe("The simulated consumer's verbatim quote."),
  })).describe('A list of 2-3 simulated consumer verbatims.'),
  recommendation: z.string().describe('A final strategic recommendation from the AI.'),
});
export type SimulateConsumerTestOutput = z.infer<typeof SimulateConsumerTestOutputSchema>;

export async function simulateConsumerTest(input: SimulateConsumerTestInput): Promise<SimulateConsumerTestOutput> {
  return simulateConsumerTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateConsumerTestPrompt',
  input: {schema: SimulateConsumerTestInputSchema},
  output: {schema: SimulateConsumerTestOutputSchema},
  prompt: `You are an AI expert in consumer market research. Your task is to simulate a consumer panel test based on the provided stimuli and generate a report.
  
  You must act as a panel of consumers corresponding to the target: "{{targetPanel}}".
  
  Here is the test information:
  - Test Title: {{testTitle}}
  - Test Objective: {{testObjective}}
  - Target Panel: {{targetPanel}}
  
  Here are the stimuli to analyze:
  {{#if script}}- Concept/Script: {{{script}}}{{/if}}
  {{#if fileDataUri}}- Creative Asset: {{media url=fileDataUri}}{{/if}}
  
  Based on this, please perform the following actions:
  1.  **Analyze the stimuli** from the perspective of the target panel.
  2.  **Determine an overall attraction score** out of 100.
  3.  **Identify the key strengths and weaknesses** of the concept/creative.
  4.  **Generate 2 to 3 realistic and insightful consumer verbatims** that reflect the panel's feedback. Each verbatim must include a brief profile.
  5.  **Provide a concise, actionable strategic recommendation.**
  
  Produce the output in the required structured format. Be insightful and critical, as a real market researcher would be.`,
});

const simulateConsumerTestFlow = ai.defineFlow(
  {
    name: 'simulateConsumerTestFlow',
    inputSchema: SimulateConsumerTestInputSchema,
    outputSchema: SimulateConsumerTestOutputSchema,
  },
  async input => {
    // For the demo, if no input is provided, we can return a mock result.
    // In a real scenario, we would always call the prompt.
    if (!input.script && !input.fileDataUri) {
        return {
            attractionScore: 78,
            keyStrengths: "Le concept est jugé innovant et répond à une vraie attente du marché. Le design est perçu comme moderne et épuré.",
            keyWeaknesses: "La proposition de valeur n'est pas assez claire. Le prix suggéré semble élevé par rapport aux bénéfices perçus.",
            consumerVerbatims: [
                { profile: "Femme, 34 ans, mère de 2 enfants", quote: "J'aime l'idée, c'est pratique. Mais est-ce que ça justifie le prix ? Je ne suis pas sûre." },
                { profile: "Homme, 28 ans, célibataire", quote: "Le packaging est super, ça donne envie. Je serais prêt à essayer pour voir." },
            ],
            recommendation: "Clarifier le bénéfice principal sur le packaging et envisager une offre de lancement pour justifier le positionnement prix."
        };
    }
      
    const {output} = await prompt(input);
    return output!;
  }
);
