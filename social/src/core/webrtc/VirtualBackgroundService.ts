export type VirtualBackgroundType =
  | 'none'
  | 'blur_light'
  | 'blur_heavy'
  | 'virtual_office'
  | 'virtual_studio'
  | 'virtual_nature'
  | 'custom_image';

export interface BackgroundPreset {
  id: VirtualBackgroundType;
  label: string;
  previewUrl?: string;
  blurRadius?: number;
  icon: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: 'none', label: 'None', icon: '🚫' },
  { id: 'blur_light', label: 'Slight Blur', blurRadius: 10, icon: '🌫️' },
  { id: 'blur_heavy', label: 'Heavy Blur', blurRadius: 25, icon: '🫧' },
  {
    id: 'virtual_office',
    label: 'Modern Tech Office',
    icon: '🏢',
    previewUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
  },
  {
    id: 'virtual_studio',
    label: 'Neon Cyber Studio',
    icon: '🎙️',
    previewUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
  },
  {
    id: 'virtual_nature',
    label: 'Mountain Vista',
    icon: '🏔️',
    previewUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
  },
];

export class VirtualBackgroundService {
  private static instance: VirtualBackgroundService;
  private currentBackground: VirtualBackgroundType = 'none';
  private customImageUrl?: string;

  private constructor() {}

  public static getInstance(): VirtualBackgroundService {
    if (!VirtualBackgroundService.instance) {
      VirtualBackgroundService.instance = new VirtualBackgroundService();
    }
    return VirtualBackgroundService.instance;
  }

  public getCurrentBackground(): VirtualBackgroundType {
    return this.currentBackground;
  }

  public getCustomImageUrl(): string | undefined {
    return this.customImageUrl;
  }

  /**
   * Apply a virtual background or blur effect to the camera stream
   */
  public applyBackground(type: VirtualBackgroundType, customUrl?: string): void {
    this.currentBackground = type;
    if (type === 'custom_image' && customUrl) {
      this.customImageUrl = customUrl;
    }
  }
}

export const virtualBackgroundService = VirtualBackgroundService.getInstance();
