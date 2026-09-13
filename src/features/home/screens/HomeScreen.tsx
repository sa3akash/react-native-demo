import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Image, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Container } from '../../../components/layout/Container';
import { SafeAreaScreen } from '../../../components/layout/SafeAreaScreen';
import { Spacer } from '../../../components/layout/Spacer';

import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { BodyText } from '../../../components/typography/BodyText';
import { Heading } from '../../../components/typography/Heading';
import { Text } from '../../../components/typography/Text';
import { QUERY_KEYS } from '../../../constants';
import { useAppNavigation } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { Product, productApi } from '../api/productApi';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useAppNavigation();
  const [page] = useState(1);

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST({ page }),
    queryFn: () => productApi.getProducts(page),
  });

  const renderProductItem = ({ item }: { item: Product }) => (
    <Pressable
      onPress={() =>
        navigation.navigate('App', {
          screen: 'ProductDetail',
          params: { productId: item.id, title: item.name },
        })
      }
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border.default,
          borderRadius: theme.radius.md,
          ...theme.shadows.small,
        },
        pressed && { opacity: 0.85 },
      ]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.cardImage, { borderRadius: theme.radius.sm }]}
      />
      <View style={styles.cardContent}>
        <Text size={12} weight="700" color={theme.colors.brand.primary}>
          {item.category.toUpperCase()}
        </Text>
        <Text size={16} weight="600" color={theme.colors.text.primary} numberOfLines={1}>
          {item.name}
        </Text>
        <Spacer size="xs" />
        <View style={styles.cardRow}>
          <Text size={16} weight="700" color={theme.colors.text.primary}>
            ${item.price}
          </Text>
          <Text size={14} color={theme.colors.status.warning}>
            ★ {item.rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaScreen style={styles.screen}>
      <Container style={styles.headerContainer}>
        <Spacer size="md" />
        <Heading level="h2">Enterprise Marketplace 📦</Heading>
        <BodyText color={theme.colors.text.secondary}>
          High performance FlashList integration
        </BodyText>
        <Spacer size="md" />
      </Container>

      {isLoading ? (
        <Container style={styles.skeletonContainer}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton width={80} height={80} borderRadius={12} />
              <View style={styles.skeletonTextWrapper}>
                <Skeleton width="60%" height={16} />
                <Spacer size="xs" />
                <Skeleton width="90%" height={20} />
                <Spacer size="xs" />
                <Skeleton width="40%" height={16} />
              </View>
            </View>
          ))}
        </Container>
      ) : isError ? (
        <ErrorState message={error?.message || 'Failed to load products'} onRetry={refetch} />
      ) : !data?.items.length ? (
        <EmptyState
          title="No Products Available"
          description="Check back later for new enterprise products."
          onAction={refetch}
          actionLabel="Refresh Feed"
        />
      ) : (
        <FlashList
          data={data.items}
          renderItem={renderProductItem}
          estimatedItemSize={110}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.brand.primary}
            />
          }
        />
      )}
    </SafeAreaScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardImage: {
    width: 86,
    height: 86,
    backgroundColor: '#E2E8F0',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },
  skeletonCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
  },
  skeletonTextWrapper: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
});
