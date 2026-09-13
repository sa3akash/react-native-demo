import { useState, useCallback } from 'react';

export interface PickedMedia {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  duration?: number;
}

export function useMediaPicker() {
  const [selectedMedia, setSelectedMedia] = useState<PickedMedia[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const pickImage = useCallback(async (allowMultiple = false): Promise<PickedMedia[]> => {
    setIsCompressing(true);
    // Functional mock media picker
    return new Promise((resolve) => {
      setTimeout(() => {
        const picked: PickedMedia[] = [
          {
            uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            type: 'image',
            fileName: 'photo_demo.jpg',
            fileSize: 1024 * 1024 * 2.4,
            width: 1920,
            height: 1080,
          },
        ];
        setSelectedMedia((prev) => (allowMultiple ? [...prev, ...picked] : picked));
        setIsCompressing(false);
        resolve(picked);
      }, 400);
    });
  }, []);

  const pickVideo = useCallback(async (): Promise<PickedMedia | null> => {
    setIsCompressing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const video: PickedMedia = {
          uri: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          type: 'video',
          fileName: 'video_clip.mp4',
          fileSize: 1024 * 1024 * 12,
          duration: 35,
        };
        setSelectedMedia([video]);
        setIsCompressing(false);
        resolve(video);
      }, 500);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMedia([]);
  }, []);

  const removeMedia = useCallback((index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    selectedMedia,
    isCompressing,
    pickImage,
    pickVideo,
    clearSelection,
    removeMedia,
  };
}
