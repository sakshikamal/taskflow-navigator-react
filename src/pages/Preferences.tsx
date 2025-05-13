import { useState, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const libraries = ['places'] as const;

const GOOGLE_MAPS_API_KEY = 'AIzaSyC_Dz0XtugoW2odkRb-QGaMT96bA0y9YJs';
export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load the Google Maps JS API (make sure REACT_APP_GOOGLE_MAPS_API_KEY is set)
 const { isLoaded, loadError } = useJsApiLoader({
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  libraries,
});


  // form state
  const [transportMode, setTransportMode]         = useState<string>('driving');
  const [workHours, setWorkHours]                = useState<string>('');
  const [prioritizationStyle, setPrioritization] = useState<string>('balanced');

  // address + coords
  const [homeAddress, setHomeAddress]     = useState<string>('');
  const [homeLat, setHomeLat]             = useState<number | null>(null);
  const [homeLng, setHomeLng]             = useState<number | null>(null);

  const [storeAddress, setStoreAddress]   = useState<string>('');
  const [storeLat, setStoreLat]           = useState<number | null>(null);
  const [storeLng, setStoreLng]           = useState<number | null>(null);

  // refs for the Autocomplete instances
  const homeAutoRef  = useRef<google.maps.places.Autocomplete>();
  const storeAutoRef = useRef<google.maps.places.Autocomplete>();

  const onLoadHome = (ac: google.maps.places.Autocomplete) => {
    homeAutoRef.current = ac;
  };
  const onPlaceChangedHome = () => {
    const place = homeAutoRef.current!.getPlace();
    if (!place.geometry?.location) return;
    setHomeAddress(place.formatted_address || '');
    setHomeLat(place.geometry.location.lat());
    setHomeLng(place.geometry.location.lng());
  };

  const onLoadStore = (ac: google.maps.places.Autocomplete) => {
    storeAutoRef.current = ac;
  };
  const onPlaceChangedStore = () => {
    const place = storeAutoRef.current!.getPlace();
    if (!place.geometry?.location) return;
    setStoreAddress(place.formatted_address || '');
    setStoreLat(place.geometry.location.lat());
    setStoreLng(place.geometry.location.lng());
  };

  const travelModes = [
    { label: 'Driving', value: 'driving' },
    { label: 'Walking', value: 'walking' },
    { label: 'Transit',  value: 'transit'  },
  ];

  const prioritizations = [
    { label: 'Important First', value: 'important_first' },
    { label: 'Quick Wins',      value: 'quick_wins'      },
    { label: 'Balanced',        value: 'balanced'        },
  ];

  const workHoursMap: Record<string,[string,string]> = {
    '9AM–5PM':  ['09:00','17:00'],
    '8AM–4PM':  ['08:00','16:00'],
    '10AM–6PM': ['10:00','18:00'],
    'Flexible': [null,     null    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [ work_start_time, work_end_time ] = workHoursMap[workHours] || [null,null];

    const payload: any = {
      travel_mode:                transportMode,
      prioritization_style:       prioritizationStyle,
      home_address:               homeAddress,
      home_lat:                   homeLat,
      home_lng:                   homeLng,
      favorite_store_address:     storeAddress,
      favorite_store_lat:         storeLat,
      favorite_store_lng:         storeLng,
    };
    if (work_start_time && work_end_time) {
      payload.work_start_time = work_start_time;
      payload.work_end_time   = work_end_time;
    }

    try {
      const resp = await fetch('http://localhost:8888/preferences', {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(payload),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || resp.statusText);
      }
      toast({ title: 'Saved!', description: 'Your preferences were stored.' });
      navigate('/homepage');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded)  return <p>Loading maps…</p>;

  return (
    <div className="min-h-screen bg-calroute-lightGreen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome to CalRoute!</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transport Mode */}
          <div>
            <label className="block mb-2 font-medium">How do you usually get around?</label>
            <div className="space-y-2">
              {travelModes.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full p-3 border rounded-md ${
                    transportMode === opt.value
                      ? 'bg-calroute-lightBlue border-calroute-blue'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setTransportMode(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Work Hours */}
          <div>
            <label className="block mb-2 font-medium">Typical Work Hours</label>
            <select
              value={workHours}
              onChange={e => setWorkHours(e.target.value)}
              className="w-full border rounded-md p-3 bg-gray-50"
            >
              <option value="">Select work hours</option>
              {Object.keys(workHoursMap).map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>

          {/* Prioritization */}
          <div>
            <label className="block mb-2 font-medium">Task Prioritization</label>
            <div className="space-y-2">
              {prioritizations.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full p-3 border rounded-md ${
                    prioritizationStyle === opt.value
                      ? 'bg-calroute-lightBlue border-calroute-blue'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setPrioritization(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Home Address Autocomplete */}
          <div>
            <label className="block mb-2 font-medium">Your Home Address</label>
            <Autocomplete
              onLoad={onLoadHome}
              onPlaceChanged={onPlaceChangedHome}
            >
              <input
                type="text"
                placeholder="Start typing address…"
                value={homeAddress}
                onChange={e => setHomeAddress(e.target.value)}
                className="w-full border rounded-md p-3 bg-gray-50"
              />
            </Autocomplete>
          </div>

          {/* Grocery Store Autocomplete */}
          <div>
            <label className="block mb-2 font-medium">Favorite Grocery Store</label>
            <Autocomplete
              onLoad={onLoadStore}
              onPlaceChanged={onPlaceChangedStore}
            >
              <input
                type="text"
                placeholder="Start typing store name…"
                value={storeAddress}
                onChange={e => setStoreAddress(e.target.value)}
                className="w-full border rounded-md p-3 bg-gray-50"
              />
            </Autocomplete>
          </div>

          {/* Submit */}
          <div className="text-center mt-8">
            <Button type="submit" className="px-12 py-4 text-lg bg-calroute-blue text-white">
              SUBMIT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}