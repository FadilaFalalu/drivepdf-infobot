import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react-native";
import { PdfSearchResult } from "@/types/pdf";
import Colors from "@/constants/colors";
import HighlightedText from "./HighlightedText";

interface PdfResultCardProps {
  pdf: PdfSearchResult;
}

export default function PdfResultCard({ pdf }: PdfResultCardProps) {
  const [showParagraphs, setShowParagraphs] = useState(false);
  
  const handleOpenPdf = () => {
    Linking.openURL(pdf.url).catch((err) => console.error("Error opening URL:", err));
  };

  const toggleParagraphs = () => {
    setShowParagraphs(!showParagraphs);
  };

  return (
    <Pressable style={styles.container} onPress={handleOpenPdf}>
      <View style={styles.iconContainer}>
        <FileText size={32} color={Colors.light.tint} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{pdf.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {pdf.description}
        </Text>
        <Text style={styles.keywords}>Keywords: {pdf.keywords.join(", ")}</Text>
        
        {pdf.matchingParagraphs.length > 0 && (
          <Pressable style={styles.paragraphToggle} onPress={toggleParagraphs}>
            {showParagraphs ? (
              <ChevronUp size={16} color={Colors.light.tint} />
            ) : (
              <ChevronDown size={16} color={Colors.light.tint} />
            )}
            <Text style={styles.paragraphToggleText}>
              {showParagraphs ? 'Hide' : 'Show'} {pdf.matchingParagraphs.length} matching paragraph{pdf.matchingParagraphs.length !== 1 ? 's' : ''}
            </Text>
          </Pressable>
        )}
        
        {showParagraphs && pdf.matchingParagraphs.length > 0 && (
          <View style={styles.paragraphsContainer}>
            {pdf.matchingParagraphs.map((paragraph, index) => (
              <View key={index} style={styles.paragraphItem}>
                <Text style={styles.paragraphLabel}>Paragraph {paragraph.paragraphIndex + 1}:</Text>
                <HighlightedText 
                  text={paragraph.highlightedText} 
                  style={styles.paragraphText}
                />
                <Text style={styles.matchedKeywords}>
                  Matched: {paragraph.matchedKeywords.join(', ')}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.leftFooter}>
            <Text style={styles.date}>{pdf.lastModified}</Text>
            {pdf.relevanceScore > 0 && (
              <Text style={styles.relevanceScore}>Score: {pdf.relevanceScore}</Text>
            )}
          </View>
          <Pressable style={styles.openButton} onPress={handleOpenPdf}>
            <ExternalLink size={14} color={Colors.light.tint} />
            <Text style={styles.openText}>Open PDF</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  keywords: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },
  paragraphToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  paragraphToggleText: {
    fontSize: 13,
    color: Colors.light.tint,
    fontWeight: '500',
    marginLeft: 4,
  },
  paragraphsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paragraphItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.tint,
  },
  paragraphLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  paragraphText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#333',
    marginBottom: 4,
  },
  matchedKeywords: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  relevanceScore: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '500',
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  openText: {
    fontSize: 13,
    color: Colors.light.tint,
    fontWeight: "500",
    marginLeft: 4,
  },
});