import { useState } from 'react';
import { Button } from '@/components/ui/button';
// Select component from shadcn/ui could be used for a more consistent UI,
// but for minimal changes, we'll stick to styling the native select for now.
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast'; // Corrected import path
import { ChevronDown, Plus, X } from 'lucide-react'; // For select arrow styling and additional icons

export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transportation, setTransportation] = useState<string[]>([]);
  const [homeAddress, setHomeAddress] = useState('');
  const [groceryStores, setGroceryStores] = useState(['']);
  const [workHours, setWorkHours] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [taskPrioritization, setTaskPrioritization] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const preferences = {
      transportation,
      homeAddress,
      groceryStores: groceryStores.filter(store => store.trim() !== ''),
      workHours,
      gymAddress,
      taskPrioritization
    };
    
    localStorage.setItem('calroute_preferences', JSON.stringify(preferences));
    
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been successfully saved."
    });
    
    navigate('/homepage');
  };

  const toggleTransportation = (option: string) => {
    setTransportation(prev => {
      if (prev.includes(option)) {
        // Remove if already selected
        return prev.filter(t => t !== option);
      } else if (prev.length < 3) {
        // Add if less than 3 selected
        return [...prev, option];
      }
      return prev;
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

  const transportationOptions = ["Car", "Bike", "Bus/Train", "Walking", "Rideshare"];
  const workHoursOptions = ["9AM - 5PM", "8AM - 4PM", "10AM - 6PM", "Flexible Hours"];
  const prioritizationOptions = ["Focus on Important First", "Start with Quick Wins", "A Balanced Approach", "Urgent then Important"];

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
                <Input
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]"
                  placeholder="Enter your home address"
                />
              </div>
              
              {/* Transportation Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-semibold text-gray-800">How do you usually get around?</h3>
                  <span className="text-sm text-gray-500">Select up to 3</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {transportationOptions.map(option => (
                    <Button
                      key={option}
                      type="button"
                      variant="outline"
                      className={`w-full justify-start py-3 px-4 ${
                        transportation.includes(option)
                          ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" 
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700"
                      } ${
                        transportation.length >= 3 && !transportation.includes(option)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => toggleTransportation(option)}
                      disabled={transportation.length >= 3 && !transportation.includes(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Grocery Stores Section */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Favourite grocery stores</h3>
                <div className="space-y-3">
                  {groceryStores.map((store, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={store}
                        onChange={(e) => updateGroceryStore(index, e.target.value)}
                        className="flex-1 py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]"
                        placeholder={`Enter grocery store address ${index + 1}`}
                      />
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
                  {workHoursOptions.map(hours => (
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
                <Input
                  value={gymAddress}
                  onChange={(e) => setGymAddress(e.target.value)}
                  className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-300 text-gray-700 focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]"
                  placeholder="Enter your gym address (if applicable)"
                />
              </div>
              
              {/* Task Prioritization Section */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Task prioritization style?</h3>
                <div className="space-y-2">
                  {prioritizationOptions.map(option => (
                    <Button
                      key={option}
                      type="button"
                      variant="outline"
                      className={`w-full justify-start py-3 px-4 ${
                        taskPrioritization === option 
                          ? "bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)]" 
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
