
'use server';
/**
 * @fileOverview Generates a customer persona based on dashboard filters.
 *
 * - generateCustomerPersona - A function that takes filters and returns a persona.
 * - GenerateCustomerPersonaInput - The input type for the generateCustomerPersona function.
 * - GenerateCustomerPersonaOutput - The return type for the generateCustomerpersona function.
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
    name: z.string().describe("Un prénom et un qualificatif pour le persona (ex: 'Alex, l'urbain pressé'). Utilise des prénoms neutres ou variés."),
    age: z.number().describe("L'âge approximatif du persona."),
    familyStatus: z.string().describe("La situation familiale (ex: 'En couple, sans enfant', 'Parent solo')."),
    profession: z.string().describe("La profession du persona."),
    habits: z.array(z.string()).describe("Une liste de 2 habitudes d'achat **clés et concises**."),
    motivations: z.array(z.string()).describe("Une liste de 2 motivations principales **clés et concises**."),
    painPoints: z.array(z.string()).describe("Une liste de 2 'points de douleur' **clés et concis**."),
    mediaHabits: z.array(z.string()).describe("Une liste de 2 habitudes médias **clés et concises** (ex: 'Écoute des podcasts', 'Très actif sur Instagram')."),
    marketingLevers: z.array(z.string()).describe("Une liste de 2 leviers marketing les plus pertinents à activer pour ce persona (ex: 'Promotions ciblées', 'Partenariats influenceurs')."),
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
  Ton rôle est de dresser un portrait-robot d'un client type en te basant sur des données de filtres spécifiques. Tu dois être **bref, percutant et non-stéréotypé**.

  Voici le contexte de l'analyse :
  - Filtres Actifs: {{{json filters}}}

  Instructions :
  1.  **Analyse chaque filtre** pour en déduire des traits de caractère et des comportements. Par exemple, un achat chez 'E.Leclerc' (grande surface périurbaine) implique des habitudes différentes d'un achat sur 'Amazon'. La gamme 'Bio' implique une sensibilité différente de la gamme 'Skyr'. Sois pertinent et évite les clichés.
  2.  **Construis un Persona Cohérent et Inclusif :** Donne-lui un nom (plutôt neutre comme Alex, Camille, Sasha), un âge, une profession et une situation familiale plausibles. Ne présume pas du genre.
  3.  **Détaille ses Habitudes (2 max):** Décris 2 habitudes d'achat **très concrètes et courtes**.
  4.  **Identifie ses Motivations (2 max):** Quelles sont ses 2 raisons principales d'acheter ? Sois bref.
  5.  **Exprime ses Frustrations (2 max):** Quels sont ses 2 "points de douleur" ? Sois bref.
  6.  **Décris ses Habitudes Média (2 max):** Où ce persona s'informe-t-il ou se divertit-il ? (ex: 'Suit des influenceurs food sur TikTok', 'Lit la presse économique').
  7.  **Suggère des Leviers Marketing (2 max):** Quels sont les 2 meilleurs moyens de toucher ce persona ? (ex: 'Campagnes Retail Media ciblées', 'Contenus sur le bien-être sur Instagram').

  Sois créatif mais réaliste. Le persona doit être un outil actionnable. Va droit au but.`,
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
    const imagePrompt = `Portrait photo réaliste de ${personaDetails.name}, ${personaDetails.age} ans, ${personaDetails.profession}. Personne à l'allure non-binaire ou au genre ambigu. Arrière-plan neutre.`;
    
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
