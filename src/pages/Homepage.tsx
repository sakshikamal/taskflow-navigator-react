import { useEffect, useState } from 'react';
import Map from '@/components/Map';
import TaskCard from '@/components/TaskCard';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  timeRange: string;
  lat: number;
  lng: number;
  isActive?: boolean;
}

export default function Homepage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLocations, setTaskLocations] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
  
    fetch('http://localhost:8888/api/tasks', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const formattedTasks = data.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          timeRange: `${task.start_time} - ${task.end_time}`,
          lat: task.lat,
          lng: task.lng
        }));
        setTasks(formattedTasks);
        setTaskLocations(data.tasks.map((t: any) => ({
          lat: t.lat,
          lng: t.lng,
          title: t.title
        })));
      })
      .catch(console.error);
  }, [isAuthenticated]);

  const handleTaskClick = (taskId: string) => {
    setTasks(tasks.map(task => ({
      ...task,
      isActive: task.id === taskId
    })));
  };

  const handleDynamicSchedule = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        fetch("http://localhost:8888/api/dynamic_schedule", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat, lng }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("Schedule re-optimized!");
              // Optionally re-fetch tasks
              window.location.reload(); // or refetch state
            } else {
              alert(data.error || "Reoptimization failed.");
            }
          })
          .catch((err) => {
            console.error("Dynamic schedule error:", err);
            alert("Failed to reoptimize.");
          });
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    );
  };
  

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1 ml-16">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <h1 className="text-3xl font-bold">Your Schedule</h1>
            <p className="text-xl text-gray-600">Here is your plan for today</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task.id)} />
                  ))}
                </div>
              </div>
              <button
                    onClick={handleDynamicSchedule}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Reoptimize Schedule
                  </button>
            </div>

            <div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Your Route Today</h2>
                <Map routes={{ locations: taskLocations }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
