
import { CheckSquare, Square, Car, Bike, Bus, Footprints, Edit3, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/pages/Homepage';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void; // Changed to pass full task object
  onToggleComplete: () => void;
  isActive: boolean; // To highlight if its details are open in modal
}

// Export transitIcons or ensure it's accessible by TaskDetailModal
export const transitIcons: { [key: string]: JSX.Element } = {
  car: <Car size={18} className="mr-2 text-gray-600" />,
  bike: <Bike size={18} className="mr-2 text-gray-600" />,
  bus: <Bus size={18} className="mr-2 text-gray-600" />,
  walk: <Footprints size={18} className="mr-2 text-gray-600" />,
};

export default function TaskCard({ task, onClick, onToggleComplete, isActive }: TaskCardProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete();
  };

  return (
    <div 
      className={cn(
        "task-card flex justify-between items-center cursor-pointer p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out", 
        isActive && !task.isCompleted && "active bg-calroute-lightBlue border-l-4 border-calroute-blue transform scale-105 shadow-xl", // isActive based on modal state
        task.isCompleted && "bg-gray-100 opacity-60"
      )}
      onClick={() => onClick(task)} // Pass full task object
    >
      <div className="flex items-center">
        <button
          onClick={handleCheckboxClick}
          className="mr-3 p-1 focus:outline-none"
          aria-label={task.isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
        >
          {task.isCompleted ? <CheckSquare size={24} className="text-green-500" /> : <Square size={24} className="text-gray-400" />}
        </button>
        <div>
          <h3 className={cn("font-semibold", task.isCompleted && "line-through text-gray-500")}>{task.title}</h3>
          <p className={cn("text-sm text-gray-500", task.isCompleted && "line-through")}>{task.timeRange}</p>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            {transitIcons[task.transitMode]}
            <span className={cn(task.isCompleted && "line-through")}>
              {task.transitMode.charAt(0).toUpperCase() + task.transitMode.slice(1)}
            </span>
          </div>
        </div>
      </div>
      {/* 3-dot menu removed as edit/delete are in modal */}
    </div>
  );
}
