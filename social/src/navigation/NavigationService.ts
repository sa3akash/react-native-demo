import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
} from '@react-navigation/native';
import { RootStackParamList } from './types';

/**
 * Global Navigation Container Reference
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Type-safe global navigation methods
 */
class NavigationService {
  /**
   * Check if navigation container is ready
   */
  public isReady(): boolean {
    return navigationRef.isReady();
  }

  /**
   * Navigate to a screen with fully type-checked params
   */
  public navigate<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    ...params: RootStackParamList[RouteName] extends undefined
      ? [undefined?]
      : [RootStackParamList[RouteName]]
  ): void {
    if (navigationRef.isReady()) {
      (navigationRef.navigate as any)(name, params[0]);
    } else {
      console.warn(`[NavigationService] Cannot navigate to "${String(name)}": NavigationContainer not ready.`);
    }
  }

  /**
   * Push a screen onto the stack
   */
  public push<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name as string, params));
    }
  }

  /**
   * Replace current screen on stack
   */
  public replace<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.replace(name as string, params));
    }
  }

  /**
   * Reset navigation state to a specific route
   */
  public reset(routes: Array<{ name: keyof RootStackParamList; params?: any }>, index = 0): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index,
          routes,
        })
      );
    }
  }

  /**
   * Go back to previous screen
   */
  public goBack(): void {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }

  /**
   * Pop all screens back to the top root of the stack
   */
  public popToTop(): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.popToTop());
    }
  }

  /**
   * Pop N screens
   */
  public pop(count: number = 1): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(count));
    }
  }

  /**
   * Get name of currently focused route
   */
  public getCurrentRouteName(): string | undefined {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name;
    }
    return undefined;
  }

  /**
   * Check if can go back
   */
  public canGoBack(): boolean {
    return navigationRef.isReady() && navigationRef.canGoBack();
  }
}

export const navigationService = new NavigationService();
