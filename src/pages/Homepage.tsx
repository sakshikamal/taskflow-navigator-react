import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Map from '@/components/Map';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import NewTaskModal from '@/components/NewTaskModal';
import { AppSidebar } from '@/components/AppSidebar';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw as Sync } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import Preferences from '@/pages/Preferences';

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

// Replace demoTasks with the new hardcoded tasks as specified by the user
const demoTasks: Task[] = [
  // Image 1 tasks
  {
    id: '1',
    title: 'CS Seminar',
    timeRange: '11:00 AM - 12:00 PM',
    lat: 33.6436, // Donald Bren Hall
    lng: -117.8426,
    transitMode: 'bike',
    isCompleted: false,
    description: 'Donald Bren Hall (DBH)',
    locationName: 'Donald Bren Hall (DBH)',
    locationAddress: 'Donald Bren Hall, UC Irvine, CA',
    priority: 1,
  },
  {
    id: '2',
    title: 'ML Class',
    timeRange: '1:00 PM - 2:15 PM',
    lat: 33.6492, // HICF 100P
    lng: -117.8445,
    transitMode: 'bike',
    isCompleted: false,
    description: 'HICF 100P',
    locationName: 'HICF 100P',
    locationAddress: 'HICF 100P, UC Irvine, CA',
    priority: 1,
  },
  {
    id: '3',
    title: 'PDC Discussion',
    timeRange: '2:45 PM - 3:45 PM',
    lat: 33.6465, // Steinhaus Hall
    lng: -117.8441,
    transitMode: 'walk',
    isCompleted: false,
    description: 'Steinhaus Hall',
    locationName: 'Steinhaus Hall',
    locationAddress: 'Steinhaus Hall, UC Irvine, CA',
    priority: 1,
  },
  {
    id: '4',
    title: 'Meeting with Professor',
    timeRange: '5:30 PM - 6:30 PM',
    lat: 33.65058510010861,
    lng: -117.8375080507119,
    transitMode: 'car',
    isCompleted: false,
    description: 'Paul Merage School of Business',
    locationName: 'Paul Merage School of Business',
    locationAddress: '4291 Pereira Dr, Irvine, CA 92697, USA',
    priority: 1,
  },
  // Image 2 tasks
  {
    id: '5',
    title: 'Pick up Groceries',
    timeRange: '4:30 PM - 5:00 PM',
    lat: 33.64668965405487,
    lng: -117.83810980438808,
    transitMode: 'car',
    isCompleted: false,
    description: "Grocery List: Milk, Eggs, Bread, Apples, Spinach",
    locationName: "Trader Joe's",
    locationAddress: '4225 Campus Dr, Irvine, CA 92612',
    priority: 3,
  },
  {
    id: '6',
    title: 'Speak to Mom',
    timeRange: '10:00 PM - 10:30 PM',
    lat: 33.64768098483347,
    lng: -117.83150707005395,
    transitMode: 'walk',
    isCompleted: false,
    description: 'Call Mom at 76000 Verano road',
    locationName: '76000 Verano Rd S',
    locationAddress: '76000 Verano Rd S, Irvine, CA',
    priority: 2,
  },
  {
    id: '7',
    title: 'Go to Gym',
    timeRange: '10:30 PM - 12:00 AM',
    lat: 33.643602412241094,
    lng: -117.82790543554184,
    transitMode: 'bike',
    isCompleted: false,
    description: 'Anteater Recreation Centre\nDuration: 1.5 hours',
    locationName: 'Anteater Recreation Centre',
    locationAddress: '680 California Ave, Irvine, CA 92617, United States',
    priority: 2,
  },
];

function parseTimeToMinutes(timeStr: string) {
  // Expects '5:00 PM' or '17:00'
  if (!timeStr) return 0;
  let [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier) {
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  }
  return hours * 60 + minutes;
}

function getStartMinutes(task: Task) {
  if (!task.timeRange) return 0;
  const [start] = task.timeRange.split(' - ');
  return parseTimeToMinutes(start);
}

// Add a helper to format time to 12-hour format
function formatTo12Hour(time: string) {
  if (!time) return '';
  let [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

export default function Homepage() {
  const { isAuthenticated, loading, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Always keep tasks ordered by start time
  const sortedTasks = [...tasks].sort((a, b) => getStartMinutes(a) - getStartMinutes(b));

  // Update taskLocations to match sortedTasks, but only include incomplete tasks
  const taskLocations = sortedTasks.filter(t => !t.isCompleted).map(t => ({ lat: t.lat, lng: t.lng, title: t.title }));

  // Find the index of the 'PDC Discussion' task for highlighting
  const currentTaskId = sortedTasks.find(t => t.title.toLowerCase().includes('pdc discussion'))?.id;

  const handleTaskCardClick = (task: Task) => {
    setSelectedTaskForModal(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
    if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
      setSelectedTaskForModal(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
    }
  };

  const handleAddNewTask = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleEditTask = (taskToEdit: Task) => {
    setEditTask(taskToEdit);
    setIsNewTaskModalOpen(true);
  };

  const handleDeleteTask = (taskIdToDelete: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setTasks(prev => prev.filter(task => task.id !== taskIdToDelete));
      toast({ title: "Task Deleted", description: `Task has been removed.`});
      if (selectedTaskForModal && selectedTaskForModal.id === taskIdToDelete) {
        handleCloseModal();
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Add 'Urgent work' task if not already present
      const urgentTaskExists = tasks.some(t => t.title === 'Urgent work');
      let updatedTasks = [...tasks];
      if (!urgentTaskExists) {
        updatedTasks.push({
          id: (Date.now() + 100).toString(),
          title: 'Urgent work',
          timeRange: '4:00 PM - 5:00 PM',
          lat: 33.6497, // Humanities Interim Classroom Facility (approximate)
          lng: -117.8442,
          transitMode: 'walk',
          isCompleted: false,
          description: 'Humanities Interim Classroom Facility',
          locationName: 'Humanities Interim Classroom Facility',
          locationAddress: 'Humanities Interim Classroom Facility, UC Irvine, CA',
          priority: 1,
        });
      }
      // Move 'Pick up Groceries' to after 6:30 PM
      updatedTasks = updatedTasks.map(t =>
        t.title === 'Pick up Groceries'
          ? { ...t, timeRange: '6:45 PM - 7:15 PM' }
          : t
      );
      setTasks(updatedTasks);
      setIsSyncing(false);
      toast({ title: "Synced!", description: "Calendar and Todoist tasks have been synced." });
    }, 2000);
  };

  const handleNewTaskSubmit = async (taskData: any, isEdit?: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      if (isEdit && editTask) {
        // Update existing task
        const updatedTasks = tasks.map(t => t.id === editTask.id ? {
          ...t,
          ...taskData,
          timeRange: `${formatTo12Hour(taskData.startTime)} - ${formatTo12Hour(taskData.endTime)}`,
          locationName: taskData.location,
          locationAddress: taskData.location,
        } : t);
        setTasks(updatedTasks);
        toast({ title: "Success", description: "Task updated successfully!" });
      } else {
        // Add new task
        const newTask: Task = {
          id: Date.now().toString(),
          title: taskData.title,
          timeRange: `${formatTo12Hour(taskData.startTime)} - ${formatTo12Hour(taskData.endTime)}`,
          lat: taskData.lat || 33.659,
          lng: taskData.lng || -117.86,
          transitMode: taskData.transitMode || 'car',
          isCompleted: false,
          description: taskData.description || '',
          locationName: taskData.location,
          locationAddress: taskData.location,
          priority: taskData.priority || 1,
        };
        const updatedTasks = [...tasks, newTask].sort((a, b) => getStartMinutes(a) - getStartMinutes(b));
        setTasks(updatedTasks);
        toast({ title: "Success", description: "Task created successfully!" });
      }
      setIsLoading(false);
      setEditTask(null);
    }, 1000);
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
              <Button
                className="bg-white border border-[rgb(0,74,173)] text-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)]/20 transition-colors duration-200 flex items-center gap-2"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? <Spinner className="mr-2" size="sm" /> : <Sync className="mr-2 h-4 w-4" />}
                Sync Calendar/Todoist
              </Button>
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
                  <div className="flex gap-2">
                    <Button 
                      className="bg-[rgb(0,74,173)] text-white hover:bg-[rgb(93,224,230)] transition-colors duration-200"
                      onClick={handleAddNewTask}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                    </Button>
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Spinner className="text-[rgb(0,74,173)]" size="lg" />
                    <p className="mt-4 text-gray-600">Optimizing schedule...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedTasks.map((task, idx) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onClick={handleTaskCardClick}
                        onToggleComplete={() => handleToggleComplete(task.id)}
                        isActive={selectedTaskForModal?.id === task.id && !task.isCompleted}
                        isCurrent={task.id === currentTaskId && !task.isCompleted}
                        index={idx}
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
        onClose={() => { setIsNewTaskModalOpen(false); setEditTask(null); }}
        onSubmit={handleNewTaskSubmit}
        initialData={editTask ? {
          title: editTask.title,
          duration: '', // You may want to parse from timeRange
          location: editTask.locationName || '',
          lat: editTask.lat,
          lng: editTask.lng,
          startTime: editTask.timeRange.split(' - ')[0]?.trim(),
          endTime: editTask.timeRange.split(' - ')[1]?.trim(),
          description: editTask.description,
          priority: editTask.priority,
          transitMode: editTask.transitMode,
        } : undefined}
        isEdit={!!editTask}
      />
    </div>
  );
}
