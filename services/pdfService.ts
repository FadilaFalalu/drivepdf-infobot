import { PdfDocument } from "@/types/pdf";
import { mockPdfDocuments } from "@/mocks/pdfData";

// Simulated delay to mimic API call
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Search for PDF documents based on keywords
 * In a real app, this would make an API call to a backend service
 * that interfaces with Google Drive API
 */
export async function searchPdfsByKeywords(keywords: string[]): Promise<PdfDocument[]> {
  // Simulate network delay
  await delay(1500);

  if (keywords.length === 0) {
    return [];
  }

  // Filter mock data based on keywords
  return mockPdfDocuments.filter((pdf) => {
    // Check if any keyword matches in title, description, or keywords
    return keywords.some(
      (keyword) =>
        pdf.title.toLowerCase().includes(keyword) ||
        pdf.description.toLowerCase().includes(keyword) ||
        pdf.keywords.some((k) => k.toLowerCase().includes(keyword))
    );
  });
}

/**
 * Get a PDF document by ID
 */
export async function getPdfById(id: string): Promise<PdfDocument | null> {
  // Simulate network delay
  await delay(500);

  const pdf = mockPdfDocuments.find((doc) => doc.id === id);
  return pdf || null;
}