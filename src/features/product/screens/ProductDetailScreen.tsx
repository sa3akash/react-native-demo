import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../../components/buttons/Button';
import { Container } from '../../../components/layout/Container';
import { Screen } from '../../../components/layout/Screen';
import { Spacer } from '../../../components/layout/Spacer';
import { BodyText } from '../../../components/typography/BodyText';
import { Heading } from '../../../components/typography/Heading';
import { AppStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId, title } = route.params;
  const { theme } = useTheme();

  return (
    <Screen scrollable>
      <Container style={styles.container}>
        <Spacer size="lg" />
        <Heading level="h1">{title || 'Product Detail'}</Heading>
        <BodyText color={theme.colors.brand.primary}>ID: {productId}</BodyText>

        <Spacer size="lg" />

        <View
          style={[
            styles.detailBox,
            { backgroundColor: theme.colors.background.secondary, borderRadius: theme.radius.md },
          ]}>
          <BodyText color={theme.colors.text.secondary}>
            This screen demonstrates strongly-typed parameter passing across navigators (RootStack
            &rarr; AppStack &rarr; ProductDetail) without using any or explicit casting.
          </BodyText>
        </View>

        <Spacer size="xl" />

        <Button title="Back to Marketplace" onPress={() => navigation.goBack()} variant="outline" />
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  detailBox: {
    padding: 16,
  },
});
