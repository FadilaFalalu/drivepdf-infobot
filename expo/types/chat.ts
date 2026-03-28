import { PdfDocument } from "./pdf";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  pdfs?: PdfDocument[];
}