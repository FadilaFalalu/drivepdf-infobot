import { useState } from "react";
import { PdfSearchResult } from "@/types/pdf";
import { searchPdfsByKeywords } from "@/services/pdfService";

export function usePdfSearch() {
  const [results, setResults] = useState<PdfSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);

  const searchPdfs = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Extract keywords from query
      const keywords = query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .filter(
          (word) =>
            !["the", "and", "for", "pdf", "pdfs", "find", "search", "about", "with"].includes(
              word
            )
        );

      // Search for PDFs based on keywords
      const pdfResults = await searchPdfsByKeywords(keywords);
      setResults(pdfResults);
      setSearchKeywords(keywords);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching PDFs:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchPdfs,
    results,
    isLoading,
    hasSearched,
    searchKeywords,
  };
}