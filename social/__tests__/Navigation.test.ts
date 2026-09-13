import { navigationService } from '../src/navigation/NavigationService';
import { NavigationShortcuts } from '../src/navigation/NavigationShortcuts';
import { linkingConfig } from '../src/navigation/linkingConfig';

describe('Navigation Utilities & Shortcuts Suite', () => {
  test('NavigationService methods are defined and callable', () => {
    expect(typeof navigationService.navigate).toBe('function');
    expect(typeof navigationService.push).toBe('function');
    expect(typeof navigationService.replace).toBe('function');
    expect(typeof navigationService.reset).toBe('function');
    expect(typeof navigationService.goBack).toBe('function');
    expect(typeof navigationService.popToTop).toBe('function');
    expect(typeof navigationService.getCurrentRouteName).toBe('function');
  });

  test('NavigationShortcuts static helper methods are defined', () => {
    expect(typeof NavigationShortcuts.openChat).toBe('function');
    expect(typeof NavigationShortcuts.startVoiceCall).toBe('function');
    expect(typeof NavigationShortcuts.startVideoCall).toBe('function');
    expect(typeof NavigationShortcuts.openStory).toBe('function');
    expect(typeof NavigationShortcuts.openPost).toBe('function');
    expect(typeof NavigationShortcuts.openProfile).toBe('function');
    expect(typeof NavigationShortcuts.openCreatePost).toBe('function');
    expect(typeof NavigationShortcuts.openLiveStream).toBe('function');
    expect(typeof NavigationShortcuts.openGroup).toBe('function');
    expect(typeof NavigationShortcuts.openProduct).toBe('function');
    expect(typeof NavigationShortcuts.openSearch).toBe('function');
    expect(typeof NavigationShortcuts.openSettings).toBe('function');
    expect(typeof NavigationShortcuts.navigateToTab).toBe('function');
  });

  test('linkingConfig contains universal link prefixes and mapped screens', () => {
    expect(linkingConfig.prefixes).toContain('socialsphere://');
    expect(linkingConfig.prefixes).toContain('https://socialsphere.enterprise');
    expect(linkingConfig.config?.screens).toBeDefined();
  });
});
