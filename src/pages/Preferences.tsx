import { useState, useRef } from 'react';
import { useJsApiLoader, Autocomplete, Libraries } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

// It's highly recommended to move this key to a .env file
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const libraries: Libraries = ['places'];

export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isLoaded, loadError } = useJsApiLoader({
    libraries: libraries as any,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Form state
  const [transportModes, setTransportModes] = useState<string[]>(['car']);
  const [workHours, setWorkHours] = useState<string>('9AM–5PM');
  const [prioritizationStyle, setPrioritization] = useState<string>('balanced');
  
  // Location state
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [gymAddress, setGymAddress] = useState<string>('');
  const [groceryStores, setGroceryStores] = useState<string[]>(['']); // Array to hold multiple store addresses

  // Refs for the Autocomplete instances
  const homeAutoRef = useRef<google.maps.places.Autocomplete>();
  const gymAutoRef = useRef<google.maps.places.Autocomplete>();
  const storeAutoRefs = useRef<(google.maps.places.Autocomplete | undefined)[]>([]);

  // --- Autocomplete Handlers ---

  const onLoadHome = (ac: google.maps.places.Autocomplete) => {
    homeAutoRef.current = ac;
  };
  const onPlaceChangedHome = () => {
    const place = homeAutoRef.current?.getPlace();
    if (place?.formatted_address) {
      setHomeAddress(place.formatted_address);
    }
  };

  const onLoadGym = (ac: google.maps.places.Autocomplete) => {
    gymAutoRef.current = ac;
  };
  const onPlaceChangedGym = () => {
    const place = gymAutoRef.current?.getPlace();
    if (place?.formatted_address) {
      setGymAddress(place.formatted_address);
    }
  };

  const onLoadStore = (ac: google.maps.places.Autocomplete, index: number) => {
    storeAutoRefs.current[index] = ac;
  };
  const onPlaceChangedStore = (index: number) => {
    const place = storeAutoRefs.current[index]?.getPlace();
    if (place?.formatted_address) {
      const newStores = [...groceryStores];
      newStores[index] = place.formatted_address;
      setGroceryStores(newStores);
    }
  };

  // --- UI Handlers ---

  const toggleTransportation = (option: string) => {
    setTransportModes(prev => {
      if (prev.includes(option)) {
        return prev.length === 1 ? prev : prev.filter(mode => mode !== option);
      } else {
        return prev.length < 3 ? [...prev, option] : prev;
      }
    });
  };

  const addGroceryStore = () => {
    if (groceryStores.length < 3) {
      setGroceryStores([...groceryStores, '']);
    }
  };

  const removeGroceryStore = (index: number) => {
    setGroceryStores(prev => prev.filter((_, i) => i !== index));
    // Also clean up the ref
    storeAutoRefs.current.splice(index, 1);
  };

  const updateGroceryStore = (index: number, value: string) => {
    const newStores = [...groceryStores];
    newStores[index] = value;
    setGroceryStores(newStores);
  };

  // --- Form Submission ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const workHoursMap: Record<string,[string,string] | [null, null]> = {
      '9AM–5PM': ['09:00','17:00'],
      '8AM–4PM': ['08:00','16:00'],
      '10AM–6PM': ['10:00','18:00'],
      'Flexible': [null, null],
    };
    const [ work_start_time, work_end_time ] = workHoursMap[workHours] || [null,null];

    // Construct the payload to match the backend's expectations
    const payload = {
      prioritization_style: prioritizationStyle,
      work_start_time,
      work_end_time,
      home_address: homeAddress,
      transit_modes: transportModes, 
      gym_address: gymAddress,
      favorite_stores: groceryStores.filter(store => store.trim() !== ''),
    };

    try {
      const resp = await fetch('http://localhost:8888/preferences', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await resp.json();
      if (!resp.ok) {
        throw new Error(result.error || 'An unknown error occurred.');
      }

      // Store only home address in localStorage
      localStorage.setItem('calroute_home_address', homeAddress);

      toast({ title: 'Preferences Saved!', description: 'Your personalized schedule awaits.' });
      navigate('/homepage');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Save Failed', description: err.message });
    }
  };

  // Static data for rendering UI
  const travelModes = [
    { label: 'Car', value: 'car' }, { label: 'Bike', value: 'bike' },
    { label: 'Bus/Train', value: 'bus_train' }, { label: 'Walking', value: 'walking' },
    { label: 'Rideshare', value: 'rideshare' },
  ];
  const prioritizations = [
    { label: 'Important First', value: 'important_first' }, { label: 'Quick Wins', value: 'quick_wins' },
    { label: 'Balanced', value: 'balanced' },
  ];
  const workHoursOptions = ['9AM–5PM', '8AM–4PM', '10AM–6PM', 'Flexible'];

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[rgb(240,248,255)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-start mb-6 sm:mb-8">
          <img src="/uploads/logo.png" alt="CalRoute Logo" className="w-24 h-24 rounded-lg" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] bg-clip-text text-transparent">CalRoute</h1>
        </header>
        
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] bg-clip-text text-transparent">Welcome to CalRoute!</CardTitle>
            <CardDescription className="text-xl text-gray-700 pt-2 max-w-2xl mx-auto">
              Help us personalize your schedule by answering a few questions.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 gap-y-8 p-6">
              
              {/* Home Address */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">What's your home address?</h3>
                <Autocomplete onLoad={onLoadHome} onPlaceChanged={onPlaceChangedHome}>
                  <Input value={homeAddress} onChange={e => setHomeAddress(e.target.value)} placeholder="Start typing address…"/>
                </Autocomplete>
              </div>

              {/* Transportation */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-semibold text-gray-800">How do you usually get around?</h3>
                  <span className="text-sm text-gray-500">Select up to 3</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {travelModes.map(option => (
                    <Button key={option.value} type="button" variant="outline"
                      className={`w-full justify-start py-3 px-4 ${transportModes.includes(option.value) ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" : "bg-gray-50 hover:bg-gray-100"}`}
                      onClick={() => toggleTransportation(option.value)}
                    >{option.label}</Button>
                  ))}
                </div>
              </div>

              {/* Grocery Stores */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Favourite grocery stores (optional)</h3>
                <div className="space-y-3">
                  {groceryStores.map((store, index) => (
                    <div key={index} className="flex gap-2 w-full items-center">
                      <div className="flex-1">
                        <Autocomplete onLoad={(ac) => onLoadStore(ac, index)} onPlaceChanged={() => onPlaceChangedStore(index)}>
                          <Input value={store} onChange={(e) => updateGroceryStore(index, e.target.value)} placeholder={`Enter grocery store address ${index + 1}`}/>
                        </Autocomplete>
                      </div>
                      {groceryStores.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="text-gray-500 hover:bg-red-50 hover:text-red-600" onClick={() => removeGroceryStore(index)}><X size={20} /></Button>
                      )}
                    </div>
                  ))}
                  {groceryStores.length < 3 && (
                    <Button type="button" variant="outline" className="w-full mt-2 border-dashed" onClick={addGroceryStore}><Plus size={20} className="mr-2" /> Add Another Store</Button>
                  )}
                </div>
              </div>
              
              {/* Gym Address */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Favorite gym (optional)</h3>
                <Autocomplete onLoad={onLoadGym} onPlaceChanged={onPlaceChangedGym}>
                  <Input value={gymAddress} onChange={e => setGymAddress(e.target.value)} placeholder="Start typing gym address…"/>
                </Autocomplete>
              </div>

              {/* Work Hours */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Typical work/study hours?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {workHoursOptions.map(hours => (
                    <Button key={hours} type="button" variant="outline"
                      className={`w-full justify-start py-3 px-4 ${workHours === hours ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" : "bg-gray-50 hover:bg-gray-100"}`}
                      onClick={() => setWorkHours(hours)}
                    >{hours}</Button>
                  ))}
                </div>
              </div>

              {/* Prioritization Style */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Task prioritization style?</h3>
                <div className="grid grid-cols-1 gap-2">
                  {prioritizations.map(option => (
                    <Button key={option.value} type="button" variant="outline"
                      className={`w-full justify-start py-3 px-4 ${prioritizationStyle === option.value ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" : "bg-gray-50 hover:bg-gray-100"}`}
                      onClick={() => setPrioritization(option.value)}
                    >{option.label}</Button>
                  ))}
                </div>
              </div>

            </CardContent>
            
            <CardFooter className="flex justify-center p-6">
              <Button type="submit" size="lg" className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white px-10 py-6 text-lg font-semibold">
                Save & Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}