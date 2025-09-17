
'use server';
/**
 * @fileOverview Generates personalized insights and recommendations for the main dashboard.
 *
 * - generateDashboardInsights - A function that takes dashboard data and returns AI-powered insights.
 * - DashboardInsightsInput - The input type for the generateDashboardInsights function.
 * - DashboardInsightsOutput - The return type for the generateDashboardInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DashboardInsightsInputSchema = z.object({
  filters: z.object({
    country: z.string(),
    channel: z.string(),
    retailer: z.string(),
    gamme: z.string(),
    period: z.string(),
  }).describe('The currently selected filters on the dashboard.'),
  kpis: z.object({
    ca: z.number(),
    caTrend: z.number(),
    volumes: z.number(),
    volumesTrend: z.number(),
    transactions: z.number(),
    transactionsTrend: z.number(),
    customers: z.number(),
    customersTrend: z.number(),
  }).describe('The key performance indicators calculated for the selected filters.'),
});
export type DashboardInsightsInput = z.infer<typeof DashboardInsightsInputSchema>;

const DashboardInsightsOutputSchema = z.object({
  takeaways: z.array(z.string()).describe("Une liste de 3 points clés **très concis** (les 'À retenir') basés sur l'analyse des KPIs et des filtres."),
  recommendations: z.array(z.string()).describe("Une liste de 2 recommandations stratégiques **directes et actionnables** ('Nos recommandations'). Doivent mentionner différents leviers (ex: Retail Media, MMM, Creative Studio)."),
  nextStep: z.object({
    text: z.string().describe("Le texte pour le lien d'action 'Pour aller plus loin'."),
    href: z.string().describe("L'URL du lien, qui doit pointer vers une page pertinente de l'application (ex: '/retail-media', '/mmm', '/creative-studio')."),
  }).describe("La suggestion pour l'étape suivante, incluant un texte et un lien."),
});
export type DashboardInsightsOutput = z.infer<typeof DashboardInsightsOutputSchema>;

export async function generateDashboardInsights(input: DashboardInsightsInput): Promise<DashboardInsightsOutput> {
  return generateDashboardInsightsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateDashboardInsightsPrompt',
  input: {schema: DashboardInsightsInputSchema},
  output: {schema: DashboardInsightsOutputSchema},
  prompt: `You are an expert marketing analyst AI for "La Prairie Gourmande", a yogurt brand. Your task is to provide sharp, actionable insights for the main dashboard of the "ConvertIQ" platform.

Analyze the provided KPIs and filters to generate a concise summary.

-   **Filters**: {{{json filters}}}
-   **KPIs**: {{{json kpis}}}

Based on this data:
1.  **Generate Takeaways ("À retenir"):** Write 3 **very concise** bullet points summarizing the most important trends. Is the growth driven by volume or transactions? Is the customer base growing?
2.  **Generate Recommendations ("Nos recommandations"):** Write 2 **direct and actionable** strategic recommendations. Suggest concrete actions and link them to other parts of the ConvertIQ platform. For example, if online sales are weak, suggest a "Retail Media" campaign. If ROI seems low, suggest running a "MMM" simulation.
3.  **Suggest a Next Step ("Pour aller plus loin"):** Provide a single, relevant call-to-action with a link to another page in the app that logically follows from your analysis.

Be insightful, concise, and directly reference the data provided. Your tone should be that of a helpful, expert analyst.
`,
});

const generateDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: DashboardInsightsInputSchema,
    outputSchema: DashboardInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate dashboard insights.');
    }
    return output;
  }
);
