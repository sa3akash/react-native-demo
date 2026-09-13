import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button } from '../../shared/components';
import { useMarketplaceStore, ProductItem } from '../../store/useMarketplaceStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface ChatSellerModalProps {
  visible: boolean;
  product: ProductItem;
  onClose: () => void;
  onNavigateToChat?: (conversationId: string) => void;
}

const TEMPLATE_MESSAGES = [
  'Hi! Is this still available? 😊',
  'Would you take a lower offer?',
  'Can you ship to my address?',
  'Is the price negotiable?',
];

const ChatSellerModalComponent: React.FC<ChatSellerModalProps> = ({
  visible,
  product,
  onClose,
  onNavigateToChat,
}) => {
  const { colors, theme } = useTheme();
  const sendInquiry = useMarketplaceStore((state) => state.sendSellerInquiry);
  const { showToast } = useToast();

  const [messageText, setMessageText] = useState('Hi! Is this still available? 😊');
  const [offerPrice, setOfferPrice] = useState('');

  const handleSend = () => {
    if (!messageText.trim()) return;

    const numericOffer = offerPrice.trim() ? parseFloat(offerPrice) : undefined;
    const convId = sendInquiry(product.id, messageText.trim(), numericOffer);

    showToast({ message: `Message sent to ${product.sellerName}! 💬`, type: 'success' });
    onClose();
    onNavigateToChat?.(convId);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Contact Seller 💬">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Snippet */}
        <View style={[styles.productCard, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
          <Image source={{ uri: product.images[0] }} style={styles.productThumb} resizeMode="cover" />
          <View style={styles.productInfo}>
            <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
              {product.title}
            </Typography>
            <Typography variant="subtitle1" color={colors.primary} bold>
              {product.currency}{product.price.toLocaleString()}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Seller: {product.sellerName} ⭐ {product.sellerRating}
            </Typography>
          </View>
        </View>

        {/* Quick Message Chips */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 12, marginBottom: 6 }}>
          Quick Templates
        </Typography>
        <View style={styles.chipsWrap}>
          {TEMPLATE_MESSAGES.map((tpl) => (
            <TouchableOpacity
              key={tpl}
              activeOpacity={0.8}
              onPress={() => setMessageText(tpl)}
              style={[
                styles.chipPill,
                {
                  backgroundColor: messageText === tpl ? colors.primary : colors.surfaceElevated,
                  borderColor: messageText === tpl ? colors.primary : colors.borderSubtle,
                },
              ]}
            >
              <Typography
                variant="caption"
                color={messageText === tpl ? '#FFFFFF' : colors.text}
                bold
              >
                {tpl}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Make an Offer Input */}
        <View style={{ marginTop: 8 }}>
          <Input
            label="Make an Offer (Optional)"
            placeholder={`Listed price: $${product.price}`}
            value={offerPrice}
            onChangeText={setOfferPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Custom Message Input */}
        <Input
          label="Your Message"
          placeholder="Write a message to the seller..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          numberOfLines={3}
        />

        <Button
          label="Send Message to Seller"
          variant="primary"
          size="lg"
          onPress={handleSend}
          fullWidth
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const ChatSellerModal = memo(ChatSellerModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
  productCard: {
    flexDirection: 'row',
    padding: 10,
    gap: 12,
    alignItems: 'center',
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
});
