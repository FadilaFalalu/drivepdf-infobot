import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "@/types/chat";
import { PdfDocument } from "@/types/pdf";
import { searchPdfsByKeywords } from "@/services/pdfService";

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from storage on initial load
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem("chatMessages");
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          // Add welcome message if no stored messages
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            content:
              "Hello! I'm your PDF Search Assistant. I can help you find PDFs in your Google Drive based on keywords. What would you like to search for?",
            role: "assistant",
            timestamp: new Date().toISOString(),
          };
          setMessages([welcomeMessage]);
          await AsyncStorage.setItem("chatMessages", JSON.stringify([welcomeMessage]));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        // Add welcome message as fallback
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content:
            "Hello! I'm your PDF Search Assistant. I can help you find PDFs in your Google Drive based on keywords. What would you like to search for?",
          role: "assistant",
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    };

    loadMessages();
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem("chatMessages", JSON.stringify(messages)).catch((error) =>
        console.error("Error saving messages:", error)
      );
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Extract keywords from user message
      const keywords = extractKeywords(text);
      
      // Search for PDFs based on keywords
      const pdfResults = await searchPdfsByKeywords(keywords);
      
      // Create bot response
      let botResponse: Message;
      
      if (pdfResults.length > 0) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `I found ${pdfResults.length} PDF${
            pdfResults.length === 1 ? "" : "s"
          } related to "${keywords.join(", ")}" in your Google Drive:`,
          role: "assistant",
          timestamp: new Date().toISOString(),
          pdfs: pdfResults,
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `I couldn't find any PDFs matching "${keywords.join(
            ", "
          )}" in your Google Drive. Try different keywords or check your Drive permissions.`,
          role: "assistant",
          timestamp: new Date().toISOString(),
        };
      }

      // Add bot response
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Error response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I encountered an error while searching for PDFs. Please try again later.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple keyword extraction (in a real app, this would be more sophisticated)
  const extractKeywords = (text: string): string[] => {
    // Remove common words and punctuation, split by spaces
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .filter(
        (word) =>
          !["the", "and", "for", "pdf", "pdfs", "find", "search", "about", "with", "related"].includes(
            word
          )
      );

    // Return unique keywords
    return [...new Set(words)];
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        inputText,
        setInputText,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}