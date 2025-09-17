
'use server';
/**
 * @fileOverview Generates a customer persona based on dashboard filters.
 *
 * - generateCustomerPersona - A function that takes filters and returns a persona.
 * - GenerateCustomerPersonaInput - The input type for the generateCustomerPersona function.
 * - GenerateCustomerPersonaOutput - The return type for the generateCustomerPersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomerPersonaInputSchema = z.object({
  filters: z.object({
    country: z.string(),
    channel: z.string(),
    retailer: z.string(),
    gamme: z.string(),
    period: z.string(),
  }).describe('The currently selected filters on the dashboard.'),
});
export type GenerateCustomerPersonaInput = z.infer<typeof GenerateCustomerPersonaInputSchema>;

const GenerateCustomerPersonaOutputSchema = z.object({
    name: z.string().describe("Un prénom et un qualificatif pour le persona (ex: 'Sophie, la maman pressée')."),
    age: z.number().describe("L'âge approximatif du persona."),
    familyStatus: z.string().describe("La situation familiale (ex: 'Mère de 2 enfants')."),
    profession: z.string().describe("La profession du persona."),
    habits: z.array(z.string()).describe("Une liste de 2-3 habitudes d'achat clés."),
    motivations: z.array(z.string()).describe("Une liste de 2-3 motivations principales lors de l'achat."),
    painPoints: z.array(z.string()).describe("Une liste de 2-3 'points de douleur' ou frustrations."),
    imageUrl: z.string().describe("Une URL vers une image de portrait réaliste générée par l'IA pour ce persona, au format data URI."),
});
export type GenerateCustomerPersonaOutput = z.infer<typeof GenerateCustomerPersonaOutputSchema>;


export async function generateCustomerPersona(input: GenerateCustomerPersonaInput): Promise<GenerateCustomerPersonaOutput> {
  return generateCustomerPersonaFlow(input);
}


const personaPrompt = ai.definePrompt({
  name: 'generateCustomerPersonaPrompt',
  input: {schema: GenerateCustomerPersonaInputSchema},
  output: {schema: Omit<GenerateCustomerPersonaOutput, 'imageUrl'>},
  prompt: `You are an expert market researcher for a yogurt brand called "La Prairie Gourmande".
  Based on the following dashboard filters, create a realistic and detailed customer persona.
  
  Filters: {{{json filters}}}
  
  Generate a persona that plausibly represents a typical customer within these filter criteria. Be creative and specific.`,
});

const generateCustomerPersonaFlow = ai.defineFlow(
  {
    name: 'generateCustomerPersonaFlow',
    inputSchema: GenerateCustomerPersonaInputSchema,
    outputSchema: GenerateCustomerPersonaOutputSchema,
  },
  async (input) => {
    const { output: personaDetails } = await personaPrompt(input);
    if (!personaDetails) {
        throw new Error("Failed to generate persona details.");
    }
    
    // Generate an image for the persona
    const imagePrompt = `Portrait photo réaliste de ${personaDetails.name}, ${personaDetails.age} ans, ${personaDetails.profession}.`;
    
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: imagePrompt,
    });
    
    if (!media || !media.url) {
      throw new Error('Image generation failed to return an image for the persona.');
    }
    
    return {
        ...personaDetails,
        imageUrl: media.url,
    };
  }
);
