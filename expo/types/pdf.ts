export interface PdfDocument {
  id: string;
  title: string;
  description: string;
  url: string;
  keywords: string[];
  lastModified: string;
  fileSize?: string;
  content?: string[];
}

export interface PdfSearchResult extends PdfDocument {
  matchingParagraphs: MatchingParagraph[];
  relevanceScore: number;
}

export interface MatchingParagraph {
  text: string;
  paragraphIndex: number;
  matchedKeywords: string[];
  highlightedText: string;
}