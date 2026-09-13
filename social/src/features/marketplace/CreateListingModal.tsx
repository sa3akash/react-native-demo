import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button, SegmentedControl } from '../../shared/components';
import { useMarketplaceStore, ProductCondition } from '../../store/useMarketplaceStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface CreateListingModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (productId: string) => void;
}

const CONDITION_OPTIONS = [
  { id: 'new', label: '✨ New' },
  { id: 'like_new', label: '🌟 Like New' },
  { id: 'good', label: '👍 Good' },
  { id: 'fair', label: 'Fair' },
];

const CreateListingModalComponent: React.FC<CreateListingModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { colors } = useTheme();
  const createListing = useMarketplaceStore((state) => state.createListing);
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState<ProductCondition>('like_new');
  const [location, setLocation] = useState('San Francisco, CA');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      showToast({ message: 'Please enter a product title.', type: 'warning' });
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      showToast({ message: 'Please enter a valid price.', type: 'warning' });
      return;
    }

    const prodId = createListing({
      title: title.trim(),
      price: numPrice,
      category,
      condition,
      location,
      description: description.trim(),
    });

    showToast({ message: `Item "${title}" listed on Marketplace! 🛍️`, type: 'success' });
    setTitle('');
    setPrice('');
    setDescription('');
    onClose();
    onCreated?.(prodId);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="List an Item for Sale">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Input
          label="Item Title"
          placeholder="e.g. Sony WH-1000XM5 Noise Cancelling Headphones"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Price */}
        <Input
          label="Price ($ USD)"
          placeholder="e.g. 299"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {/* Category */}
        <Input
          label="Category"
          placeholder="e.g. Electronics, Vehicles, Furniture, Apparel"
          value={category}
          onChangeText={setCategory}
        />

        {/* Condition */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 6, marginBottom: 4 }}>
          Item Condition
        </Typography>
        <SegmentedControl
          segments={CONDITION_OPTIONS}
          activeId={condition}
          onSelect={(id) => setCondition(id as ProductCondition)}
          size="sm"
        />

        {/* Location */}
        <Input
          label="Location / Neighborhood"
          placeholder="e.g. San Francisco, CA"
          value={location}
          onChangeText={setLocation}
        />

        {/* Description */}
        <Input
          label="Description & Item Details"
          placeholder="Include details on wear, included accessories, reasons for selling..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Button
          label="Publish Listing"
          variant="primary"
          size="lg"
          onPress={handleCreate}
          fullWidth
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const CreateListingModal = memo(CreateListingModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
});
