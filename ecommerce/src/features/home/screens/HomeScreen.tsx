import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ScreenWrapper, SearchInput, useTheme } from "../../../design-system";
import { mockApi } from "../../../core/api/mockApi";
import { Product, Category } from "../../../core/api/mockData";
import { ProductCard } from "../../products/components/ProductCard";
import { ProductId, CategoryId } from "../../../shared/types/branded";
import { analytics } from "../../../core/analytics/analytics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface HomeScreenProps {
  onNavigateToProduct: (id: ProductId) => void;
  onNavigateToCategory: (id: CategoryId, name: string) => void;
  onNavigateToSearch: () => void;
}

const HERO_BANNERS = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&q=80",
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000&q=80",
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToProduct,
  onNavigateToCategory,
  onNavigateToSearch,
}) => {
  const { colors, spacing, typography, radius } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    analytics.track({ name: "app_opened" });
    mockApi.getProducts().then((res) => setProducts(res.data));
    mockApi.getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleProductPress = (id: ProductId) => {
    analytics.track({ name: "product_viewed", properties: { productId: id } });
    onNavigateToProduct(id);
  };

  const deals = products.filter((p) => p.isDeal);
  const electronics = products.filter((p) => p.categoryId === ("cat_1" as CategoryId));

  return (
    <ScreenWrapper scrollable>
      {/* Top Header Bar */}
      <View style={[styles.headerContainer, { backgroundColor: colors.secondary }]}>
        {/* Delivery Location Bar */}
        <TouchableOpacity style={styles.locationBar} activeOpacity={0.8}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={[typography.caption, styles.locationText]} numberOfLines={1}>
            Deliver to Shakil — Banani, Dhaka 1213 ▾
          </Text>
        </TouchableOpacity>

        {/* Amazon Search Bar */}
        <View style={[styles.searchWrapper, { paddingHorizontal: spacing.md, paddingBottom: spacing.sm }]}>
          <SearchInput
            value=""
            onChangeText={() => {}}
            onFocus={onNavigateToSearch}
            placeholder="Search Amazon.com"
          />
        </View>
      </View>

      {/* Category Shortcut Horizontal Rail */}
      <View style={[styles.categoryRail, { backgroundColor: colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onNavigateToCategory(cat.id, cat.name)}
              style={styles.categoryItem}
            >
              <Image source={{ uri: cat.image }} style={styles.categoryImage} />
              <Text style={[typography.caption, styles.categoryLabel, { color: colors.text }]} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Promotional Hero Banner Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setActiveBannerIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {HERO_BANNERS.map((bannerUrl, idx) => (
            <Image key={idx} source={{ uri: bannerUrl }} style={styles.bannerImage} resizeMode="cover" />
          ))}
        </ScrollView>

        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {HERO_BANNERS.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicatorDot,
                { backgroundColor: idx === activeBannerIndex ? colors.primary : "rgba(255, 255, 255, 0.5)" },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Flash Deals Rail */}
      <View style={[styles.sectionContainer, { paddingHorizontal: spacing.md }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.dealHeaderTitleRow}>
            <Text style={[typography.h2, { color: colors.text }]}>Flash Deals</Text>
            <View style={[styles.timerBadge, { backgroundColor: colors.error, borderRadius: radius.xs }]}>
              <Text style={styles.timerText}>Ends in 04h:28m</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={[typography.caption, styles.seeAllText, { color: colors.info }]}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.railMargin}>
          {deals.map((prod) => (
            <ProductCard key={prod.id} product={prod} onPress={handleProductPress} />
          ))}
        </ScrollView>
      </View>

      {/* Recommended For You Section */}
      <View style={[styles.sectionContainer, { paddingHorizontal: spacing.md }]}>
        <Text style={[typography.h2, styles.sectionTitle, { color: colors.text, marginBottom: spacing.sm }]}>
          Recommended For You
        </Text>
        <View style={styles.gridWrap}>
          {products.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} onPress={handleProductPress} />
          ))}
        </View>
      </View>

      {/* Popular Electronics Rail */}
      <View style={[styles.sectionContainer, { paddingHorizontal: spacing.md }]}>
        <View style={styles.sectionHeader}>
          <Text style={[typography.h2, { color: colors.text }]}>Top Electronics</Text>
          <TouchableOpacity>
            <Text style={[typography.caption, styles.seeAllText, { color: colors.info }]}>Explore</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.railMargin}>
          {electronics.map((prod) => (
            <ProductCard key={prod.id} product={prod} onPress={handleProductPress} />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 8,
  },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  locationPin: {
    marginRight: 6,
    fontSize: 14,
  },
  locationText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  searchWrapper: {
    width: "100%",
  },
  categoryRail: {
    paddingVertical: 12,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    width: 65,
  },
  categoryImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  categoryLabel: {
    marginTop: 4,
    textAlign: "center",
  },
  carouselContainer: {
    height: 180,
    position: "relative",
  },
  bannerImage: {
    width: SCREEN_WIDTH,
    height: 180,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dealHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  seeAllText: {
    fontWeight: "700",
  },
  sectionTitle: {
    fontWeight: "700",
  },
  railMargin: {
    marginTop: 8,
  },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
