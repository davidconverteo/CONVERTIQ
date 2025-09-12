
import { z } from 'zod';

// --- Données enrichies ---

export const campaignDataByCountry = {
  France: [
    { id: 'C001', brand: 'La Prairie Gourmande', product: 'Pack de 4 Fraise', start: new Date('2024-07-01'), end: new Date('2024-07-31'), lever: 'Social', channel: 'Meta', objective: 'Conversion', status: 'Terminée', roas: 4.2, ca_add: 85200, spend: 20286, reach: 750000, clicks: 15000 },
    { id: 'C002', brand: 'Gamme Skyr', product: 'Skyr Nature 450g', start: new Date('2024-08-15'), end: new Date('2024-09-15'), lever: 'Radio', channel: 'NRJ', objective: 'Drive-to-store', status: 'En cours', roas: 2.5, ca_add: 75000, spend: 30000, reach: 3000000, clicks: 0 },
    { id: 'C003', brand: 'La Prairie Gourmande', product: 'Pot Ind. Vanille', start: new Date('2024-09-01'), end: new Date('2024-09-30'), lever: 'TV', channel: 'TF1', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 450000, reach: 15000000, clicks: 0 },
    { id: 'C004', brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date('2024-05-10'), end: new Date('2024-06-10'), lever: 'Affichage', channel: 'JCDecaux', objective: 'Notoriété', status: 'Terminée', roas: 1.8, ca_add: 92000, spend: 51111, reach: 5000000, clicks: 0 },
    { id: 'C005', brand: 'Gamme Végétale', product: 'Dessert Soja', start: new Date('2024-10-01'), end: new Date('2024-10-31'), lever: 'Presse', channel: 'Le Figaro', objective: 'Considération', status: 'Planifiée', roas: null, ca_add: null, spend: 25000, reach: 1200000, clicks: 0 },
    { id: 'C006', brand: 'La Prairie Gourmande', product: 'Toute la gamme', start: new Date('2024-02-01'), end: new Date('2024-02-28'), lever: 'Social', channel: 'Instagram', objective: 'Engagement', status: 'Terminée', roas: 3.5, ca_add: 63000, spend: 18000, reach: 900000, clicks: 22000 },
    { id: 'C007', brand: 'Gamme Skyr', product: 'Gamme Skyr', start: new Date('2024-04-01'), end: new Date('2024-04-30'), lever: 'TV', channel: 'M6', objective: 'Notoriété', status: 'Terminée', roas: 3.1, ca_add: 310000, spend: 100000, reach: 8000000, clicks: 0 },
    { id: 'C008', brand: 'Gamme Bio', product: 'Nouveau Yaourt Bio', start: new Date('2024-11-01'), end: new Date('2024-11-30'), lever: 'Digital', channel: 'Youtube', objective: 'Lancement', status: 'Planifiée', roas: null, ca_add: null, spend: 50000, reach: 2000000, clicks: 40000 },
    { id: 'C009', brand: 'Gamme Végétale', product: 'Dessert Amande', start: new Date('2024-06-15'), end: new Date('2024-07-15'), lever: 'Affichage', channel: 'Metrobus', objective: 'Notoriété', status: 'Terminée', roas: 1.5, ca_add: 45000, spend: 30000, reach: 4000000, clicks: 0 },
    { id: 'C010', brand: 'La Prairie Gourmande', product: 'Yaourt à boire', start: new Date('2024-08-01'), end: new Date('2024-08-31'), lever: 'Radio', channel: 'Fun Radio', objective: 'Promotion', status: 'En cours', roas: 2.8, ca_add: 56000, spend: 20000, reach: 2500000, clicks: 0 },
    { id: 'C011', brand: 'Gamme Bio', product: 'Yaourt à boire Bio', start: new Date('2024-09-01'), end: new Date('2024-09-30'), lever: 'Social', channel: 'Pinterest', objective: 'Conversion', status: 'Planifiée', roas: null, ca_add: null, spend: 15000, reach: 600000, clicks: 10000 },
    { id: 'C012', brand: 'Gamme Skyr', product: 'Skyr Vanille', start: new Date('2024-07-10'), end: new Date('2024-08-10'), lever: 'Presse', channel: 'L\'Equipe Magazine', objective: 'Notoriété', status: 'Terminée', roas: 1.2, ca_add: 18000, spend: 15000, reach: 1000000, clicks: 0 },
    { id: 'C013', brand: 'La Prairie Gourmande', product: 'Crème Dessert Chocolat', start: new Date('2024-10-15'), end: new Date('2024-11-15'), lever: 'TV', channel: 'France 2', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 280000, reach: 12000000, clicks: 0 },
    { id: 'C014', brand: 'Gamme Végétale', product: 'Yaourt Coco', start: new Date('2024-08-01'), end: new Date('2024-08-31'), lever: 'Digital', channel: 'TikTok', objective: 'Engagement', status: 'En cours', roas: 4.5, ca_add: 90000, spend: 20000, reach: 2200000, clicks: 50000 },
    { id: 'C015', brand: 'La Prairie Gourmande', product: 'Toute la gamme', start: new Date('2024-12-01'), end: new Date('2024-12-24'), lever: 'Radio', channel: 'RTL', objective: 'Promotion Noël', status: 'Planifiée', roas: null, ca_add: null, spend: 75000, reach: 5000000, clicks: 0 },
  ],
  USA: [
    { id: 'CUSA1', brand: 'La Prairie Gourmande', product: 'Grand Pot 450g', start: new Date('2024-07-15'), end: new Date('2024-08-15'), lever: 'Social', channel: 'TikTok', objective: 'Engagement', status: 'En cours', roas: 3.1, ca_add: 120500, spend: 38871, reach: 2800000, clicks: 25000 },
    { id: 'CUSA2', brand: 'Gamme Bio', product: 'Yaourt Bio Fraise', start: new Date('2024-08-01'), end: new Date('2024-08-31'), lever: 'Presse', channel: 'NY Times', objective: 'Considération', status: 'Terminée', roas: 1.5, ca_add: 45000, spend: 30000, reach: 1500000, clicks: 0 },
    { id: 'CUSA3', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-11-01'), end: new Date('2024-11-28'), lever: 'TV', channel: 'ABC', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 1200000, reach: 45000000, clicks: 0 },
    { id: 'CUSA4', brand: 'Gamme Skyr', product: 'Skyr Protéine+', start: new Date('2024-05-01'), end: new Date('2024-05-31'), lever: 'Digital', channel: 'Hulu', objective: 'Conversion', status: 'Terminée', roas: 4.5, ca_add: 225000, spend: 50000, reach: 6000000, clicks: 90000 },
    { id: 'CUSA5', brand: 'Gamme Végétale', product: 'Lait d\'Avoine', start: new Date('2024-09-10'), end: new Date('2024-10-10'), lever: 'Affichage', channel: 'Lamar', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 250000, reach: 12000000, clicks: 0 },
    { id: 'CUSA6', brand: 'La Prairie Gourmande', product: 'Kids Pouches', start: new Date('2024-08-20'), end: new Date('2024-09-20'), lever: 'Social', channel: 'Pinterest', objective: 'Drive-to-store', status: 'En cours', roas: 3.8, ca_add: 95000, spend: 25000, reach: 4000000, clicks: 120000 },
    { id: 'CUSA7', brand: 'Gamme Bio', product: 'Toute la gamme Bio', start: new Date('2024-01-15'), end: new Date('2024-02-15'), lever: 'Presse', channel: 'Whole Foods Mag', objective: 'Considération', status: 'Terminée', roas: 2.1, ca_add: 42000, spend: 20000, reach: 800000, clicks: 0 },
    { id: 'CUSA8', brand: 'Gamme Skyr', product: 'Gamme Skyr', start: new Date('2024-10-01'), end: new Date('2024-10-31'), lever: 'Radio', channel: 'iHeartRadio', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 150000, reach: 25000000, clicks: 0 },
    { id: 'CUSA9', brand: 'La Prairie Gourmande', product: 'Yaourt Grec', start: new Date('2024-03-01'), end: new Date('2024-03-31'), lever: 'TV', channel: 'NBC', objective: 'Notoriété', status: 'Terminée', roas: 3.9, ca_add: 975000, spend: 250000, reach: 35000000, clicks: 0 },
    { id: 'CUSA10', brand: 'Gamme Végétale', product: 'Dessert Coco', start: new Date('2024-12-01'), end: new Date('2024-12-24'), lever: 'Social', channel: 'Facebook', objective: 'Promotion', status: 'Planifiée', roas: null, ca_add: null, spend: 75000, reach: 10000000, clicks: 150000 },
    { id: 'CUSA11', brand: 'Gamme Bio', product: 'Yaourt Bio Myrtille', start: new Date('2024-09-01'), end: new Date('2024-09-30'), lever: 'Digital', channel: 'Youtube', objective: 'Conversion', status: 'Planifiée', roas: null, ca_add: null, spend: 80000, reach: 7000000, clicks: 110000 },
    { id: 'CUSA12', brand: 'La Prairie Gourmande', product: 'Pack Famille', start: new Date('2024-06-01'), end: new Date('2024-06-30'), lever: 'TV', channel: 'FOX', objective: 'Notoriété', status: 'Terminée', roas: 3.2, ca_add: 800000, spend: 250000, reach: 30000000, clicks: 0 },
  ],
  Japan: [
     { id: 'CJAP1', brand: 'La Prairie Gourmande', product: 'Pot Ind. Vanille', start: new Date('2024-09-01'), end: new Date('2024-09-30'), lever: 'TV', channel: 'Fuji TV', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 660000, reach: 24000000, clicks: 0 },
     { id: 'CJAP2', brand: 'Gamme Végétale', product: 'Dessert Soja', start: new Date('2024-06-01'), end: new Date('2024-06-30'), lever: 'Social', channel: 'Line', objective: 'Essai', status: 'Terminée', roas: 3.8, ca_add: 55000, spend: 14474, reach: 5000000, clicks: 80000 },
     { id: 'CJAP3', brand: 'Gamme Skyr', product: 'Skyr Nature', start: new Date('2024-07-01'), end: new Date('2024-07-31'), lever: 'Presse', channel: 'Nikkei', objective: 'Considération', status: 'Terminée', roas: 1.9, ca_add: 30000, spend: 15789, reach: 2000000, clicks: 0 },
     { id: 'CJAP4', brand: 'La Prairie Gourmande', product: 'Pack de 4 Matcha', start: new Date('2024-10-01'), end: new Date('2024-10-31'), lever: 'Digital', channel: 'Yahoo! Japan', objective: 'Conversion', status: 'Planifiée', roas: null, ca_add: null, spend: 40000, reach: 15000000, clicks: 120000 },
     { id: 'CJAP5', brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date('2024-08-15'), end: new Date('2024-09-15'), lever: 'Affichage', channel: 'Tokyo Metro', objective: 'Notoriété', status: 'En cours', roas: 2.2, ca_add: 90000, spend: 40909, reach: 30000000, clicks: 0 },
     { id: 'CJAP6', brand: 'Gamme Végétale', product: 'Lait d\'Avoine', start: new Date('2024-02-01'), end: new Date('2024-02-28'), lever: 'Social', channel: 'Instagram', objective: 'Engagement', status: 'Terminée', roas: 4.1, ca_add: 45000, spend: 10975, reach: 3000000, clicks: 60000 },
     { id: 'CJAP7', brand: 'La Prairie Gourmande', product: 'Yaourt à boire Yuzu', start: new Date('2024-04-01'), end: new Date('2024-04-30'), lever: 'TV', channel: 'NTV', objective: 'Lancement', status: 'Terminée', roas: 3.5, ca_add: 350000, spend: 100000, reach: 20000000, clicks: 0 },
     { id: 'CJAP8', brand: 'Gamme Skyr', product: 'Gamme Skyr', start: new Date('2024-11-05'), end: new Date('2024-12-05'), lever: 'Digital', channel: 'AbemaTV', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 60000, reach: 8000000, clicks: 0 },
     { id: 'CJAP9', brand: 'Gamme Bio', product: 'Yaourt Bio Nature', start: new Date('2024-01-10'), end: new Date('2024-02-10'), lever: 'Presse', channel: 'Asahi Shimbun', objective: 'Considération', status: 'Terminée', roas: 1.8, ca_add: 25000, spend: 13888, reach: 5000000, clicks: 0 },
     { id: 'CJAP10', brand: 'La Prairie Gourmande', product: 'Gamme complète', start: new Date('2025-01-01'), end: new Date('2025-01-31'), lever: 'TV', channel: 'TV Asahi', objective: 'Notoriété', status: 'Planifiée', roas: null, ca_add: null, spend: 750000, reach: 25000000, clicks: 0 },
     { id: 'CJAP11', brand: 'Gamme Skyr', product: 'Skyr Pêche', start: new Date('2024-05-01'), end: new Date('2024-05-31'), lever: 'Social', channel: 'Facebook', objective: 'Conversion', status: 'Terminée', roas: 3.9, ca_add: 62000, spend: 15897, reach: 4000000, clicks: 75000 },
     { id: 'CJAP12', brand: 'Gamme Végétale', product: 'Dessert Amande', start: new Date('2024-12-01'), end: new Date('2024-12-31'), lever: 'Affichage', channel: 'Shibuya Crossing', objective: 'Lancement', status: 'Planifiée', roas: null, ca_add: null, spend: 150000, reach: 50000000, clicks: 0 },
  ]
};

export const mediaBrandPerformanceByPlatform = {
  France: [
    { platform: 'Meta', ROI: 4.2, CPA: 1.35 }, { platform: 'TF1', ROI: 3.8, CPA: 2.5 }, { platform: 'JCDecaux', ROI: 1.8, CPA: 5.0 }, { platform: 'NRJ', ROI: 2.5, CPA: 3.1 }, { platform: 'Le Figaro', ROI: 1.2, CPA: 6.2 }, { platform: 'M6', ROI: 3.1, CPA: 3.0 }, { platform: 'Youtube', ROI: 4.0, CPA: 1.2 }
  ],
  USA: [
    { platform: 'TikTok', ROI: 3.1, CPA: 0.95 }, { platform: 'NY Times', ROI: 1.5, CPA: 4.0 }, { platform: 'ABC', ROI: 4.5, CPA: 2.8 }, { platform: 'Hulu', ROI: 4.5, CPA: 2.0 }, { platform: 'Pinterest', ROI: 3.8, CPA: 1.5 }, { platform: 'iHeartRadio', ROI: 2.2, CPA: 4.5 }
  ],
  Japan: [
     { platform: 'Fuji TV', ROI: 4.0, CPA: 2.8 }, { platform: 'Line', ROI: 3.8, CPA: 1.2 }, { platform: 'Nikkei', ROI: 1.9, CPA: 5.5 }, { platform: 'Yahoo! Japan', ROI: 3.5, CPA: 1.8 }, { platform: 'Tokyo Metro', ROI: 2.2, CPA: 4.0 }
  ]
};

export const mediaBrandBudgetAllocation = {
    France: [
      {name: 'Social', value: 38286}, {name: 'TV', value: 550000}, {name: 'Affichage', value: 81111}, {name: 'Radio', value: 50000}, {name: 'Presse', value: 25000}, {name: 'Digital', value: 50000}
    ],
    USA: [
      {name: 'Social', value: 138871}, {name: 'Presse', value: 50000}, {name: 'TV', value: 1450000}, {name: 'Digital', value: 50000}, {name: 'Affichage', value: 250000}, {name: 'Radio', value: 150000}
    ],
    Japan: [
      {name: 'TV', value: 1510000}, {name: 'Social', value: 25449}, {name: 'Presse', value: 29677}, {name: 'Digital', value: 100000}, {name: 'Affichage', value: 40909}
    ],
}

export const generateRetailMediaCampaignData = async () => ({
  France: [
    // Always On Amazon
    { id: 'RM-FR-A1', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-01-01'), end: new Date('2024-12-31'), retailer: 'Amazon Ads', lever: 'Sponsored Products', objective: 'Visibilité', status: 'En cours', roas: 5.8, sales_attributed: 350000, spend: 60345, details: { type: 'Sponsored Products', acos: '17.2%', clicks: 180000, ctr: '1.5%', cpc: '0.34€', recommendation: "Campagne 'always-on' très performante. Maintenir le budget et optimiser la liste de mots-clés négatifs tous les mois." }},
    
    // Unlimitail - Gamme Bio
    ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Sponsored Products', 'Display On-site', 'Coupons'];
      const lever = levers[i % levers.length];
      return {
        id: `RM-FR-U-GB-${i+1}`, brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date(2024, i, 15), end: new Date(2024, i, 28), retailer: 'Unlimitail', lever: lever, objective: i % 2 === 0 ? 'Visibilité' : 'Conversion', status: i < 8 ? 'Terminée' : 'En cours', roas: 4.5 + Math.random() * 2, sales_attributed: 30000 + Math.random() * 15000, spend: 6000 + Math.random() * 3000, details: { acos: `${(18 + Math.random()*5).toFixed(1)}%`, recommendation: `Campagne ${i+1} (${lever}) pour la Gamme Bio.` }
      };
    }),
    // Unlimitail - Dessert Soja
     ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Display Off-site', 'Sponsored Products', 'Coupons'];
      const lever = levers[i % levers.length];
      return {
        id: `RM-FR-U-DS-${i+1}`, brand: 'Gamme Végétale', product: 'Dessert Soja', start: new Date(2024, i, 10), end: new Date(2024, i, 24), retailer: 'Unlimitail', lever: lever, objective: 'Considération', status: i < 8 ? 'Terminée' : 'Planifiée', roas: 3.0 + Math.random() * 1.5, sales_attributed: 15000 + Math.random() * 10000, spend: 4500 + Math.random() * 2000, details: { reach: 800000, recommendation: `Vague ${i+1} de la campagne ${lever}.` }
      };
    }),

    // Amazon Ads - Skyr
    ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Display On-site', 'Sponsored Brands', 'Sponsored Products'];
      const lever = levers[i % levers.length];
      return {
      id: `RM-FR-A-S-${i+1}`, brand: 'Gamme Skyr', product: 'Skyr Nature', start: new Date(2024, i, 1), end: new Date(2024, i, 28), retailer: 'Amazon Ads', lever: lever, objective: 'Notoriété', status: i < 8 ? 'Terminée' : 'En cours', roas: 2.5 + Math.random(), sales_attributed: 20000 + Math.random() * 5000, spend: 8000 + Math.random() * 2000, details: { impressions: 2500000, recommendation: `Campagne mensuelle ${i+1} (${lever}) pour le Skyr.`}
    }}),
     ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Sponsored Brands', 'Display On-site', 'Sponsored Products'];
      const lever = levers[i % levers.length];
      return {
      id: `RM-FR-A-SF-${i+1}`, brand: 'Gamme Skyr', product: 'Skyr Fruits', start: new Date(2024, i, 5), end: new Date(2024, i, 25), retailer: 'Amazon Ads', lever: lever, objective: 'Notoriété', status: i < 8 ? 'Terminée' : 'Planifiée', roas: 3.5 + Math.random(), sales_attributed: 15000 + Math.random() * 5000, spend: 4000 + Math.random() * 1000, details: { impressions: 1000000, recommendation: `Lancement Skyr Fruits (${lever}), vague ${i+1}.` }
    }}),

    // Carrefour
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Animation Magasin', 'Coupons', 'Display On-site'];
        const lever = levers[i % levers.length];
        return {
      id: `RM-FR-C-${i+1}`, brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date(2024, i, 5), end: new Date(2024, i, 18), retailer: 'Carrefour', lever: lever, objective: 'Recrutement', status: i < 8 ? 'Terminée' : 'En cours', roas: 10 + Math.random()*5, sales_attributed: 50000 + Math.random()*10000, spend: 5000 + Math.random()*1000, details: { sales_uplift_vs_control: `${(20+Math.random()*10).toFixed(0)}%`, recommendation: `Activation ${lever} ${i+1}.` }
    }}),
    
    // Système U
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `RM-FR-SU-${i+1}`, brand: 'La Prairie Gourmande', product: 'Pack de 4 Fraise', start: new Date(2024, i, 1), end: new Date(2024, i, 30), retailer: 'Système U', lever: 'Coupons', objective: 'Fidélisation', status: i<9 ? 'Terminée' : 'Planifiée', roas: null, sales_attributed: 30000 + Math.random()*10000, spend: 8000 + Math.random()*2000, details: { estimated_redemption: `${(4+Math.random()*2).toFixed(1)}%`, recommendation: `Offre couponing mensuelle ${i+1}.` }
    })),
  ],
  USA: [
     // Always On Amazon
    { id: 'RM-US-A1', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-01-01'), end: new Date('2024-12-31'), retailer: 'Amazon Ads', lever: 'Sponsored Products', objective: 'Visibilité', status: 'En cours', roas: 6.5, sales_attributed: 850000, spend: 130769, details: { type: 'Sponsored Products', acos: '15.4%', clicks: 450000, ctr: '2.0%', cpc: '0.95$', recommendation: "Excellent ROAS pour une campagne 'always-on'. La part de voix est dominante sur les mots-clés principaux." }},
    // Walmart Connect
    ...Array.from({ length: 10 }, (_, i) => {
      const levers = ['Sponsored Products', 'Display On-site', 'Coupons'];
      const lever = levers[i % levers.length];
      return {
        id: `RM-US-W-GE-${i+1}`, brand: 'Gourdes Enfant', product: 'Gourde Fraise-Banane', start: new Date(2024, i, 10), end: new Date(2024, i, 24), retailer: 'Walmart Connect', lever: lever, objective: 'Conversion', status: i < 8 ? 'Terminée' : 'En cours', roas: 6 + Math.random(), sales_attributed: 100000 + Math.random()*20000, spend: 16000 + Math.random()*3000, details: { acos: `${(15+Math.random()*2).toFixed(1)}%`, recommendation: `Campagne ${lever} ${i+1} pour les gourdes.`}
      }
    }),
    // Instacart Ads
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Audience Extension', 'Sponsored Products', 'Coupons'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-US-I-GB-${i+1}`, brand: 'Gamme Bio', product: 'Gamme Bio', start: new Date(2024, i, 1), end: new Date(2024, i, 28), retailer: 'Instacart Ads', lever: lever, objective: 'Recrutement', status: i < 8 ? 'Terminée' : 'En cours', roas: 3.5 + Math.random(), sales_attributed: 60000 + Math.random()*10000, spend: 17000 + Math.random()*2000, details: { offsite_sales_lift: `${(10+Math.random()*4).toFixed(1)}%`, recommendation: `Campagne de recrutement ${lever} ${i+1}.` }
        }
    }),
    // Kroger Precision Marketing
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Coupons', 'Display On-site', 'Sponsored Products'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-US-K-SN-${i+1}`, brand: 'Gamme Skyr', product: 'Skyr Nature', start: new Date(2024, i, 1), end: new Date(2024, i, 30), retailer: 'Kroger Precision Marketing', lever: lever, objective: 'Essai', status: i < 8 ? 'Terminée' : 'Planifiée', roas: null, sales_attributed: null, spend: 40000 + Math.random()*5000, details: { estimated_redemption: `${(5+Math.random()*2).toFixed(1)}%`, recommendation: `Campagne couponing trimestrielle ${i+1}.` }
        }
    }),
     // Amazon Ads - Gamme Végétale
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Display On-site', 'Sponsored Products', 'Sponsored Brands'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-US-A-GV-${i+1}`, brand: 'Gamme Végétale', product: 'Dessert Amande', start: new Date(2024, i, 15), end: new Date(2024, i, 30), retailer: 'Amazon Ads', lever: lever, objective: 'Considération', status: i < 8 ? 'Terminée' : 'En cours', roas: 3.0 + Math.random(), sales_attributed: 45000 + Math.random()*10000, spend: 15000 + Math.random()*3000, details: { brand_uplift: `${(8+Math.random()*4).toFixed(1)}%`, recommendation: `Campagne de considération ${lever} ${i+1}.`}
        }
    }),
  ],
  Japan: [
    // Always On Amazon
    { id: 'RM-JP-A1', brand: 'La Prairie Gourmande', product: 'Toute la marque', start: new Date('2024-01-01'), end: new Date('2024-12-31'), retailer: 'Amazon Ads', lever: 'Sponsored Products', objective: 'Visibilité', status: 'En cours', roas: 4.9, sales_attributed: 250000, spend: 51020, details: { type: 'Sponsored Products', acos: '20.4%', clicks: 300000, ctr: '1.0%', cpc: '20 JPY', recommendation: "La campagne maintient une bonne visibilité. L'ACoS est plus élevé qu'en EU/US, ce qui est normal pour le marché japonais. Continuer à optimiser." }},
    // Rakuten Ads
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Coupons', 'Display On-site', 'Sponsored Products'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-JP-R-DS-${i+1}`, brand: 'Gamme Végétale', product: 'Dessert Soja Chocolat', start: new Date(2024, i, 1), end: new Date(2024, i, 28), retailer: 'Rakuten Ads', lever: lever, objective: 'Essai Produit', status: i < 8 ? 'Terminée' : 'Planifiée', roas: null, sales_attributed: null, spend: 14000 + Math.random()*2000, details: { estimated_redemption: `${(7+Math.random()*3).toFixed(1)}%`, recommendation: `Offre couponing ${i+1}.` }
        }
    }),
    // Yahoo! Shopping
    ...Array.from({ length: 10 }, (_, i) => {
        const levers = ['Sponsored Products', 'Display On-site', 'Coupons'];
        const lever = levers[i % levers.length];
        return {
          id: `RM-JP-Y-GP-${i+1}`, brand: 'Gourdes Enfant', product: 'Gourde Pomme', start: new Date(2024, i, 1), end: new Date(2024, i, 28), retailer: 'Yahoo! Shopping', lever: lever, objective: 'Conversion', status: i < 8 ? 'Terminée' : 'En cours', roas: 4.5 + Math.random()*0.5, sales_attributed: 80000 + Math.random()*10000, spend: 18000 + Math.random()*2000, details: { acos: `${(21+Math.random()*3).toFixed(1)}%`, recommendation: `Campagne mensuelle ${lever} ${i+1} sur Yahoo.`}
        }
    }),
  ]
});

export const retailMediaPerformanceByRetailer = {
  France: [ { retailer: 'Unlimitail', ROI: 5.1, CPA: 0.71 }, { retailer: 'Amazon Ads', ROI: 5.8, CPA: 0.34 }, { retailer: 'Carrefour', ROI: 10, CPA: 0.8 }, { retailer: 'Système U', ROI: 4, CPA: 1.0 } ],
  USA: [ { retailer: 'Walmart Connect', ROI: 6.2, CPA: 0.43 }, { retailer: 'Instacart Ads', ROI: 3.5, CPA: 0.98 }, { retailer: 'Kroger Precision Marketing', ROI: 4.8, CPA: 1.2 }, { retailer: 'Amazon Ads', ROI: 6.5, CPA: 0.95 } ],
  Japan: [ { retailer: 'Rakuten Ads', ROI: 5.5, CPA: 0.5 }, { retailer: 'Amazon Ads', ROI: 4.9, CPA: 1.2 }, { retailer: 'Yahoo! Shopping', ROI: 4.5, CPA: 1.5 }]
};

export const retailMediaBudgetAllocation = {
    France: [{name: 'Sponsored Products', value: 69169}, {name: 'Display On-site', value: 7857}, {name: 'Animation Magasin', value: 5400}, {name: 'Coupons', value: 25000}, { name: 'Display Off-site', value: 5625 }, { name: 'Sponsored Brands', value: 12000 } ],
    USA: [{name: 'Sponsored Products', value: 150124}, {name: 'Audience Extension', value: 18571}, {name: 'Coupons', value: 40000}, { name: 'Display On-site', value: 15484 }],
    Japan: [{name: 'Sponsored Products', value: 69909}, {name: 'Coupons', value: 14000}],
};


const consolidateMediaData = (country: 'France' | 'USA' | 'Japan') => {
    const brandCampaigns = campaignDataByCountry[country];
    // This is async now, but for simplicity in this synchronous function, we'll assume it's pre-fetched.
    // In a real app, `getMmmData` would need to be async and await this.
    const retailCampaigns = (generateRetailMediaCampaignData as any)()[country] || [];

    const consolidated = {
        investments: {} as Record<string, number>,
        contributions: {} as Record<string, number>,
    };

    const processCampaigns = (campaigns: any[], contributionKey: string) => {
        campaigns.forEach((c: any) => {
            if (c.status.toLowerCase() !== 'planifiée' && c.spend && c[contributionKey]) {
                const lever = c.lever;
                consolidated.investments[lever] = (consolidated.investments[lever] || 0) + c.spend;
                consolidated.contributions[lever] = (consolidated.contributions[lever] || 0) + c[contributionKey];
            }
        });
    };

    processCampaigns(brandCampaigns, 'ca_add');
    processCampaigns(retailCampaigns, 'sales_attributed');
    
    // Rename 'Sponsored Products' etc. to 'Retail Media'
    const retailLevers = ['sponsored products', 'display on-site', 'audience extension', 'animation magasin', 'coupons', 'sponsored brands', 'display off-site'];
    const retailInvestment = Object.entries(consolidated.investments).reduce((sum, [lever, value]) => retailLevers.includes(lever.toLowerCase()) ? sum + value : sum, 0);
    const retailContribution = Object.entries(consolidated.contributions).reduce((sum, [lever, value]) => retailLevers.includes(lever.toLowerCase()) ? sum + value : sum, 0);

    retailLevers.forEach(lever => {
      const formattedLever = lever.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      delete consolidated.investments[formattedLever];
      delete consolidated.contributions[formattedLever];
    });

    if (retailInvestment > 0) {
      consolidated.investments['Retail Media'] = retailInvestment;
      consolidated.contributions['Retail Media'] = retailContribution;
    }
    
    return consolidated;
};


const generateMmmData = () => {
    const countries = ['France', 'USA', 'Japan'] as const;
    const mmm: any = {};

    countries.forEach(country => {
        const consolidated = consolidateMediaData(country);
        mmm[country] = {
             's1-2025': {
                baseline: 1350000,
                contributions: consolidated.contributions,
                investments: consolidated.investments,
            },
            's2-2024': { // Fallback static data
                baseline: 1200000,
                contributions: { 'Retail Media': 300000, Social: 250000, TV: 150000, SEA: 100000, Presse: 80000 },
                investments: { 'Retail Media': 75000, Social: 60000, TV: 50000, SEA: 35000, Presse: 40000 },
            },
        };
    });
    
    mmm.simulation = {
        labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        datasets: [
            { id: 'tv', name: 'TV', color: '#0ea5e9', maxBudget: 100, initialBudget: 50, values: [0, 15, 28, 38, 45, 50, 53, 55, 56, 57, 57.5] },
            { id: 'social', name: 'Social', color: '#334155', maxBudget: 150, initialBudget: 75, values: [0, 20, 35, 48, 58, 65, 70, 73, 75, 76, 76.5] },
            { id: 'sea', name: 'SEA', color: '#22c55e', maxBudget: 100, initialBudget: 25, values: [0, 25, 45, 60, 70, 75, 78, 80, 81, 81.5, 82] },
            { id: 'retail_media', name: 'Retail Media', color: '#f59e0b', maxBudget: 120, initialBudget: 40, values: [0, 22, 40, 55, 65, 72, 77, 80, 82, 83, 83.5] },
            { id: 'presse', name: 'Presse', color: '#ef4444', maxBudget: 50, initialBudget: 10, values: [0, 8, 15, 21, 26, 30, 33, 35, 36, 36.5, 37] },
        ]
    };

    return mmm;
}

export const mmmData = generateMmmData();

export const countryData: Record<string, { flag: string, lastUpdate: string }> = {
    'France': { flag: '🇫🇷', lastUpdate: '01/07/2025' },
    'USA': { flag: '🇺🇸', lastUpdate: '15/07/2025' },
    'Japan': { flag: '🇯🇵', lastUpdate: '20/06/2025' }
};


export const DataCategorySchema = z.enum(['mediaBrand', 'retailMedia', 'mmm']);
export type DataCategory = z.infer<typeof DataCategorySchema>;

export async function getDataSummary(category: DataCategory) {
    if (category === 'mediaBrand') {
        const summary = Object.entries(campaignDataByCountry).map(([country, campaigns]) => {
            const { spend, ca_add } = campaigns.reduce((acc, c) => {
                if (c.status !== 'Planifiée') {
                    acc.spend += c.spend || 0;
                    acc.ca_add += c.ca_add || 0;
                }
                return acc;
            }, { spend: 0, ca_add: 0 });
            const roas = spend > 0 ? ca_add / spend : 0;
            return { country, totalSpend: spend, totalCaAdd: ca_add, globalRoas: roas, campaignCount: campaigns.length };
        });
        return summary;
    }
    if (category === 'retailMedia') {
        const retailData = await generateRetailMediaCampaignData();
        const summary = Object.entries(retailData).map(([country, campaigns]) => {
             const { spend, sales_attributed } = (campaigns as any[]).reduce((acc: any, c: any) => {
                if (c.status.toLowerCase() !== 'planifiée') {
                    acc.spend += c.spend || 0;
                    acc.sales_attributed += c.sales_attributed || 0;
                }
                return acc;
            }, { spend: 0, sales_attributed: 0 });
            const roas = spend > 0 ? sales_attributed / spend : 0;
            return { country, totalSpend: spend, totalSalesAttributed: sales_attributed, globalRoas: roas, campaignCount: (campaigns as any[]).length };
        });
        return summary;
    }
     if (category === 'mmm') {
        const summary = Object.entries(mmmData).filter(([key])=>key !== 'simulation').map(([country, periods]) => {
            const latestPeriod = Object.keys(periods).sort().reverse()[0];
            const data = periods[latestPeriod as keyof typeof periods];
            const totalInvestment = Object.values(data.investments).reduce((a, b) => a + b, 0);
            const totalContribution = Object.values(data.contributions).reduce((a, b) => a + b, 0);
            const globalRoas = totalInvestment > 0 ? totalContribution / totalInvestment : 0;
            const mostProfitableLever = Object.entries(data.contributions).reduce((best, [lever, contribution]) => {
                const investment = data.investments[lever as keyof typeof data.investments] || 0;
                const roas = investment > 0 ? contribution / investment : 0;
                if (roas > best.roas) {
                    return { lever, roas };
                }
                return best;
            }, { lever: '', roas: 0});

            return {
                country,
                period: latestPeriod,
                totalInvestment,
                totalContribution,
                globalRoas,
                mostProfitableLever
            };
        });
        return summary;
    }
    return { error: 'Unknown category' };
}

    
