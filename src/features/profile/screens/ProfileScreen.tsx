import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Container } from '../../../components/layout/Container';
import { Screen } from '../../../components/layout/Screen';
import { Spacer } from '../../../components/layout/Spacer';
import { BodyText } from '../../../components/typography/BodyText';
import { Heading } from '../../../components/typography/Heading';
import { Text } from '../../../components/typography/Text';
import { useAuthStore } from '../../auth/store/authStore';
import { useTheme } from '../../../theme/ThemeProvider';

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const user = useAuthStore(state => state.user);

  return (
    <Screen scrollable>
      <Container style={styles.container}>
        <Spacer size="xl" />
        <Heading level="h1">User Profile 👤</Heading>
        <Spacer size="md" />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border.default,
              borderRadius: theme.radius.lg,
              ...theme.shadows.medium,
            },
          ]}>
          <Image
            source={{
              uri:
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
            }}
            style={[styles.avatar, { borderRadius: theme.radius.full }]}
          />
          <Spacer size="md" />
          <Heading level="h2">{user?.fullName || 'Guest User'}</Heading>
          <BodyText color={theme.colors.text.secondary}>{user?.email || 'N/A'}</BodyText>

          <Spacer size="md" />

          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.brand.primary, borderRadius: theme.radius.full },
            ]}>
            <Text size={12} weight="700" color={theme.colors.text.inverse}>
              ROLE: {(user?.role || 'user').toUpperCase()}
            </Text>
          </View>
        </View>
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  card: {
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
});
