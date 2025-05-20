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
        "task-card flex justify-between items-center cursor-pointer p-4 rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white/80", 
        isActive && !task.isCompleted && "bg-gradient-to-r from-[rgb(93,224,230)]/10 to-[rgb(0,74,173)]/10 border-l-4 border-[rgb(0,74,173)] transform scale-102 shadow-lg", 
        task.isCompleted && "bg-gray-50/50 opacity-60"
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={handleCheckboxClick}
          className="focus:outline-none transition-transform duration-200 hover:scale-110"
          aria-label={task.isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
        >
          {task.isCompleted ? 
            <CheckSquare size={24} className="text-[rgb(0,74,173)]" /> : 
            <Square size={24} className="text-gray-400 hover:text-[rgb(93,224,230)]" />
          }
        </button>
        <div>
          <h3 className={cn(
            "font-semibold text-gray-800", 
            task.isCompleted && "line-through text-gray-400"
          )}>
            {task.title}
          </h3>
          <p className={cn(
            "text-sm text-gray-500 mt-1", 
            task.isCompleted && "line-through"
          )}>
            {task.timeRange}
          </p>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            {transitIcons[task.transitMode]}
            <span className={cn(
              "text-gray-600",
              task.isCompleted && "line-through"
            )}>
              {task.transitMode.charAt(0).toUpperCase() + task.transitMode.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
