import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Stack } from "expo-router";
import { Search as SearchIcon, X } from "lucide-react-native";
import { usePdfSearch } from "@/hooks/usePdfSearch";
import PdfResultCard from "@/components/PdfResultCard";
import Colors from "@/constants/colors";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchPdfs, results, isLoading, hasSearched, searchKeywords } = usePdfSearch();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchPdfs(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Stack.Screen options={{ title: "PDF Search" }} />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <SearchIcon size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for PDFs by keyword..."
              placeholderTextColor="#888"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={clearSearch} style={styles.clearButton}>
                <X size={18} color="#888" />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.searchButton, !searchQuery.trim() && styles.disabledButton]}
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
            <Text style={styles.loadingText}>Searching Google Drive...</Text>
          </View>
        ) : hasSearched ? (
          results.length > 0 ? (
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  Found {results.length} PDF{results.length !== 1 ? 's' : ''}
                </Text>
                {searchKeywords.length > 0 && (
                  <Text style={styles.searchKeywords}>
                    Keywords: {searchKeywords.join(', ')}
                  </Text>
                )}
              </View>
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PdfResultCard pdf={item} />}
                contentContainerStyle={styles.resultsContainer}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No PDFs Found</Text>
              <Text style={styles.emptyText}>
                Try different keywords or check your Google Drive permissions.
              </Text>
            </View>
          )
        ) : (
          <View style={styles.initialContainer}>
            <SearchIcon size={60} color="#ccc" />
            <Text style={styles.initialText}>
              Search for PDFs in your Google Drive by entering keywords above
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  clearButton: {
    padding: 6,
  },
  searchButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#b0c4de",
  },
  resultsHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  searchKeywords: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  resultsContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  initialText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 16,
    maxWidth: 300,
  },
});