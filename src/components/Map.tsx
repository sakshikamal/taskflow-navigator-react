
// src/components/Map.tsx
import React, { useEffect, useRef } from 'react';

// Extend Window interface to include Google Maps initialization
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Hardcoded coordinates and locations
const orderedLocations = [
  { lat: 33.6473, lng: -117.8412, title: 'Home' }, // Home
  { lat: 33.6502, lng: -117.8313, title: 'Task 1' }, // Task 1
  { lat: 33.6467, lng: -117.8450, title: 'Task 2' }, // Task 2
  { lat: 33.6478, lng: -117.8314, title: 'Task 3' }, // Task 3
];

const GOOGLE_MAPS_API_KEY = 'AIzaSyC_Dz0XtugoW2odkRb-QGaMT96bA0y9YJs';  // Replace with your Google Maps API key

interface MapProps {
  // Make routes prop optional so it can work with or without routes
  routes?: {
    coordinates: [number, number][];
    locations: { name: string; coordinates: [number, number] }[];
  };
}

export default function Map({ routes }: MapProps = {}) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Dynamically load the Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Map initialization function
    window.initMap = () => {
      const map = new window.google.maps.Map(mapContainer.current!, {
        zoom: 12,
        center: orderedLocations[0], // Center map at the first location (Home)
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({ map });

      const origin = orderedLocations[0];
      const destination = orderedLocations[orderedLocations.length - 1];
      const waypoints = orderedLocations.slice(1, -1).map(loc => ({
        location: loc,
        stopover: true,
      }));

      // Route request for directions
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: false, // Already optimized via backend or manually
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

      // Add markers for each location
      orderedLocations.forEach(loc => {
        new window.google.maps.Marker({
          position: loc,
          map: map,
          title: loc.title,
        });
      });
    };

    // Cleanup by removing the script after component unmounts
    return () => {
      // Check if the script exists before attempting to remove it
      const scriptElement = document.querySelector(`script[src^="https://maps.googleapis.com"]`);
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      // Also clean up the global initMap function
      delete window.initMap;
    };
  }, []);

  return (
    <div className="relative h-[400px] w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}
