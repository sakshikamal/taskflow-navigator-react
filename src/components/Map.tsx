// src/components/Map.tsx
import React, { useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const libraries = ['places'] as const;

interface MapProps {
  routes?: {
    locations: { lat: number; lng: number; title: string }[];
  };
}

export default function Map({ routes }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);
  const [hoveredMarker, setHoveredMarker] = React.useState<number | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (!isLoaded || !routes?.locations?.length) return;
    const bounds = new window.google.maps.LatLngBounds();
    routes.locations.forEach(location => {
      bounds.extend(location);
    });
    map.fitBounds(bounds);
  }, [isLoaded, routes]);

  React.useEffect(() => {
    if (!isLoaded || !routes?.locations?.length) return;

    const origin = routes.locations[0];
    const destination = routes.locations[routes.locations.length - 1];
    const waypoints = routes.locations.slice(1, -1).map(loc => ({
      location: new window.google.maps.LatLng(loc.lat, loc.lng),
      stopover: true,
    }));

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        waypoints,
        optimizeWaypoints: false,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Directions request failed due to', status);
        }
      }
    );
  }, [isLoaded, routes]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      zoom={12}
      onLoad={onLoad}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {routes?.locations.map((location, index) => (
        <Marker
          key={index}
          position={location}
          title={location.title}
        />
      ))}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}
