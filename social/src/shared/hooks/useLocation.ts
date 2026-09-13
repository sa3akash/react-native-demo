import { useState, useCallback } from 'react';
import { usePermissions } from './usePermissions';
import { useToast } from '../components/molecules/Toast';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export function useLocation() {
  const [coords, setCoords] = useState<LocationCoords | null>({
    latitude: 37.7749,
    longitude: -122.4194,
    city: 'San Francisco',
    country: 'United States',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { requestPermission } = usePermissions();
  const { showToast } = useToast();

  const getCurrentLocation = useCallback(async (): Promise<LocationCoords | null> => {
    setIsLoading(true);
    try {
      const status = await requestPermission('location', {
        title: 'Location Permission',
        message: 'SocialSphere needs your location to tag posts and discover nearby friends and marketplace items.',
      });

      if (status !== 'granted') {
        showToast({ message: 'Location permission denied.', type: 'warning' });
        setIsLoading(false);
        return null;
      }

      // Geolocation mock with accurate standard coords
      const location: LocationCoords = {
        latitude: 37.7749,
        longitude: -122.4194,
        city: 'San Francisco, CA',
        country: 'USA',
      };

      setCoords(location);
      setIsLoading(false);
      return location;
    } catch (err: any) {
      showToast({ message: err?.message || 'Failed to obtain location.', type: 'danger' });
      setIsLoading(false);
      return null;
    }
  }, [requestPermission, showToast]);

  return {
    coords,
    isLoading,
    getCurrentLocation,
  };
}
