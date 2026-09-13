import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { ScreenWrapper, Header, useTheme } from "../../../design-system";
import { mockApi } from "../../../core/api/mockApi";
import { Category } from "../../../core/api/mockData";
import { CategoryId } from "../../../shared/types/branded";

export interface CategoriesScreenProps {
  onSelectCategory: (id: CategoryId, name: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ onSelectCategory }) => {
  const { colors, spacing, typography, radius } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    mockApi.getCategories().then((res: any) => setCategories(res.data));  
  }, []);

  return (
    <ScreenWrapper>
      <Header title="All Departments & Categories" />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectCategory(item.id, item.name)}
            style={[
              styles.categoryCard,
              { backgroundColor: colors.card, borderColor: colors.borderSubtle, borderRadius: radius.md },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="cover" />
            <View style={styles.cardOverlay}>
              <Text style={[typography.h3, { color: "#FFFFFF", textAlign: "center", fontWeight: "700" }]}>
                {item.name}
              </Text>
              <Text style={[typography.caption, { color: "#E0E0E0", textAlign: "center", marginTop: 2 }]}>
                {item.itemCount.toLocaleString()} Products
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    flex: 1,
    height: 140,
    margin: 6,
    overflow: "hidden",
    position: "relative",
    elevation: 3,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});
