import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Settings, Calendar, History, Shield, Car, Home, ShoppingBag, Clock, Dumbbell } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

interface Preferences {
  transportation: string[];
  homeAddress: string;
  groceryStores: string[];
  workHours: string;
  gymAddress: string;
  taskPrioritization: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    email: user?.email || '',
    location: ''
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem('calroute_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    // Save profile information logic would go here
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved."
    });
  };

  const handleEditPreferences = () => {
    navigate('/preferences');
  };

  const tabs = [
    { id: 'basic-info', name: 'Basic Info', icon: <User size={18} /> },
    { id: 'preferences', name: 'Preferences', icon: <Settings size={18} /> },
    { id: 'calendar', name: 'Calendar Integration', icon: <Calendar size={18} /> },
    { id: 'history', name: 'Task History', icon: <History size={18} /> },
    { id: 'security', name: 'Security', icon: <Shield size={18} /> }
  ];

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-16 bg-[rgb(240,248,255)] overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile Settings</h1>
            <p className="text-xl text-gray-600">Manage your account preferences and settings</p>
          </header>

          <Card className="bg-white shadow-xl rounded-xl border-0">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar with tabs */}
              <div className="md:w-64 bg-gray-50/50 p-6 md:border-r border-b md:border-b-0 border-gray-200/50">
                <div className="flex justify-center mb-8">
                  <div className="text-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] mx-auto mb-3 flex items-center justify-center text-white">
                      <User size={40} />
                    </div>
                    <div className="text-xl font-semibold bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] bg-clip-text text-transparent">
                      {user?.name}
                    </div>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                        activeTab === tab.id 
                          ? 'bg-gradient-to-r from-[rgb(93,224,230)] to-[rgb(0,74,173)] text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Main content area */}
              <div className="flex-1 p-8">
                {activeTab === 'basic-info' && (
                  <div className="max-w-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                      Basic Information
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User size={18} className="text-gray-600" /> Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)] bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Phone size={18} className="text-gray-600" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)] bg-white"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Mail size={18} className="text-gray-600" /> Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)] bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin size={18} className="text-gray-600" /> Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)] bg-white"
                          placeholder="City, State"
                        />
                      </div>
                      
                      <div className="pt-6">
                        <Button 
                          onClick={handleSave}
                          className="bg-[rgb(0,74,173)] hover:opacity-90 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'preferences' && (
                  <div className="max-w-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Your Preferences
                      </h2>
                      <Button
                        onClick={handleEditPreferences}
                        className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
                      >
                        {preferences ? 'Edit Preferences' : 'Set Up Preferences'}
                      </Button>
                    </div>
                    {preferences ? (
                      <div className="space-y-6">
                        {/* Home Address */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Home size={18} className="text-[rgb(0,74,173)]" /> Home Address
                          </h3>
                          <p className="text-gray-600">{preferences.homeAddress || 'Not set'}</p>
                        </div>

                        {/* Transportation */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Car size={18} className="text-[rgb(0,74,173)]" /> Transportation Methods
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {preferences.transportation.map((method, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-gray-700"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Grocery Stores */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-[rgb(0,74,173)]" /> Grocery Stores
                          </h3>
                          <div className="space-y-2">
                            {preferences.groceryStores.map((store, index) => (
                              <p key={index} className="text-gray-600">{store || 'Not set'}</p>
                            ))}
                          </div>
                        </div>

                        {/* Work Hours */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Clock size={18} className="text-[rgb(0,74,173)]" /> Work Hours
                          </h3>
                          <p className="text-gray-600">{preferences.workHours || 'Not set'}</p>
                        </div>

                        {/* Gym Address */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Dumbbell size={18} className="text-[rgb(0,74,173)]" /> Gym Address
                          </h3>
                          <p className="text-gray-600">{preferences.gymAddress || 'Not set'}</p>
                        </div>

                        {/* Task Prioritization */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Settings size={18} className="text-[rgb(0,74,173)]" /> Task Prioritization
                          </h3>
                          <p className="text-gray-600">{preferences.taskPrioritization || 'Not set'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No preferences set yet</p>
                        <Button
                          onClick={handleEditPreferences}
                          className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
                        >
                          Set Up Preferences
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab !== 'basic-info' && activeTab !== 'preferences' && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      {tabs.find(tab => tab.id === activeTab)?.icon}
                    </div>
                    <p className="text-lg">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} settings will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
