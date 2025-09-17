import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { Request, Response } from "express";

// PDF & Excel Libraries
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as ExcelJS from "exceljs";

// Initialize Firebase Admin SDK
initializeApp();

// --- Type Definitions for Request Body and Data ---
interface IExportRequestBody {
  tabTitle: string;
  selectedItems: {
    data: string[];
    graphs: string[];
  };
  format: "pdf" | "xls";
}

interface IKpi {
  name: string;
  value: string;
  trend: string;
}

interface IGraphData {
  month: string;
  revenue: number;
  expenses: number;
}

// --- Data Simulation ---
// Mimics fetching KPI data from a data service
const generateKpiData = (): IKpi[] => [
  { name: "Total Users", value: "1,250", trend: "+5%" },
  { name: "Monthly Revenue", value: "€12,450", trend: "+2.1%" },
  { name: "Churn Rate", value: "1.8%", trend: "-0.5%" },
];

// Mimics fetching graph/chart data from a data service
const generateGraphData = (): IGraphData[] => [
  { month: "June 2025", revenue: 15000, expenses: 9000 },
  { month: "July 2025", revenue: 18500, expenses: 11000 },
  { month: "August 2025", revenue: 21000, expenses: 12500 },
];

/**
 * Main HTTP-triggered Cloud Function to generate a report.
 */
export const exportReport = onRequest(
  {
    // Set a higher memory limit as file generation can be intensive
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request: Request, response: Response) => {
    logger.info("Report generation started.", { structuredData: true });

    // 1. Handle HTTP Method and CORS (for development)
    response.set("Access-Control-Allow-Origin", "*"); // Adjust for production
    if (request.method === "OPTIONS") {
        response.set("Access-Control-Allow-Methods", "POST");
        response.set("Access-Control-Allow-Headers", "Content-Type");
        response.set("Access-Control-Max-Age", "3600");
        response.status(204).send("");
        return;
    }
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    try {
      // 2. Validate Request Body
      const body = request.body as IExportRequestBody;
      if (!body.format || !["pdf", "xls"].includes(body.format)) {
        logger.warn("Invalid or missing format in request body.");
        response.status(400).send("Invalid request: 'format' must be 'pdf' or 'xls'.");
        return;
      }
      
      const { tabTitle, format } = body;
      const kpiData = generateKpiData();
      const graphData = generateGraphData();

      // 3. Generate File Based on Format
      if (format === "pdf") {
        // --- PDF Generation Logic ---
        const pdfBytes = await createPdf(tabTitle, kpiData, graphData);
        
        response.setHeader("Content-Type", "application/pdf");
        response.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
        response.send(Buffer.from(pdfBytes));
        
      } else if (format === "xls") {
        // --- Excel Generation Logic ---
        const excelBuffer = await createExcel(tabTitle, kpiData, graphData);

        response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", 'attachment; filename="report.xlsx"');
        response.send(excelBuffer);
      }

    } catch (error) {
      logger.error("Error during report generation:", error);
      response.status(500).send("An internal error occurred.");
    }
  }
);


// --- PDF Helper Function ---
async function createPdf(title: string, kpis: IKpi[], graphData: IGraphData[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  page.drawText(title, { x: 50, y, font: boldFont, size: 24, color: rgb(0.1, 0.1, 0.1) });
  y -= 40;

  // KPIs Section
  page.drawText("Key Performance Indicators", { x: 50, y, font: boldFont, size: 16 });
  y -= 25;
  for (const kpi of kpis) {
    page.drawText(`${kpi.name}: ${kpi.value} (Trend: ${kpi.trend})`, { x: 60, y, font, size: 12 });
    y -= 20;
  }
  
  y -= 20;

  // Graph Data Section
  page.drawText("Monthly Data", { x: 50, y, font: boldFont, size: 16 });
  y -= 25;
  for (const data of graphData) {
    page.drawText(`- ${data.month}: Revenue €${data.revenue} / Expenses €${data.expenses}`, { x: 60, y, font, size: 12 });
    y -= 20;
  }

  return pdfDoc.save();
}

// --- Excel Helper Function ---
async function createExcel(title: string, kpis: IKpi[], graphData: IGraphData[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Firebase Cloud Function";
  workbook.created = new Date();

  // KPIs Sheet
  const kpiSheet = workbook.addWorksheet("KPIs");
  kpiSheet.columns = [
    { header: "Metric", key: "name", width: 25 },
    { header: "Value", key: "value", width: 20 },
    { header: "Trend", key: "trend", width: 15 },
  ];
  kpiSheet.addRows(kpis);

  // Graph Data Sheet
  const graphSheet = workbook.addWorksheet("Monthly Data");
  graphSheet.columns = [
    { header: "Month", key: "month", width: 20 },
    { header: "Revenue (€)", key: "revenue", width: 15, style: { numFmt: "#,##0.00" } },
    { header: "Expenses (€)", key: "expenses", width: 15, style: { numFmt: "#,##0.00" } },
  ];
  graphSheet.addRows(graphData);
  
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
