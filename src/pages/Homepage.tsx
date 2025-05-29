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
  raw_task_id: string;
  title: string;
  timeRange: string;
  lat: number;
  lng: number;
  isActive?: boolean;
  transitMode: 'car' | 'bike' | 'bus_train' | 'walking' | 'rideshare';
  isCompleted: boolean;
  description: string;
  locationName?: string;
  locationAddress?: string;
  priority: number;
}

export default function Homepage() {
  const { isAuthenticated, loading, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLocations, setTaskLocations] = useState<{ lat: number; lng: number; title: string }[]>([]);
  const [totalTravelTime, setTotalTravelTime] = useState<number | null>(null);

  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [hasPendingTasks, setHasPendingTasks] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bounceTick, setBounceTick] = useState(0);
  const [newTaskError, setNewTaskError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fetchTasks = async () => {
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
      console.log('Received data from backend:', data); // Debug log for entire response
      console.log('Total travel time from backend:', data.total_travel_time); // Debug log for total travel time
      const formattedTasks = data.tasks.map((task: any, index: number) => {
        console.log('Processing task:', task); // Debug log
        return {
          id: task.id,
          raw_task_id: task.raw_task_id,
          title: task.title,
          timeRange: `${task.start_time} - ${task.end_time}`,
          lat: task.lat,
          lng: task.lng,
          transitMode: task.transit_mode || 'car',
          isCompleted: task.is_completed === true,
          description: task.description || '',
          locationName: task.location_name,
          locationAddress: task.location_address,
          priority: task.priority || 1,
          index: index // Add index to help with ordering
        };
      });
      console.log('Formatted tasks:', formattedTasks); // Debug log
      setTasks(formattedTasks);
      setTotalTravelTime(data.total_travel_time);
      
      // Update task locations with proper ordering
      setTaskLocations(formattedTasks.map((task, index) => ({
        lat: task.lat,
        lng: task.lng,
        title: `${String.fromCharCode(65 + index)}. ${task.title}` // Add letter prefix to title
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
    fetchTasks();
  }, [isAuthenticated, toast]);

  useEffect(() => {
    fetch('http://localhost:8888/api/pending_tasks', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.tasks && data.tasks.length > 0) {
          setHasPendingTasks(true);
          setShowPendingModal(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load pending tasks:', err);
        setHasPendingTasks(false);
        setShowPendingModal(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounceTick(tick => tick + 1);
    }, 2000); // every 2 seconds
    return () => clearInterval(interval);
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
    // Optimistically toggle UI
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
    setTaskLocations(prev => prev.filter(loc => loc.title !== tasks.find(t => t.id === taskId)?.title));
    if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
      setSelectedTaskForModal(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
    }
    // Call backend toggle API in background
    try {
      const response = await fetch(`http://localhost:8888/api/tasks/${taskId}/toggle`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to toggle task status');
      }
      // Optionally, you can refresh tasks here if you want to sync with backend
      // fetchTasks();
    } catch (error) {
      // Revert optimistic update if API fails
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      ));
      setTaskLocations(prev => {
        const toggledTask = tasks.find(t => t.id === taskId);
        if (toggledTask && !toggledTask.isCompleted) {
          // If reverting to not completed, add back to route
          return [...prev, { lat: toggledTask.lat, lng: toggledTask.lng, title: toggledTask.title }];
        }
        return prev;
      });
      if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
        setSelectedTaskForModal(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
      }
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
    setIsNewTaskModalOpen(false); // Close modal immediately after clicking Add Task
    try {
      setNewTaskError(null); // Clear previous errors
      
      // Validate and parse times
      if (!taskData.startTime || !taskData.endTime) {
        throw new Error("Start time and end time are required");
      }

      // Parse the 12-hour time format (e.g., "05:00 PM")
      const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return { hours, minutes };
      };

      const { hours: startHours, minutes: startMinutes } = parseTime(taskData.startTime);
      const { hours: endHours, minutes: endMinutes } = parseTime(taskData.endTime);

      // Create dates in Pacific time
      const pacific = 'America/Los_Angeles';
      const now = new Date();
      const today = new Date(now.toLocaleString('en-US', { timeZone: pacific }));
      today.setHours(0, 0, 0, 0);

      const startTime = new Date(today.toLocaleString('en-US', { timeZone: pacific }));
      startTime.setHours(startHours, startMinutes, 0, 0);

      const endTime = new Date(today.toLocaleString('en-US', { timeZone: pacific }));
      endTime.setHours(endHours, endMinutes, 0, 0);

      // Get current time in Pacific
      const nowPacific = new Date(now.toLocaleString('en-US', { timeZone: pacific }));
      const currentMinutes = nowPacific.getHours() * 60 + nowPacific.getMinutes();
      const startMinutesTotal = startHours * 60 + startMinutes;
      const endMinutesTotal = endHours * 60 + endMinutes;

      // Validate times
      if (startMinutesTotal <= currentMinutes) {
        throw new Error("Start time must be after current Pacific time");
      }
      if (endMinutesTotal <= startMinutesTotal) {
        throw new Error("End time must be after start time");
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
          user_lat: taskData.user_lat,
          user_lng: taskData.user_lng,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
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
      
      // Update tasks list with the new task
      setTasks(prevTasks => [...prevTasks, {
        id: newTask.id,
        raw_task_id: newTask.raw_task_id,
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

      // Update task locations for the map
      if (newTask.lat && newTask.lng) {
        setTaskLocations(prevLocations => [...prevLocations, {
          lat: newTask.lat,
          lng: newTask.lng,
          title: newTask.title
        }]);
      }

      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      setNewTaskError(null); // Clear error on success
      
      // Remove the page reload
      window.location.reload();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to create task. Please try again.";
      setNewTaskError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('http://localhost:8888/api/sync', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to sync tasks');
      }
      await fetchTasks(); // Refresh tasks after sync
      toast({
        title: "Success",
        description: "Tasks synced successfully!",
      });
    } catch (error) {
      console.error('Error syncing tasks:', error);
      toast({
        title: "Error",
        description: "Failed to sync tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleEditTask = (taskToEdit: Task) => {
    console.log('Editing task:', taskToEdit);
    setEditTask(taskToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditTaskSubmit = async (taskData: any, taskId?: string) => {
    if (!taskId) return;
    try {
      // Find the task to get its raw_task_id
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) {
        throw new Error('Task not found');
      }

      // Parse the 12-hour time format (e.g., "05:00 PM")
      const parseTime = (timeStr: string) => {
        if (!timeStr) return null;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return { hours, minutes };
      };

      // Create dates in Pacific time
      const pacific = 'America/Los_Angeles';
      const now = new Date();
      const today = new Date(now.toLocaleString('en-US', { timeZone: pacific }));
      today.setHours(0, 0, 0, 0);

      let startTime = null;
      let endTime = null;

      if (taskData.startTime) {
        const { hours: startHours, minutes: startMinutes } = parseTime(taskData.startTime);
        startTime = new Date(today.toLocaleString('en-US', { timeZone: pacific }));
        startTime.setHours(startHours, startMinutes, 0, 0);
      }

      if (taskData.endTime) {
        const { hours: endHours, minutes: endMinutes } = parseTime(taskData.endTime);
        endTime = new Date(today.toLocaleString('en-US', { timeZone: pacific }));
        endTime.setHours(endHours, endMinutes, 0, 0);
      }

      // Validate times if both are provided
      if (startTime && endTime) {
        const startMinutesTotal = startTime.getHours() * 60 + startTime.getMinutes();
        const endMinutesTotal = endTime.getHours() * 60 + endTime.getMinutes();
        
        if (endMinutesTotal <= startMinutesTotal) {
          throw new Error("End time must be after start time");
        }
      }

      const response = await fetch(`http://localhost:8888/api/tasks/${taskToUpdate.raw_task_id}`, {
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
          start_time: startTime?.toISOString(),
          end_time: endTime?.toISOString(),
          duration: parseInt(taskData.duration) || 45, // Convert duration to integer, default to 45 if invalid
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      // Wait for tasks to refresh before closing modal
      await fetchTasks();
      
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to update task. Please try again.";
      toast({ 
        title: 'Error', 
        description: errorMsg, 
        variant: 'destructive' 
      });
    } finally {
      setIsEditModalOpen(false);
      setEditTask(null);
    }
  };

  const handleDeleteTask = async (taskIdToDelete: string) => {
    try {
      // Find the task to get its raw_task_id
      const taskToDelete = tasks.find(t => t.id === taskIdToDelete);
      if (!taskToDelete) {
        throw new Error('Task not found');
      }

      const response = await fetch(`http://localhost:8888/api/tasks/${taskToDelete.raw_task_id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Fetch fresh tasks from the backend to ensure we have the latest data
      const tasksResponse = await fetch('http://localhost:8888/api/tasks', {
        credentials: 'include'
      });
      if (!tasksResponse.ok) {
        throw new Error('Failed to fetch updated tasks');
      }
      const data = await tasksResponse.json();
      
      // Update tasks list with fresh data
      const formattedTasks = data.tasks.map((task: any, index: number) => ({
        id: task.id,
        raw_task_id: task.raw_task_id,
        title: task.title,
        timeRange: `${task.start_time} - ${task.end_time}`,
        lat: task.lat,
        lng: task.lng,
        transitMode: task.transit_mode || 'car',
        isCompleted: task.is_completed === true,
        description: task.description || '',
        locationName: task.location_name,
        locationAddress: task.location_address,
        priority: task.priority || 1,
        index: index
      }));
      
      // Update both tasks and task locations in a single state update
      setTasks(formattedTasks);
      setTaskLocations(formattedTasks.map((task, index) => ({
        lat: task.lat,
        lng: task.lng,
        title: `${String.fromCharCode(65 + index)}. ${task.title}`
      })));

      toast({ 
        title: "Success", 
        description: "Task has been deleted successfully." 
      });

      // Close modal if the deleted task was being viewed
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

  const parseTimeRange = (timeRange: string | undefined) => {
    if (!timeRange) return { startTime: '', endTime: '' };
    const [start, end] = timeRange.split(' - ');
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

  const taskToTaskData = (task: Task): any => {
    const { startTime, endTime } = parseTimeRange(task.timeRange);
    return {
      title: task.title,
      duration: '',
      location: task.locationAddress || task.locationName || '',
      lat: task.lat,
      lng: task.lng,
      startTime,
      endTime,
      description: task.description,
      priority: task.priority,
    };
  };

  // Find the next upcoming task index
  let nextUpcomingIndex = -1;
  let soonestStart: Date | null = null;
  const now = new Date();
  tasks.forEach((task, idx) => {
    if (task.timeRange) {
      const [start] = task.timeRange.split(' - ');
      const parseTime = (t) => {
        if (!t) return null;
        const [time, modifier] = t.trim().split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const d = new Date(now);
        d.setHours(hours, minutes, 0, 0);
        return d;
      };
      const startTime = parseTime(start);
      if (startTime && startTime > now && (!soonestStart || startTime < soonestStart)) {
        soonestStart = startTime;
        nextUpcomingIndex = idx;
      }
    }
  });

  // Get home address from localStorage
  let homeAddress = '';
  try {
    const prefs = localStorage.getItem('calroute_preferences');
    if (prefs) {
      const parsed = JSON.parse(prefs);
      homeAddress = parsed.homeAddress || '';
    }
  } catch {}

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
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      Syncing...
                    </div>
                  ) : (
                    <>
                      <Sync className="mr-2 h-4 w-4" />
                      Sync Calendar
                    </>
                  )}
                </Button> 
              </div>
            </div>
          </header>
          
          <div className="mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <p className="text-gray-700">
              Your schedule has been optimized for maximum efficiency.
              {totalTravelTime !== null ? (
                ` Total travel time: ${totalTravelTime} minutes.`
              ) : (
                " Calculating total travel time..."
              )}
            </p>
          </div> 

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Today's Tasks</h2>
                  <Button 
                    className="bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)] transition-colors duration-200 px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-base"
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
                    {tasks.map((task, index) => {
                      const isCurrent = index === nextUpcomingIndex;
                      return (
                        <div key={isCurrent ? `bouncy-${task.id}-${bounceTick}` : task.id} className="relative">
                          <TaskCard 
                            task={task} 
                            onClick={handleTaskCardClick}
                            onToggleComplete={() => handleToggleComplete(task.id)}
                            isActive={selectedTaskForModal?.id === task.id && !task.isCompleted}
                            isCurrent={isCurrent}
                            index={index}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
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
          tasks={tasks}
          homeAddress={homeAddress}
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
          window.location.reload();
        }}
      />
    </div>
  );
}
