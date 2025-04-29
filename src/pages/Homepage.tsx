
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Map from '@/components/Map';
import TaskCard from '@/components/TaskCard';
import { AppSidebar } from '@/components/AppSidebar';

interface Task {
  id: string;
  title: string;
  timeRange: string;
  isActive?: boolean;
}

export default function Homepage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Quick call John', timeRange: '8 AM - 8:30 AM', isActive: false },
    { id: '2', title: 'Shopping at Albertsons', timeRange: '11 AM - 12 PM', isActive: true },
    { id: '3', title: 'ML Class', timeRange: '1:30 PM - 2:20 PM', isActive: false },
    { id: '4', title: 'Reply to spam emails', timeRange: '5 PM - 6 PM', isActive: false },
  ]);

  const [routes] = useState({
    coordinates: [
      [-122.4194, 37.7749],
      [-122.4099, 37.7850],
      [-122.4150, 37.7900],
      [-122.4250, 37.7800],
    ],
    locations: [
      { name: 'Start', coordinates: [-122.4194, 37.7749] },
      { name: 'Grocery Store', coordinates: [-122.4099, 37.7850] },
      { name: 'Class', coordinates: [-122.4150, 37.7900] },
      { name: 'Home', coordinates: [-122.4250, 37.7800] },
    ]
  });

  const handleTaskClick = (taskId: string) => {
    setTasks(tasks.map(task => ({
      ...task,
      isActive: task.id === taskId
    })));
  };

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-16">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <h1 className="text-3xl font-bold">
              Hey {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-xl text-gray-600">Here is your schedule</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onClick={() => handleTaskClick(task.id)} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Your Route Today</h2>
                <Map routes={routes} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
