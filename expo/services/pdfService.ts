import { PdfDocument, PdfSearchResult, MatchingParagraph } from "@/types/pdf";
import { mockPdfDocuments } from "@/mocks/pdfData";

// Simulated delay to mimic API call
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Highlight keywords in text
 */
function highlightKeywords(text: string, keywords: string[]): string {
  let highlightedText = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlightedText = highlightedText.replace(regex, '**$1**');
  });
  return highlightedText;
}

/**
 * Find matching paragraphs in PDF content
 */
function findMatchingParagraphs(
  content: string[] | undefined,
  keywords: string[]
): MatchingParagraph[] {
  if (!content) return [];

  const matchingParagraphs: MatchingParagraph[] = [];

  content.forEach((paragraph, index) => {
    const lowerParagraph = paragraph.toLowerCase();
    const matchedKeywords = keywords.filter((keyword) =>
      lowerParagraph.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      matchingParagraphs.push({
        text: paragraph,
        paragraphIndex: index,
        matchedKeywords,
        highlightedText: highlightKeywords(paragraph, matchedKeywords),
      });
    }
  });

  return matchingParagraphs;
}

/**
 * Calculate relevance score based on matches
 */
function calculateRelevanceScore(
  pdf: PdfDocument,
  keywords: string[],
  matchingParagraphs: MatchingParagraph[]
): number {
  let score = 0;

  // Title matches (highest weight)
  keywords.forEach((keyword) => {
    if (pdf.title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 10;
    }
  });

  // Description matches (medium weight)
  keywords.forEach((keyword) => {
    if (pdf.description.toLowerCase().includes(keyword.toLowerCase())) {
      score += 5;
    }
  });

  // Keyword matches (medium weight)
  keywords.forEach((keyword) => {
    if (pdf.keywords.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))) {
      score += 5;
    }
  });

  // Content paragraph matches (lower weight but cumulative)
  score += matchingParagraphs.length * 2;

  // Bonus for multiple keyword matches in same paragraph
  matchingParagraphs.forEach((paragraph) => {
    if (paragraph.matchedKeywords.length > 1) {
      score += paragraph.matchedKeywords.length;
    }
  });

  return score;
}

/**
 * Search for PDF documents based on keywords with paragraph matching
 * In a real app, this would make an API call to a backend service
 * that interfaces with Google Drive API
 */
export async function searchPdfsByKeywords(keywords: string[]): Promise<PdfSearchResult[]> {
  // Simulate network delay
  await delay(1500);

  if (keywords.length === 0) {
    return [];
  }

  const results: PdfSearchResult[] = [];

  mockPdfDocuments.forEach((pdf) => {
    // Check if any keyword matches in title, description, keywords, or content
    const titleMatch = keywords.some((keyword) =>
      pdf.title.toLowerCase().includes(keyword.toLowerCase())
    );
    const descriptionMatch = keywords.some((keyword) =>
      pdf.description.toLowerCase().includes(keyword.toLowerCase())
    );
    const keywordMatch = keywords.some((keyword) =>
      pdf.keywords.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))
    );

    const matchingParagraphs = findMatchingParagraphs(pdf.content, keywords);
    const contentMatch = matchingParagraphs.length > 0;

    if (titleMatch || descriptionMatch || keywordMatch || contentMatch) {
      const relevanceScore = calculateRelevanceScore(pdf, keywords, matchingParagraphs);

      results.push({
        ...pdf,
        matchingParagraphs,
        relevanceScore,
      });
    }
  });

  // Sort by relevance score (highest first)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
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