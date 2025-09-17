
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
    habits: z.array(z.string()).describe("Une liste de 2-3 habitudes d'achat clés basées sur les filtres."),
    motivations: z.array(z.string()).describe("Une liste de 2-3 motivations principales lors de l'achat, en lien avec les filtres."),
    painPoints: z.array(z.string()).describe("Une liste de 2-3 'points de douleur' ou frustrations liés à l'expérience d'achat."),
    imageUrl: z.string().describe("Une URL vers une image de portrait réaliste générée par l'IA pour ce persona, au format data URI."),
});
export type GenerateCustomerPersonaOutput = z.infer<typeof GenerateCustomerPersonaOutputSchema>;


export async function generateCustomerPersona(input: GenerateCustomerPersonaInput): Promise<GenerateCustomerPersonaOutput> {
  return generateCustomerPersonaFlow(input);
}


const personaPrompt = ai.definePrompt({
  name: 'generateCustomerPersonaPrompt',
  input: {schema: GenerateCustomerPersonaInputSchema},
  output: {schema: GenerateCustomerPersonaOutputSchema.omit({ imageUrl: true })},
  prompt: `Tu es un expert sociologue et analyste marketing pour la marque de yaourts "La Prairie Gourmande".
  Ton rôle est de dresser un portrait-robot d'un client type en te basant sur des données de filtres spécifiques. Tu dois aller au-delà de la simple description et créer un personnage crédible et cohérent.

  Voici le contexte de l'analyse :
  - Filtres Actifs: {{{json filters}}}

  Instructions :
  1.  **Analyse chaque filtre** pour en déduire des traits de caractère et des comportements. Par exemple, un achat chez 'E.Leclerc' (grande surface périurbaine) implique des habitudes différentes d'un achat sur 'Amazon' ou dans un petit magasin de centre-ville. La gamme 'Bio' implique une sensibilité différente de la gamme 'Skyr' (orientée protéines/sport). Le canal 'online' implique une certaine aisance avec le digital.
  2.  **Construis un Persona Cohérent :** Donne-lui un nom, un âge, une profession et une situation familiale qui sont plausibles avec l'ensemble des filtres.
  3.  **Détaille ses Habitudes :** Décris 2-3 habitudes d'achat concrètes. Par exemple: "Fait ses grosses courses une fois par semaine chez E.Leclerc pour toute la famille." ou "Commande en ligne pour gagner du temps."
  4.  **Identifie ses Motivations :** Quelles sont ses 2-3 raisons principales d'acheter ce type de produit ? (Ex: "Cherche un produit sain et rapide pour ses enfants", "Veut un dessert gourmand mais pas trop calorique").
  5.  **Exprime ses Frustrations :** Quels sont ses 2-3 "points de douleur" ? (Ex: "Manque de promotions sur ses produits préférés", "Les nouveaux produits sont souvent en rupture de stock").

  Sois créatif mais réaliste. Le persona doit être un outil actionnable pour l'équipe marketing.`,
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
    const imagePrompt = `Portrait photo réaliste de ${personaDetails.name}, ${personaDetails.age} ans, ${personaDetails.profession}. Arrière-plan neutre.`;
    
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
