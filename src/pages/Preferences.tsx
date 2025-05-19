
import { useState } from 'react';
import { Button } from '@/components/ui/button';
// Select component from shadcn/ui could be used for a more consistent UI,
// but for minimal changes, we'll stick to styling the native select for now.
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast'; // Corrected import path
import { ChevronDown } from 'lucide-react'; // For select arrow styling

export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transportation, setTransportation] = useState('');
  const [groceryStore, setGroceryStore] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [taskPrioritization, setTaskPrioritization] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const preferences = {
      transportation,
      groceryStore,
      workHours,
      taskPrioritization
    };
    
    localStorage.setItem('calroute_preferences', JSON.stringify(preferences));
    
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been successfully saved."
    });
    
    navigate('/homepage');
  };

  const transportationOptions = ["Car", "Bike", "Bus/Train", "Walking", "Rideshare"];
  const groceryStoreOptions = ["Trader Joe's", "Whole Foods", "Albertsons", "Safeway", "Other", "None"];
  const workHoursOptions = ["9AM - 5PM", "8AM - 4PM", "10AM - 6PM", "Flexible Hours", "Night Shift", "Part-time", "N/A"];
  const prioritizationOptions = ["Focus on Important First", "Start with Quick Wins", "A Balanced Approach", "Urgent then Important"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-calroute-lightGreen to-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-start mb-6 sm:mb-8">
          <img 
            src="/uploads/logo.png" 
            alt="CalRoute Logo" 
            className="w-10 h-10 mr-3 rounded-md" 
          />
          <h1 className="text-2xl font-bold text-gray-800">CalRoute</h1>
        </header>
        
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Welcome to CalRoute!</CardTitle>
            <CardDescription className="text-gray-600 pt-2 max-w-2xl mx-auto">
              Help us personalize your schedule by answering a few optional questions. 
              You can adjust these anytime in your profile settings.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6">
              
              {/* Transportation Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700">How do you usually get around?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {transportationOptions.map(option => (
                    <Button
                      key={option}
                      type="button"
                      variant="outline"
                      className={`w-full justify-start py-3 px-4 ${
                        transportation === option 
                          ? "bg-calroute-blue text-white hover:bg-calroute-blue/90" 
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setTransportation(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Grocery Store Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700">Favorite grocery store?</h3>
                <div className="relative">
                  <select
                    value={groceryStore}
                    onChange={(e) => setGroceryStore(e.target.value)}
                    className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 appearance-none focus:ring-2 focus:ring-calroute-blue focus:border-calroute-blue"
                  >
                    <option value="">Select a store (optional)</option>
                    {groceryStoreOptions.map(store => <option key={store} value={store}>{store}</option>)}
                  </select>
                  <ChevronDown className="absolute inset-y-0 right-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            
              {/* Work Hours Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700">Typical work/study hours?</h3>
                <div className="relative">
                  <select
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 appearance-none focus:ring-2 focus:ring-calroute-blue focus:border-calroute-blue"
                  >
                    <option value="">Select hours (optional)</option>
                    {workHoursOptions.map(hours => <option key={hours} value={hours}>{hours}</option>)}
                  </select>
                  <ChevronDown className="absolute inset-y-0 right-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              {/* Task Prioritization Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700">Task prioritization style?</h3>
                <div className="space-y-2">
                  {prioritizationOptions.map(option => (
                    <Button
                      key={option}
                      type="button"
                      variant="outline"
                      className={`w-full justify-start py-3 px-4 ${
                        taskPrioritization === option 
                         ? "bg-calroute-blue text-white hover:bg-calroute-blue/90" 
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setTaskPrioritization(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center p-6">
              <Button type="submit" size="lg" className="bg-calroute-green hover:bg-green-700 text-white px-10 py-3 text-base">
                Save Preferences & Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
