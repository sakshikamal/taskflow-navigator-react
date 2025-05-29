import { CheckSquare, Square, Car, Bike, Bus, Footprints, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/pages/Homepage';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void; // Changed to pass full task object
  onToggleComplete: () => void;
  isActive: boolean; // To highlight if its details are open in modal
  isCurrent?: boolean; // To highlight and animate the current task
  index: number; // New prop for the letter
}

// Export transitIcons or ensure it's accessible by TaskDetailModal
export const transitIcons: { [key: string]: JSX.Element } = {
  car: <Car size={18} className="mr-2 text-gray-600" />,
  bike: <Bike size={18} className="mr-2 text-gray-600" />,
  bus_train: <Bus size={18} className="mr-2 text-gray-600" />,
  walking: <Footprints size={18} className="mr-2 text-gray-600" />,
  rideshare: <Car size={18} className="mr-2 text-gray-600" />
};

export const getTransitModeText = (mode: string) => {
  switch (mode) {
    case 'car': return 'Car';
    case 'bike': return 'Bike';
    case 'bus_train': return 'Bus/Train';
    case 'walking': return 'Walk';
    case 'rideshare': return 'Cab';
    default: return mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : '';
  }
};

export default function TaskCard({ task, onClick, onToggleComplete, isActive, isCurrent, index }: TaskCardProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete();
  };

  // Convert index to letter (A, B, C, ...)
  const letter = String.fromCharCode(65 + index);

  return (
    <div 
      className={cn(
        "task-card flex justify-between items-center cursor-pointer p-4 rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white/80", 
        isActive && !task.isCompleted && "bg-gradient-to-r from-[rgb(93,224,230)]/10 to-[rgb(0,74,173)]/10 border-l-4 border-[rgb(0,74,173)] transform scale-102 shadow-lg", 
        task.isCompleted && "bg-gray-50/50 opacity-60",
        isCurrent && !task.isCompleted && "bg-blue-100 border-blue-400 animate-bounce-short shadow-lg"
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[rgb(0,74,173)] text-white text-xs font-bold mr-2">
          {letter}
        </div>
        <button
          onClick={handleCheckboxClick}
          className="focus:outline-none transition-transform duration-200 hover:scale-110"
          aria-label={task.isCompleted ? "Task completed" : "Mark task as complete"}
          disabled={task.isCompleted}
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
              {task.transitMode === 'walking' ? 'Walk' :
                task.transitMode === 'bus_train' ? 'Bus/Train' :
                task.transitMode === 'rideshare' ? 'Cab' :
                task.transitMode.charAt(0).toUpperCase() + task.transitMode.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <Info size={22} className="text-[rgb(0,74,173)]" />
      </div>
    </div>
  );
}

// Add a custom bounce animation for a short jump
// In your global CSS (e.g., index.css or tailwind.config.js), add:
// @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } 60% { transform: translateY(0); } }
// .animate-bounce-short { animation: bounce-short 0.7s infinite; }
