import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button, SegmentedControl } from '../../shared/components';
import { usePageStore, PageType } from '../../store/usePageStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface CreatePageModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (pageId: string) => void;
}

const PAGE_TYPES = [
  { id: 'business', label: '💼 Business' },
  { id: 'creator', label: '🎨 Creator' },
  { id: 'organization', label: '🏛️ Org' },
];

const CreatePageModalComponent: React.FC<CreatePageModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { colors } = useTheme();
  const createPage = usePageStore((state) => state.createPage);
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology & Software');
  const [pageType, setPageType] = useState<PageType>('business');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      showToast({ message: 'Please enter a Page name.', type: 'warning' });
      return;
    }

    const pageId = createPage({
      name: name.trim(),
      description: description.trim(),
      category,
      pageType,
      website: website.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
    });

    showToast({ message: `${name} created successfully! 🎉`, type: 'success' });
    setName('');
    setDescription('');
    onClose();
    onCreated?.(pageId);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Create a Page">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Name */}
        <Input
          label="Page Name"
          placeholder="e.g. Acme Cloud Corp or Jane Doe Studio"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        {/* Page Type Selector */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 6, marginBottom: 4 }}>
          Page Type
        </Typography>
        <SegmentedControl
          segments={PAGE_TYPES}
          activeId={pageType}
          onSelect={(id) => setPageType(id as PageType)}
          size="sm"
        />

        {/* Category */}
        <Input
          label="Category / Industry"
          placeholder="e.g. AI & SaaS, Visual Artist, Non-Profit"
          value={category}
          onChangeText={setCategory}
        />

        {/* Description */}
        <Input
          label="Bio / Description"
          placeholder="Describe your brand, services, or creative work..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Website & Contact */}
        <Input
          label="Official Website (Optional)"
          placeholder="https://..."
          value={website}
          onChangeText={setWebsite}
        />

        <Input
          label="Business Email (Optional)"
          placeholder="contact@company.com"
          value={email}
          onChangeText={setEmail}
        />

        {pageType === 'business' && (
          <Input
            label="Headquarters / Store Address (Optional)"
            placeholder="e.g. 500 Howard St, San Francisco, CA"
            value={address}
            onChangeText={setAddress}
          />
        )}

        <Button
          label="Create Page"
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

export const CreatePageModal = memo(CreatePageModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
});
