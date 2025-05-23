import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Map from '@/components/Map';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import NewTaskModal from '@/components/NewTaskModal';
import { AppSidebar } from '@/components/AppSidebar';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw as Sync, Pencil } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import PendingTasksModal from '@/components/PendingTasksModal';

export interface Task {
  id: string;
  title: string;
  timeRange: string;
  lat: number;
  lng: number;
  isActive?: boolean;
  transitMode: 'car' | 'bike' | 'bus' | 'walk';
  isCompleted: boolean;
  description: string;
  locationName?: string;
  locationAddress?: string;
  priority: number;
}

const DEMO_MODE = true;

export default function Homepage() {
  const { isAuthenticated, loading, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(DEMO_MODE ? [
    {
      id: '1',
      title: 'Go to gym',
      timeRange: '5:00 PM - 5:45 PM',
      lat: 33.659,
      lng: -117.86,
      transitMode: 'car',
      isCompleted: false,
      description: 'Evening workout session',
      locationName: 'UCI ARC',
      locationAddress: '680 California Ave, Irvine, CA',
      priority: 1,
    },
    {
      id: '2',
      title: 'Buy groceries',
      timeRange: '6:00 PM - 6:30 PM',
      lat: 33.670,
      lng: -117.85,
      transitMode: 'car',
      isCompleted: false,
      description: 'Pick up groceries for dinner',
      locationName: 'Trader Joe\'s',
      locationAddress: '4225 Campus Dr, Irvine, CA',
      priority: 2,
    },
    {
      id: '3',
      title: 'Call Mom',
      timeRange: '7:00 PM - 7:30 PM',
      lat: 33.660,
      lng: -117.87,
      transitMode: 'walk',
      isCompleted: false,
      description: 'Weekly catch-up call',
      locationName: 'Home',
      locationAddress: '123 Main St, Irvine, CA',
      priority: 3,
    },
  ] : []);
  const [taskLocations, setTaskLocations] = useState<{ lat: number; lng: number; title: string }[]>(DEMO_MODE ? [
    { lat: 33.659, lng: -117.86, title: 'UCI ARC' },
    { lat: 33.670, lng: -117.85, title: 'Trader Joe\'s' },
    { lat: 33.660, lng: -117.87, title: 'Home' },
  ] : []);

  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [hasPendingTasks, setHasPendingTasks] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Move fetchTasks to top level
  const fetchTasks = async () => {
    if (DEMO_MODE) return;
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8888/api/tasks', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      const formattedTasks = data.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        timeRange: `${task.start_time} - ${task.end_time}`,
        lat: task.lat,
        lng: task.lng,
        transitMode: task.transit_mode || 'car',
        isCompleted: task.is_completed || false,
        description: task.description || '',
        locationName: task.location_name,
        locationAddress: task.location_address,
        priority: task.priority || 1
      }));
      setTasks(formattedTasks);
      setTaskLocations(formattedTasks.map(task => ({
        lat: task.lat,
        lng: task.lng,
        title: task.title
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!DEMO_MODE) fetchTasks();
  }, [isAuthenticated, toast]);

  // Fetch pending tasks on mount
  useEffect(() => {
    fetch('http://localhost:8888/api/pending_tasks', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.tasks && data.tasks.length > 0) {
          setHasPendingTasks(true);
          setShowPendingModal(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleTaskCardClick = (task: Task) => {
    setSelectedTaskForModal(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
  };

  const handleToggleComplete = async (taskId: string) => {
    if (DEMO_MODE) {
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      ));
      if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
        setSelectedTaskForModal(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
      }
      return;
    }
    try {
      const response = await fetch(`http://localhost:8888/api/tasks/${taskId}/toggle`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to toggle task completion');
      }
      setTasks(currentTasks => currentTasks.map(task => 
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      ));
      if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
        setSelectedTaskForModal(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddNewTask = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleNewTaskSubmit = async (taskData: any) => {
    if (DEMO_MODE) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title,
        timeRange: `${taskData.startTime} - ${taskData.endTime}`,
        lat: taskData.lat || 33.659,
        lng: taskData.lng || -117.86,
        transitMode: taskData.transitMode || 'car',
        isCompleted: false,
        description: taskData.description || '',
        locationName: taskData.location,
        locationAddress: taskData.location,
        priority: taskData.priority || 1,
      };
      setTasks(prev => [...prev, newTask]);
      setTaskLocations(prev => [...prev, { lat: newTask.lat, lng: newTask.lng, title: newTask.title }]);
      toast({ title: "Success", description: "Task created successfully!" });
      return;
    }
    try {
      // Convert time strings to ISO format
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      let startTime = null;
      let endTime = null;
      if (taskData.startTime && taskData.endTime) {
        const [startHours, startMinutes] = taskData.startTime.split(':').map(Number);
        const [endHours, endMinutes] = taskData.endTime.split(':').map(Number);
        startTime = new Date(today);
        startTime.setHours(startHours, startMinutes, 0);
        endTime = new Date(today);
        endTime.setHours(endHours, endMinutes, 0);
        if (endTime <= startTime) {
          endTime = new Date(tomorrow);
          endTime.setHours(endHours, endMinutes, 0);
        }
      }
      const response = await fetch('http://localhost:8888/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          location_name: taskData.location,
          location_address: taskData.location,
          lat: taskData.lat,
          lng: taskData.lng,
          start_time: startTime?.toISOString(),
          end_time: endTime?.toISOString(),
          duration: parseInt(taskData.duration, 10),
          priority: taskData.priority,
          transit_mode: taskData.transitMode || 'car'
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }
      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, {
        id: newTask.id,
        title: newTask.title,
        timeRange: `${newTask.start_time} - ${newTask.end_time}`,
        lat: newTask.lat,
        lng: newTask.lng,
        transitMode: newTask.transit_mode || 'car',
        isCompleted: false,
        description: newTask.description || '',
        locationName: newTask.location_name,
        locationAddress: newTask.location_address,
        priority: newTask.priority || 1
      }]);
      setTaskLocations(prevLocations => [...prevLocations, {
        lat: newTask.lat,
        lng: newTask.lng,
        title: newTask.title
      }]);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSyncCalendar = () => {
    toast({ title: "Sync Calendar/Todoist", description: "This feature is coming soon!" });
  };
  
  const handleEditTask = (taskToEdit: Task) => {
    console.log('Editing task:', taskToEdit);
    setEditTask(taskToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditTaskSubmit = async (taskData: any, taskId?: string) => {
    if (DEMO_MODE && taskId) {
      setTasks(prev => prev.map(task =>
        task.id === taskId ? {
          ...task,
          ...taskData,
          timeRange: `${taskData.startTime} - ${taskData.endTime}`,
          locationName: taskData.location,
          locationAddress: taskData.location,
        } : task
      ));
      toast({ title: 'Success', description: 'Task updated successfully!' });
      setIsEditModalOpen(false);
      setEditTask(null);
      return;
    }
    if (!taskId) return;
    try {
      const response = await fetch(`http://localhost:8888/api/tasks/${taskId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          location_name: taskData.location,
          lat: taskData.lat,
          lng: taskData.lng,
          priority: taskData.priority,
        }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      fetchTasks();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update task.', variant: 'destructive' });
    } finally {
      setIsEditModalOpen(false);
      setEditTask(null);
    }
  };

  const handleDeleteTask = async (taskIdToDelete: string) => {
    if (DEMO_MODE) {
      setTasks(prev => prev.filter(task => task.id !== taskIdToDelete));
      toast({ title: "Task Deleted", description: `Task has been removed.` });
      if (selectedTaskForModal && selectedTaskForModal.id === taskIdToDelete) {
        handleCloseModal();
      }
      return;
    }
    try {
      const response = await fetch(`http://localhost:8888/api/tasks/${taskIdToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskIdToDelete));
      toast({ title: "Task Deleted", description: `Task has been removed.` });
      if (selectedTaskForModal && selectedTaskForModal.id === taskIdToDelete) {
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDynamicSchedule = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      return;
    }
  
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const response = await fetch("http://localhost:8888/api/dynamic_schedule", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Schedule re-optimized successfully!",
        });
        // Refresh tasks
        window.location.reload();
      } else {
        throw new Error(data.error || "Reoptimization failed");
      }
    } catch (error) {
      console.error("Dynamic schedule error:", error);
      toast({
        title: "Error",
        description: "Failed to reoptimize schedule. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper to parse timeRange and convert to HH:mm
  const parseTimeRange = (timeRange: string | undefined) => {
    if (!timeRange) return { startTime: '', endTime: '' };
    const [start, end] = timeRange.split(' - ');
    // Convert "5:00 PM" to "17:00" etc.
    const to24Hour = (t: string) => {
      if (!t) return '';
      const [time, modifier] = t.trim().split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    return {
      startTime: to24Hour(start),
      endTime: to24Hour(end),
    };
  };

  // Helper to convert Task to TaskData for editing
  const taskToTaskData = (task: Task): any => {
    const { startTime, endTime } = parseTimeRange(task.timeRange);
    return {
      title: task.title,
      duration: '', // If you have a duration field, use it; otherwise, leave blank or calculate
      location: task.locationAddress || task.locationName || '',
      lat: task.lat,
      lng: task.lng,
      startTime,
      endTime,
      description: task.description,
      priority: task.priority,
    };
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
                      <div key={task.id} className="relative">
                        <TaskCard 
                          task={task} 
                          onClick={handleTaskCardClick}
                          onToggleComplete={() => handleToggleComplete(task.id)}
                          isActive={selectedTaskForModal?.id === task.id && !task.isCompleted}
                        />
                        <button
                          className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200"
                          onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                          title="Edit Task"
                        >
                          <Pencil size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                    onClick={handleDynamicSchedule}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Reoptimize Schedule
                  </button>
            </div>

            <div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Route Today</h2>
                <div className="h-[500px] rounded-lg overflow-hidden shadow-inner">
                  <Map routes={{ locations: taskLocations }} />
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
      <NewTaskModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditTask(null); }}
        onSubmit={handleEditTaskSubmit}
        initialData={editTask ? taskToTaskData(editTask) : undefined}
        taskId={editTask?.id}
      />
      <PendingTasksModal
        open={showPendingModal && hasPendingTasks}
        onClose={() => setShowPendingModal(false)}
        onTasksCompleted={() => {
          setShowPendingModal(false);
          setHasPendingTasks(false);
          // Optionally refetch tasks
          window.location.reload();
        }}
      />
    </div>
  );
}
