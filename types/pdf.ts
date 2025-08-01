export interface PdfDocument {
  id: string;
  title: string;
  description: string;
  url: string;
  keywords: string[];
  lastModified: string;
  fileSize?: string;
}