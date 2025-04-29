
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-info');
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    email: user?.email || '',
    location: ''
  });
  
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

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-16">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-600 p-4">
              <h1 className="text-2xl font-bold text-white">Profile</h1>
            </div>
            
            <div className="flex">
              {/* Sidebar with tabs */}
              <div className="w-64 bg-gray-50 p-4 border-r">
                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center overflow-hidden">
                      <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2a8 8 0 00-8 7.93v.07h16v-.07A8 8 0 0012 14z" />
                      </svg>
                    </div>
                    <div className="font-medium">Username</div>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  {[
                    { id: 'basic-info', name: 'Basic Info' },
                    { id: 'preferences', name: 'Preferences and Settings' },
                    { id: 'calendar', name: 'Calendar & To-Do Integration' },
                    { id: 'history', name: 'Task & Route History' },
                    { id: 'security', name: 'Security & Management' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-green-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Main content area */}
              <div className="flex-1 p-8">
                {activeTab === 'basic-info' && (
                  <div className="max-w-lg">
                    <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="City, State"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          onClick={handleSave}
                          className="bg-calroute-blue hover:bg-blue-600 text-white"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab !== 'basic-info' && (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} settings will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
