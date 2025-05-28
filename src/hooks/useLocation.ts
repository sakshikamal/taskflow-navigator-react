import { useState, useEffect } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        if (status.state === 'granted') {
          getCurrentLocation();
        } else if (status.state === 'prompt') {
          // Request permission
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: position.timestamp
              });
              setIsLoading(false);
            },
            (error) => {
              setError(error.message);
              setIsLoading(false);
            }
          );
        } else {
          setError('Location permission denied');
        }
      } catch (err) {
        setError('Error checking location permission');
      }
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  };

  return {
    location,
    error,
    isLoading,
    getCurrentLocation
  };
};
