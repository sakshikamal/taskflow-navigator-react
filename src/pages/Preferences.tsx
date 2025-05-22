import { useState, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
// Select component from shadcn/ui could be used for a more consistent UI,
// but for minimal changes, we'll stick to styling the native select for now.
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast'; // Corrected import path
import { ChevronDown, Plus, X } from 'lucide-react'; // For select arrow styling and additional icons

const libraries = ['places'] as const;

const GOOGLE_MAPS_API_KEY = 'AIzaSyC_Dz0XtugoW2odkRb-QGaMT96bA0y9YJs';
export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries as any, // Type assertion to fix readonly error
  });

  // form state
  const [transportModes, setTransportModes] = useState<string[]>(['car']);
  const [workHours, setWorkHours] = useState<string>('');
  const [prioritizationStyle, setPrioritization] = useState<string>('balanced');
  const [groceryStores, setGroceryStores] = useState(['']);
  const [gymAddress, setGymAddress] = useState('');
  const [gymLat, setGymLat] = useState<number | null>(null);
  const [gymLng, setGymLng] = useState<number | null>(null);

  // address + coords
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [homeLat, setHomeLat] = useState<number | null>(null);
  const [homeLng, setHomeLng] = useState<number | null>(null);

  const [storeAddress, setStoreAddress] = useState<string>('');
  const [storeLat, setStoreLat] = useState<number | null>(null);
  const [storeLng, setStoreLng] = useState<number | null>(null);

  // refs for the Autocomplete instances
  const homeAutoRef = useRef<google.maps.places.Autocomplete>();
  const storeAutoRefs = useRef<(google.maps.places.Autocomplete | undefined)[]>([]);
  const gymAutoRef = useRef<google.maps.places.Autocomplete>();

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

  const onLoadStore = (ac: google.maps.places.Autocomplete, index: number) => {
    if (!storeAutoRefs.current) {
      storeAutoRefs.current = [];
    }
    storeAutoRefs.current[index] = ac;
  };

  const onPlaceChangedStore = (index: number) => {
    const place = storeAutoRefs.current[index]?.getPlace();
    if (!place?.geometry?.location) return;
    const newStores = [...groceryStores];
    newStores[index] = place.formatted_address || '';
    setGroceryStores(newStores);
  };

  const onLoadGym = (ac: google.maps.places.Autocomplete) => {
    gymAutoRef.current = ac;
  };

  const onPlaceChangedGym = () => {
    const place = gymAutoRef.current!.getPlace();
    if (!place.geometry?.location) return;
    setGymAddress(place.formatted_address || '');
    setGymLat(place.geometry.location.lat());
    setGymLng(place.geometry.location.lng());
  };

  const travelModes = [
    { label: 'Car', value: 'car' },
    { label: 'Bike', value: 'bike' },
    { label: 'Bus/Train', value: 'bus_train' },
    { label: 'Walking', value: 'walking' },
    { label: 'Rideshare', value: 'rideshare' },
  ];

  const prioritizations = [
    { label: 'Important First', value: 'important_first' },
    { label: 'Quick Wins', value: 'quick_wins' },
    { label: 'Balanced', value: 'balanced' },
  ];

  const workHoursMap: Record<string,[string,string]> = {
    '9AM–5PM': ['09:00','17:00'],
    '8AM–4PM': ['08:00','16:00'],
    '10AM–6PM': ['10:00','18:00'],
    'Flexible': [null, null],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [ work_start_time, work_end_time ] = workHoursMap[workHours] || [null,null];

    const payload: any = {
      travel_mode: transportModes[0], // Send first selected mode as primary
      travel_modes: transportModes, // Send all selected modes
      prioritization_style: prioritizationStyle,
      home_address: homeAddress,
      home_lat: homeLat,
      home_lng: homeLng,
      favorite_store_address: storeAddress,
      favorite_store_lat: storeLat,
      favorite_store_lng: storeLng,
    };
    if (work_start_time && work_end_time) {
      payload.work_start_time = work_start_time;
      payload.work_end_time   = work_end_time;
    }

    try {
      const resp = await fetch('http://localhost:8888/preferences', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const toggleTransportation = (option: string) => {
    setTransportModes(prev => {
      if (prev.includes(option)) {
        // Don't remove if it's the last one
        if (prev.length === 1) return prev;
        return prev.filter(mode => mode !== option);
      } else {
        // Don't add if we already have 3
        if (prev.length >= 3) return prev;
        return [...prev, option];
      }
    });
  };

  const addGroceryStore = () => {
    if (groceryStores.length < 3) {
      setGroceryStores([...groceryStores, '']);
    }
  };

  const removeGroceryStore = (index: number) => {
    setGroceryStores(groceryStores.filter((_, i) => i !== index));
  };

  const updateGroceryStore = (index: number, value: string) => {
    const newStores = [...groceryStores];
    newStores[index] = value;
    setGroceryStores(newStores);
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps…</p>;

  return (
    <div className="min-h-screen bg-[rgb(240,248,255)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-start mb-6 sm:mb-8">
          <img 
            src="/uploads/logo.png" 
            alt="CalRoute Logo" 
            className="w-24 h-24 rounded-lg" 
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] bg-clip-text text-transparent">CalRoute</h1>
        </header>
        
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] bg-clip-text text-transparent">Welcome to CalRoute!</CardTitle>
            <CardDescription className="text-xl text-gray-700 pt-2 max-w-2xl mx-auto">
              Help us personalize your schedule by answering a few questions. 
              You can adjust these anytime in your profile settings.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 gap-y-6 p-6">
              {/* Home Address Section */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">What's your home address?</h3>
                <Autocomplete
                  onLoad={onLoadHome}
                  onPlaceChanged={onPlaceChangedHome}
                >
                  <Input
                    type="text"
                    value={homeAddress}
                    onChange={e => setHomeAddress(e.target.value)}
                    className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]"
                    placeholder="Start typing address…"
                  />
                </Autocomplete>
              </div>

              {/* Transportation Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-semibold text-gray-800">How do you usually get around?</h3>
                  <span className="text-sm text-gray-500">Select up to 3</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {travelModes.map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      className={`w-full justify-start py-3 px-4 ${
                        transportModes.includes(option.value)
                          ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" 
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => toggleTransportation(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grocery Stores Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-semibold text-gray-800">Favourite grocery stores</h3>
                  <span className="text-sm text-gray-500">Select up to 3</span>
                </div>
                <div className="space-y-3">
                  {groceryStores.map((store, index) => (
                    <div key={index} className="flex gap-2 w-full">
                      <div className="flex-1">
                        <Autocomplete
                          onLoad={(ac) => onLoadStore(ac, index)}
                          onPlaceChanged={() => onPlaceChangedStore(index)}
                        >
                          <Input
                            value={store}
                            onChange={(e) => updateGroceryStore(index, e.target.value)}
                            className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]"
                            placeholder={`Enter grocery store address ${index + 1}`}
                          />
                        </Autocomplete>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="px-3 border-gray-300 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeGroceryStore(index)}
                        >
                          <X size={20} />
                        </Button>
                      )}
                    </div>
                  ))}
                  {groceryStores.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2 border-dashed border-gray-300 hover:border-[rgb(93,224,230)] hover:text-[rgb(0,74,173)]"
                      onClick={addGroceryStore}
                    >
                      <Plus size={20} className="mr-2" /> Add Another Store
                    </Button>
                  )}
                </div>
              </div>

              {/* Work Hours Section */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Typical work/study hours?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(workHoursMap).map(hours => (
                    <Button
                      key={hours}
                      type="button"
                      variant="outline"
                      className={`w-full justify-start py-3 px-4 ${
                        workHours === hours 
                          ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" 
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setWorkHours(hours)}
                    >
                      {hours}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Gym Address Section */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Do you go to a gym?</h3>
                <Autocomplete
                  onLoad={onLoadGym}
                  onPlaceChanged={onPlaceChangedGym}
                >
                  <Input
                    type="text"
                    value={gymAddress}
                    onChange={e => setGymAddress(e.target.value)}
                    className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]"
                    placeholder="Start typing gym address…"
                  />
                </Autocomplete>
              </div>
              
              {/* Task Prioritization Section */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Task prioritization style?</h3>
                <div className="space-y-2">
                  {prioritizations.map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      className={`w-full justify-start py-3 px-4 ${
                        prioritizationStyle === option.value 
                          ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" 
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setPrioritization(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center p-6">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white px-10 py-6 text-lg font-semibold transition-colors duration-200"
              >
                Save Preferences & Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}