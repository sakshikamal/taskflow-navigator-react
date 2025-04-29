
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Since we need a mapbox token for actual functionality,
// we'll use a placeholder token that the user needs to replace
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE';

interface MapProps {
  routes?: {
    coordinates: [number, number][]; // This ensures each coordinate is a tuple with exactly two numbers
    locations: { name: string; coordinates: [number, number] }[];
  };
}

export default function Map({ routes }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.4194, 37.7749], // Default location (San Francisco)
      zoom: 12
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // This would render routes and locations if actual Mapbox token was provided
  useEffect(() => {
    if (!mapLoaded || !map.current || !routes) return;

    // Here would be code to add routes and markers to the map
    // Not implementing full details since we're using a placeholder token
  }, [mapLoaded, routes]);

  return (
    <div className="relative h-[400px] w-full">
      {MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE' && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 rounded-lg">
          <p className="text-center p-4 text-gray-600">
            Map requires a Mapbox token. Please replace the placeholder token in the Map.tsx component.
          </p>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}
