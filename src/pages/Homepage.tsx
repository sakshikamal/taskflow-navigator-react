import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Map from '@/components/Map';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import NewTaskModal from '@/components/NewTaskModal';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw as Sync } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

export interface Task {
  id: string;
  title: string;
  timeRange: string;
  isActive?: boolean;
  transitMode: 'car' | 'bike' | 'bus' | 'walk';
  isCompleted: boolean;
  description: string;
  locationName?: string;
  locationAddress?: string;
  priority: number;
}

export default function Homepage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

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

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        // Short delay to demonstrate loading state
        await new Promise(resolve => setTimeout(resolve, 800));
        setTasks([
          { id: '1', title: 'Quick call John', timeRange: '8 AM - 8:30 AM', transitMode: 'walk', isCompleted: false, description: 'Follow up call with John about the project proposal.', locationName: 'Home Office', priority: 2 },
          { id: '2', title: 'Shopping at Albertsons', timeRange: '11 AM - 12 PM', transitMode: 'car', isCompleted: false, description: 'Buy groceries for the week. List: milk, eggs, bread, chicken.', locationName: 'Albertsons', locationAddress: '456 Grocery Ln', priority: 1 },
          { id: '3', title: 'ML Class', timeRange: '1:30 PM - 2:20 PM', transitMode: 'bike', isCompleted: true, description: 'Attend Machine Learning lecture.', locationName: 'University Hall, Room 101', priority: 1 },
          { id: '4', title: 'Reply to spam emails', timeRange: '5 PM - 6 PM', transitMode: 'walk', isCompleted: false, description: 'Clear out the spam folder and unsubscribe from unwanted newsletters.', locationName: 'Home Office', priority: 3 },
        ]);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [toast]);

  const handleTaskCardClick = (task: Task) => {
    setSelectedTaskForModal(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(currentTasks => currentTasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
    if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
      setSelectedTaskForModal(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
    }
  };

  const handleAddNewTask = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleNewTaskSubmit = (taskData: any) => {
    const timeRange = taskData.startTime && taskData.endTime 
      ? `${taskData.startTime} - ${taskData.endTime}`
      : `${taskData.duration}`;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      timeRange,
      transitMode: 'car', // Default transit mode, can be updated later
      isCompleted: false,
      description: taskData.description || '',
      locationName: taskData.location,
      priority: taskData.priority
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleSyncCalendar = () => {
    toast({ title: "Sync Calendar/Todoist", description: "This feature is coming soon!" });
  };
  
  const handleEditTask = (taskToEdit: Task) => {
    toast({ title: "Edit Task", description: `Editing ${taskToEdit.title}. Feature coming soon!`});
  };

  const handleDeleteTask = (taskIdToDelete: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskIdToDelete));
    toast({ title: "Task Deleted", description: `Task has been removed.`, variant: "destructive"});
    if (selectedTaskForModal && selectedTaskForModal.id === taskIdToDelete) {
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-16 bg-gradient-to-b from-[rgb(0,74,173)] to-[rgb(93,224,230)] overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div className="flex items-start sm:items-center gap-3">
                <img 
                  src="/uploads/logo.png" 
                  alt="CalRoute Logo" 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl"
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Hey {user?.name?.split(' ')[0] || 'there'}!{' '}
                    <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-white/90">Here's your optimized schedule for today</p>
                </div>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm whitespace-nowrap"
                  onClick={handleSyncCalendar}
                >
                  <Sync className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Sync Calendar/Todoist</span>
                  <span className="sm:hidden">Sync</span>
                </Button> 
              </div>
            </div>
          </header>
          
          <div className="mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <p className="text-gray-700">Your schedule has been optimized for maximum efficiency. Total travel time: 45 minutes.</p>
          </div> 

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Today's Tasks</h2>
                  <Button 
                    className="bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)] transition-colors duration-200"
                    onClick={handleAddNewTask}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                  </Button> 
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Spinner className="text-[rgb(0,74,173)]" size="lg" />
                    <p className="mt-4 text-gray-600">Optimizing your route...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onClick={handleTaskCardClick}
                        onToggleComplete={() => handleToggleComplete(task.id)}
                        isActive={selectedTaskForModal?.id === task.id && !task.isCompleted}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Route Today</h2>
                <div className="h-[500px] rounded-lg overflow-hidden shadow-inner">
                  <Map />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedTaskForModal && (
        <TaskDetailModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseModal}
          task={selectedTaskForModal}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={handleNewTaskSubmit}
      />
    </div>
  );
}
