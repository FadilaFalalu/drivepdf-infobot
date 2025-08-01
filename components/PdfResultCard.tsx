import React from "react";
import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { FileText, ExternalLink } from "lucide-react-native";
import { PdfDocument } from "@/types/pdf";
import Colors from "@/constants/colors";

interface PdfResultCardProps {
  pdf: PdfDocument;
}

export default function PdfResultCard({ pdf }: PdfResultCardProps) {
  const handleOpenPdf = () => {
    Linking.openURL(pdf.url).catch((err) => console.error("Error opening URL:", err));
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
        <View style={styles.footer}>
          <Text style={styles.date}>{pdf.lastModified}</Text>
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
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