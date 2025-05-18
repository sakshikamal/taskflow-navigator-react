
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Map from '@/components/Map'; // This will be used later in the task detail popup
import TaskCard from '@/components/TaskCard';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button'; // For "Add New Task" button later
import { PlusCircle } from 'lucide-react'; // For "Add New Task" button icon later

export interface Task {
  id: string;
  title: string;
  timeRange: string;
  isActive?: boolean;
  transitMode: 'car' | 'bike' | 'bus' | 'walk';
  isCompleted: boolean;
  description: string;
  locationName?: string; // e.g. "Albertsons"
  locationAddress?: string; // e.g. "123 Main St, Anytown, CA"
}

export default function Homepage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Quick call John', timeRange: '8 AM - 8:30 AM', isActive: false, transitMode: 'walk', isCompleted: false, description: 'Follow up call with John about the project proposal.', locationName: 'Home Office' },
    { id: '2', title: 'Shopping at Albertsons', timeRange: '11 AM - 12 PM', isActive: true, transitMode: 'car', isCompleted: false, description: 'Buy groceries for the week. List: milk, eggs, bread, chicken.', locationName: 'Albertsons', locationAddress: '456 Grocery Ln' },
    { id: '3', title: 'ML Class', timeRange: '1:30 PM - 2:20 PM', isActive: false, transitMode: 'bike', isCompleted: true, description: 'Attend Machine Learning lecture.', locationName: 'University Hall, Room 101' },
    { id: '4', title: 'Reply to spam emails', timeRange: '5 PM - 6 PM', isActive: false, transitMode: 'walk', isCompleted: false, description: 'Clear out the spam folder and unsubscribe from unwanted newsletters.', locationName: 'Home Office' },
  ]);

  const [routes] = useState({
    coordinates: [
      [-122.4194, 37.7749] as [number, number],
      [-122.4099, 37.7850] as [number, number],
      [-122.4150, 37.7900] as [number, number],
      [-122.4250, 37.7800] as [number, number],
    ],
    locations: [
      { name: 'Start', coordinates: [-122.4194, 37.7749] as [number, number] },
      { name: 'Grocery Store', coordinates: [-122.4099, 37.7850] as [number, number] },
      { name: 'Class', coordinates: [-122.4150, 37.7900] as [number, number] },
      { name: 'Home', coordinates: [-122.4250, 37.7800] as [number, number] },
    ]
  });

  const handleTaskClick = (taskId: string) => {
    // For now, this just sets the active task for styling.
    // Later, this will open a detailed task pop-up.
    setTasks(currentTasks => currentTasks.map(task => ({
      ...task,
      isActive: task.id === taskId
    })));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(currentTasks => currentTasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted, isActive: false } : task
    ));
  };

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      {/* Main content area with gradient */}
      <div className="flex-1 ml-16 bg-[linear-gradient(90deg,rgb(205,255,216),rgb(148,185,255))] overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Hey {user?.name?.split(' ')[0] || 'there'}!
                </h1>
                <p className="text-xl text-gray-700">Here is your schedule</p>
              </div>
              {/* Placeholder for Sync button */}
              {/* 
              <Button variant="outline" className="border-calroute-blue text-calroute-blue hover:bg-calroute-lightBlue">
                <Sync className="mr-2 h-4 w-4" /> Sync Calendar/Todoist
              </Button> 
              */}
            </div>
          </header>
          
          {/* Placeholder for text box about the schedule */}
          {/* 
          <div className="mb-6 p-4 bg-white/70 rounded-lg shadow">
            <p className="text-gray-700">This is a space for a text box about the schedule. You can add notes or summaries here.</p>
          </div> 
          */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Today's Tasks</h2>
                  {/* Placeholder for Add New Task button */}
                  {/* 
                  <Button className="bg-calroute-blue hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                  </Button> 
                  */}
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onClick={() => handleTaskClick(task.id)}
                      onToggleComplete={() => handleToggleComplete(task.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Route Today</h2>
                <div className="h-[400px] bg-gray-200 rounded-md flex items-center justify-center">
                   {/* The existing Map component might need props adjustment later */}
                  <Map />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
