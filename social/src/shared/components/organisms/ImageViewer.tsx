import React, { memo } from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Typography } from '../atoms/Typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ImageViewerProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
  title?: string;
}

const ImageViewerComponent: React.FC<ImageViewerProps> = ({
  visible,
  imageUrl,
  onClose,
  title,
}) => {
  if (!visible || !imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.headerSafe}>
          <View style={styles.header}>
            <Typography variant="subtitle1" color="#FFFFFF" bold numberOfLines={1}>
              {title || 'Image Preview'}
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close image viewer"
            >
              <Typography variant="h3" color="#FFFFFF">
                ✕
              </Typography>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

export const ImageViewer = memo(ImageViewerComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    padding: 6,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});
