
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transportation, setTransportation] = useState('');
  const [groceryStore, setGroceryStore] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [taskPrioritization, setTaskPrioritization] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save preferences to localStorage
    const preferences = {
      transportation,
      groceryStore,
      workHours,
      taskPrioritization
    };
    
    localStorage.setItem('calroute_preferences', JSON.stringify(preferences));
    
    toast({
      title: "Preferences saved",
      description: "Your preferences have been saved successfully."
    });
    
    navigate('/homepage');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calroute-lightGreen to-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0aad9252-67e2-4a84-8264-5194b62b20da.png" 
              alt="CalRoute Logo" 
              className="w-10 h-10 mr-3" 
            />
            <h1 className="text-2xl font-bold">CalRoute</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome to CalRoute!</h2>
          <p className="text-center text-gray-600 mb-8">
            To help personalize your schedule and factor in things like how you get around, we have a 
            few optional questions. You can also skip these for now and adjust your preferences later in 
            the settings.
          </p>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-4">How do you usually get around?</h3>
                <div className="space-y-3">
                  {["Car", "Bike", "Bus/Train", "Walking", "Rideshare"].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`w-full py-3 px-4 rounded-md border ${
                        transportation === option 
                          ? "bg-calroute-lightBlue border-calroute-blue" 
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => setTransportation(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-4">Do you have any favorite grocery stores?</h3>
                <div className="relative">
                  <select
                    value={groceryStore}
                    onChange={(e) => setGroceryStore(e.target.value)}
                    className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-200 appearance-none pr-10"
                  >
                    <option value="">Select a store</option>
                    <option value="Traders Joe's">Trader Joe's</option>
                    <option value="Whole Foods">Whole Foods</option>
                    <option value="Albertsons">Albertsons</option>
                    <option value="Safeway">Safeway</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-4">What are your typical work hours?</h3>
                <div className="relative">
                  <select
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    className="w-full py-3 px-4 rounded-md border bg-gray-50 border-gray-200 appearance-none pr-10"
                  >
                    <option value="">Select work hours</option>
                    <option value="9am-5pm">9AM - 5PM</option>
                    <option value="8am-4pm">8AM - 4PM</option>
                    <option value="10am-6pm">10AM - 6PM</option>
                    <option value="flexible">Flexible Hours</option>
                    <option value="night">Night Shift</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-4">Task Prioritization Style</h3>
                <div className="space-y-3">
                  {[
                    "Focus on Important First",
                    "Start with Quick Wins",
                    "A Balanced Approach"
                  ].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`w-full py-3 px-4 rounded-md border ${
                        taskPrioritization === option 
                          ? "bg-calroute-lightBlue border-calroute-blue" 
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => setTaskPrioritization(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
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
