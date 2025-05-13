import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // form state
  const [transportation, setTransportation]         = useState<string>('');
  const [homeAddress, setHomeAddress]               = useState<string>('');
  const [groceryStore, setGroceryStore]             = useState<string>('');
  const [workHours, setWorkHours]                   = useState<string>('');
  const [taskPrioritization, setTaskPrioritization] = useState<string>('');

  // maps for API
  const travelModeMap: Record<string,string> = {
    Car: 'car', Bike: 'bike', 'Bus/Train': 'bus_train',
    Walking: 'walking', Rideshare: 'rideshare',
  };
  const prioritizationMap: Record<string,string> = {
    'Focus on Important First': 'important_first',
    'Start with Quick Wins':     'quick_wins',
    'A Balanced Approach':       'balanced',
  };
  const workHoursMap: Record<string,[string,string]> = {
    '9AM - 5PM': ['09:00','17:00'],
    '8AM - 4PM': ['08:00','16:00'],
    '10AM - 6PM':['10:00','18:00'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const travel_mode          = travelModeMap[transportation] || '';
    const prioritization_style = prioritizationMap[taskPrioritization] || '';
    const [ work_start_time, work_end_time ] = workHoursMap[workHours] || [null,null];

    const payload: any = {
      travel_mode,
      prioritization_style,
      home_address:           homeAddress,
      favorite_store_address: groceryStore,
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
      toast({ title: "Preferences saved", description: "All set!" });
      navigate('/homepage');
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Error", description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calroute-lightGreen to-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img src="/uploads/logo.jpeg" alt="CalRoute Logo" className="w-10 h-10 mr-3" />
            <h1 className="text-2xl font-bold">CalRoute</h1>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome to CalRoute!</h2>
          <p className="text-center text-gray-600 mb-8">
            To help personalize your schedule… adjust later in settings.
          </p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-6">
              {/* Travel */}
              <div>
                <h3 className="text-xl font-medium mb-4">How do you usually get around?</h3>
                <div className="space-y-3">
                  {["Car","Bike","Bus/Train","Walking","Rideshare"].map(opt => (
                    <button key={opt} type="button"
                      className={`w-full py-3 px-4 rounded-md border ${
                        transportation===opt
                          ? "bg-calroute-lightBlue border-calroute-blue"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={()=>setTransportation(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {/* Home */}
              <div>
                <h3 className="text-xl font-medium mb-4">Your Home Address</h3>
                <input
                  type="text"
                  value={homeAddress}
                  onChange={e=>setHomeAddress(e.target.value)}
                  placeholder="Enter your home address"
                  className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-200"
                />
              </div>
              {/* Grocery */}
              <div>
                <h3 className="text-xl font-medium mb-4">Favorite Grocery Store</h3>
                <select
                  value={groceryStore}
                  onChange={e=>setGroceryStore(e.target.value)}
                  className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-200"
                >
                  <option value="">Select a store</option>
                  <option>Trader Joe's</option>
                  <option>Whole Foods</option>
                  <option>Albertsons</option>
                  <option>Safeway</option>
                </select>
              </div>
            </div>
            {/* Right */}
            <div className="space-y-6">
              {/* Work */}
              <div>
                <h3 className="text-xl font-medium mb-4">What are your typical work hours?</h3>
                <select
                  value={workHours}
                  onChange={e=>setWorkHours(e.target.value)}
                  className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-200"
                >
                  <option value="">Select work hours</option>
                  <option>9AM - 5PM</option>
                  <option>8AM - 4PM</option>
                  <option>10AM - 6PM</option>
                  <option>flexible</option>
                  <option>night</option>
                </select>
              </div>
              {/* Prioritize */}
              <div>
                <h3 className="text-xl font-medium mb-4">Task Prioritization Style</h3>
                <div className="space-y-3">
                  {[
                    "Focus on Important First",
                    "Start with Quick Wins",
                    "A Balanced Approach"
                  ].map(opt => (
                    <button key={opt} type="button"
                      className={`w-full py-3 px-4 rounded-md border ${
                        taskPrioritization===opt
                          ? "bg-calroute-lightBlue border-calroute-blue"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={()=>setTaskPrioritization(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Submit */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <Button type="submit" className="bg-calroute-blue hover:bg-blue-600 text-white px-10 py-6 text-lg">
                SUBMIT
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}