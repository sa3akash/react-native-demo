import { lightPalette, darkPalette, amoledPalette, materialYouPalette } from '../src/theme/palettes';
import { typography, spacing, radius } from '../src/theme/tokens';
import { LottieAnimation } from '../src/shared/animations/LottieAnimation';
import { FadeInView, ScalePopView } from '../src/shared/animations/MotiTransitions';
import { SharedElement, SharedImage } from '../src/shared/animations/SharedElement';
import {
  Button,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Avatar,
  Badge,
  Card,
  Skeleton,
  Modal,
  BottomSheet,
  Snackbar,
  Toast,
  Alert,
  Dropdown,
  Tooltip,
  EmptyState,
  ErrorState,
  Pagination,
  Tabs,
  SegmentedControl,
  SearchBar,
  ImageViewer,
  VideoPlayer,
  AudioPlayer,
} from '../src/shared/components';

describe('UI Design System & Animations Suite', () => {
  test('all 4 core theme palettes are fully populated with required color tokens', () => {
    const palettes = [lightPalette, darkPalette, amoledPalette, materialYouPalette];

    palettes.forEach((palette) => {
      expect(palette.primary).toBeDefined();
      expect(palette.background).toBeDefined();
      expect(palette.surface).toBeDefined();
      expect(palette.text).toBeDefined();
      expect(palette.reactions.like).toBeDefined();
      expect(palette.gradients.storyRing).toHaveLength(3);
    });
  });

  test('AMOLED palette uses pure true black #000000', () => {
    expect(amoledPalette.background).toBe('#000000');
  });

  test('Typography tokens define modern font scales and line heights', () => {
    expect(typography.h1.fontSize).toBeGreaterThan(typography.h2.fontSize);
    expect(typography.body1.fontSize).toBeGreaterThan(0);
    expect(spacing.md).toBe(12);
    expect(spacing.lg).toBe(16);
    expect(radius.full).toBe(9999);
  });

  test('All 26 Design System components are properly defined and exportable', () => {
    // Atoms (9)
    expect(Button).toBeDefined();
    expect(Input).toBeDefined();
    expect(TextArea).toBeDefined();
    expect(Checkbox).toBeDefined();
    expect(Radio).toBeDefined();
    expect(RadioGroup).toBeDefined();
    expect(Avatar).toBeDefined();
    expect(Badge).toBeDefined();
    expect(Skeleton).toBeDefined();
    expect(Tooltip).toBeDefined();

    // Molecules (13)
    expect(Select).toBeDefined();
    expect(Dropdown).toBeDefined();
    expect(Modal).toBeDefined();
    expect(BottomSheet).toBeDefined();
    expect(Snackbar).toBeDefined();
    expect(Toast).toBeDefined();
    expect(Alert).toBeDefined();
    expect(EmptyState).toBeDefined();
    expect(ErrorState).toBeDefined();
    expect(Pagination).toBeDefined();
    expect(Tabs).toBeDefined();
    expect(SegmentedControl).toBeDefined();
    expect(SearchBar).toBeDefined();

    // Organisms (4)
    expect(Card).toBeDefined();
    expect(ImageViewer).toBeDefined();
    expect(VideoPlayer).toBeDefined();
    expect(AudioPlayer).toBeDefined();
  });

  test('Animation components are defined and exportable', () => {
    expect(LottieAnimation).toBeDefined();
    expect(FadeInView).toBeDefined();
    expect(ScalePopView).toBeDefined();
    expect(SharedElement).toBeDefined();
    expect(SharedImage).toBeDefined();
  });
});
