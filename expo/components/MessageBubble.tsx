import React from "react";
import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { ExternalLink } from "lucide-react-native";
import { Message } from "@/types/chat";
import Colors from "@/constants/colors";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {message.content}
        </Text>
      </View>

      {message.pdfs && message.pdfs.length > 0 && (
        <View style={styles.pdfResultsContainer}>
          {message.pdfs.map((pdf) => (
            <View key={pdf.id} style={styles.pdfCard}>
              <View style={styles.pdfInfo}>
                <Text style={styles.pdfTitle}>{pdf.title}</Text>
                <Text style={styles.pdfDescription} numberOfLines={2}>
                  {pdf.description}
                </Text>
                <Text style={styles.pdfKeywords}>
                  Keywords: {pdf.keywords.join(", ")}
                </Text>
              </View>
              <Pressable
                style={styles.pdfLinkButton}
                onPress={() => handleLinkPress(pdf.url)}
              >
                <ExternalLink size={18} color={Colors.light.tint} />
                <Text style={styles.pdfLinkText}>Open</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  botContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: Colors.light.tint,
  },
  botBubble: {
    backgroundColor: "#e5e5ea",
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#000",
  },
  pdfResultsContainer: {
    marginTop: 8,
  },
  pdfCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  pdfDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  pdfKeywords: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  pdfLinkButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  pdfLinkText: {
    fontSize: 12,
    color: Colors.light.tint,
    marginTop: 4,
  },
});