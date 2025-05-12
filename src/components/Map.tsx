// src/components/Map.tsx
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

//const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const GOOGLE_MAPS_API_KEY = 'AIzaSyC_Dz0XtugoW2odkRb-QGaMT96bA0y9YJs';

interface MapProps {
  routes?: {
    locations: { lat: number; lng: number; title: string }[];
  };
}

export default function Map({ routes }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current || !routes?.locations?.length) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.initMap = () => {
      const locations = routes.locations;

      const map = new window.google.maps.Map(mapContainer.current!, {
        zoom: 12,
        center: locations[0],
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({ map });

      const origin = locations[0];
      const destination = locations[locations.length - 1];
      const waypoints = locations.slice(1, -1).map(loc => ({
        location: { lat: loc.lat, lng: loc.lng },
        stopover: true,
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          optimizeWaypoints: false,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            console.error('Directions request failed due to', status);
          }
        }
      );

      locations.forEach(loc => {
        new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map,
          title: loc.title,
        });
      });
    };

    return () => {
      const scriptElement = document.querySelector(`script[src^="https://maps.googleapis.com"]`);
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      delete window.initMap;
    };
  }, [routes]);

  return (
    <div className="relative h-[400px] w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}
